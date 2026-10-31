import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { LOAD_ERROR, NEEDS_M5_FILES } from "../src/constants/labFile.ts";
import { SEVERITY } from "../src/constants/validation.ts";
import { parseLabFile, serializeLab } from "../src/store/labFile.ts";
import { validate } from "../src/store/validation/validate.ts";
import type { Document } from "../src/types/topology.ts";

const EXAMPLE_DIR = fileURLToPath(new URL("../../examples/", import.meta.url));
const REQUIRED = [
  "bridge-lab.json",
  "direct-link.json",
  "router-two-subnets.json",
];
const SPEED_LIMIT_MS = 2000;
const NODES = 70;
const INTERFACES = 100;
const LINKS = 30;

const problems: string[] = [];
const fail = (text: string) => problems.push(text);

function checkExample(file: string) {
  const text = readFileSync(EXAMPLE_DIR + file, "utf8");
  const result = parseLabFile(text);
  if (!result.ok) return fail(`${file}: ${result.error}`);
  const issues = validate(result.document);
  const errors = issues.filter((i) => i.severity === SEVERITY.ERROR);
  const needsM5 = NEEDS_M5_FILES.includes(file);
  if (errors.length && !needsM5)
    fail(`${file}: errors ${errors.map((i) => i.code)}`);
  const once = serializeLab(result.document);
  const again = parseLabFile(once);
  if (!again.ok || serializeLab(again.document) !== once)
    fail(`${file}: save, open, save changed the text`);
  console.log(
    `ok    ${file}${needsM5 ? " (needs M5)" : ""} ${issues.length ? `issues: ${issues.map((i) => i.code)}` : ""}`,
  );
}

function bigLab(): Document {
  const make = (i: number) => ({
    id: `i${i}`,
    nodeId: `n${i % NODES}`,
    name: `eth${Math.floor(i / NODES)}`,
    state: "up" as const,
  });
  return {
    schemaVersion: 1,
    lab: { id: "a1b2", name: "big" },
    nodes: Array.from({ length: NODES }, (_, i) => ({
      id: `n${i}`,
      name: `ns${i}`,
      type: "namespace" as const,
    })),
    interfaces: Array.from({ length: INTERFACES }, (_, i) => make(i)),
    links: Array.from({ length: LINKS }, (_, i) => ({
      id: `l${i}`,
      endpointA: `i${i}`,
      endpointB: `i${i + LINKS}`,
      kind: "veth" as const,
      state: "up" as const,
    })),
  };
}

function checkSpeed() {
  const lab = bigLab();
  const start = performance.now();
  const parsed = parseLabFile(serializeLab(lab));
  const elapsed = performance.now() - start;
  console.log(
    `speed: ${elapsed.toFixed(1)} ms for save plus parse of 200 resources`,
  );
  if (!parsed.ok || elapsed >= SPEED_LIMIT_MS)
    fail("speed: too slow or failed");
}

function checkBadInput(label: string, text: string, expected: string) {
  const result = parseLabFile(text);
  const ok = !result.ok && result.error === expected;
  console.log(`${ok ? "ok   " : "FAIL "} bad input: ${label}`);
  if (!ok) fail(`bad input ${label}: expected "${expected}"`);
}

const files = readdirSync(EXAMPLE_DIR).filter((f) => f.endsWith(".json"));
REQUIRED.filter((f) => !files.includes(f)).forEach((f) => fail(`missing ${f}`));
files.forEach(checkExample);
checkSpeed();
const empty = '{"schemaVersion":1,"lab":{"id":"","name":""}';
checkBadInput("broken JSON", "{ not json", LOAD_ERROR.NOT_JSON);
checkBadInput("not a lab", '{"hello":1}', LOAD_ERROR.NOT_A_LAB);
checkBadInput(
  "garbage element",
  `${empty},"nodes":[1],"interfaces":[],"links":[]}`,
  LOAD_ERROR.NOT_A_LAB,
);
checkBadInput(
  "unknown version",
  '{"schemaVersion":99,"lab":{"id":"","name":""},"nodes":[]}',
  LOAD_ERROR.unsupportedVersion(99),
);

problems.forEach((p) => console.log(`FAIL  ${p}`));
process.exit(problems.length ? 1 : 0);
