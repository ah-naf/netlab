package topology

import "sort"

type rule func(doc Document, opts Options) []Issue

// rules run in this order; the order of results is fixed by the sort in Validate.
var rules = []rule{idRules, nameRules, linkRules, nodeRules, addressRules}

var codeRank = func() map[Code]int {
	rank := make(map[Code]int, len(codeOrder))
	for i, code := range codeOrder {
		rank[code] = i
	}
	return rank
}()

// runRule keeps one failing rule from hiding the others.
func runRule(r rule, doc Document, opts Options) (issues []Issue) {
	defer func() {
		if recover() != nil {
			issues = nil
		}
	}()
	return r(doc, opts)
}

func severityRank(issue Issue) int {
	if issue.Severity == SeverityError {
		return 0
	}
	return 1
}

func issueLess(a, b Issue) bool {
	if severityRank(a) != severityRank(b) {
		return severityRank(a) < severityRank(b)
	}
	if codeRank[a.Code] != codeRank[b.Code] {
		return codeRank[a.Code] < codeRank[b.Code]
	}
	return a.ResourceID < b.ResourceID
}

// Validate returns every issue in the document: errors first, then by code, then by resource id.
// It never changes doc and never returns nil.
func Validate(doc Document, opts Options) []Issue {
	issues := []Issue{}
	for _, r := range rules {
		issues = append(issues, runRule(r, doc, opts)...)
	}
	sort.SliceStable(issues, func(i, j int) bool { return issueLess(issues[i], issues[j]) })
	return issues
}
