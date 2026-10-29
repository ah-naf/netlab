import { readFileSync } from "node:fs";
import { parseDocument } from "../src/types/topologyDocument.ts";

const JSON_INDENT = 2;

const doc = parseDocument(readFileSync(process.argv[2], "utf8"));
console.log(JSON.stringify(doc, null, JSON_INDENT));
