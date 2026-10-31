# Contract: Lab file and load errors

## File
- Extension `.netlab.json`; content type `application/json`; UTF-8 text.
- Content is one lab document in the current schema (`docs/topology.schema.json`), indented two spaces, trailing newline.
- Save then open then save gives the same text (stable key order comes from the document).
- Max size accepted: 5 MB.

## Load errors (exact causes, shown in the notice banner)
| Cause | When | Message (texts live in `constants/labFile.ts`) |
|---|---|---|
| Not JSON | `JSON.parse` throws | "This file is not valid JSON." |
| Not a lab | value is not an object, or `schemaVersion` missing or not a number, or `lab` is not an object with string `id` and `name`, or `nodes`, `interfaces`, or `links` is present and not an array, or an element has the wrong shape (node: string `id`, `name`, `type`; interface: string `id`, `nodeId`, `name`; link: string `id`, `endpointA`, `endpointB`) | "This file is not a NetLab lab file." |
| Unsupported version | `migrate()` throws | "This file uses schema version N, which this app does not support." |
| Too large | file over 5 MB | "This file is too large to open (limit 5 MB)." |
| Many files | drop with more than one file | "Only one file can be opened at a time." |

On any error the current lab, selection, history, baseline, and draft stay as they were.

## Behavior rules
- Accepted by content, not by name.
- A parsed lab with validator issues loads; the Issues tab opens and an info notice gives the count.
- `migrate()` is the only place that converts versions.

## Examples folder
Files in `examples/*.json` follow this same format. Required: `bridge-lab.json`, `direct-link.json`, `router-two-subnets.json`. Every one except the router example has no validator errors (`checkExamples.ts`).
