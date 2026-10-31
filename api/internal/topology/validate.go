package topology

import "sort"

type rule func(doc Document) []Issue

// rules run in this order; the order of results is fixed by the sort in Validate.
var rules = []rule{idRules, nameRules, linkRules, nodeRules, addressRules}

var codeRank = func() map[Code]int {
	rank := make(map[Code]int, len(codeOrder))
	for i, code := range codeOrder {
		rank[code] = i
	}
	return rank
}()

func issueLess(a, b Issue) bool {
	if codeRank[a.Code] != codeRank[b.Code] {
		return codeRank[a.Code] < codeRank[b.Code]
	}
	return a.ResourceID < b.ResourceID
}

// Validate returns every issue in the document: by code, then by resource id.
// It never changes doc and never returns nil.
func Validate(doc Document) []Issue {
	issues := []Issue{}
	for _, r := range rules {
		issues = append(issues, r(doc)...)
	}
	sort.SliceStable(issues, func(i, j int) bool { return issueLess(issues[i], issues[j]) })
	return issues
}
