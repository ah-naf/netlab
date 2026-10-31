import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ISSUE_CODE } from "../src/constants/validation.ts";
import { validate } from "../src/store/validation/validate.ts";
import type { Document } from "../src/types/topology.ts";

const VECTOR_DIR = fileURLToPath(
  new URL("../../testdata/validation/", import.meta.url),
);
const SPEED_LIMIT_MS = 1000;
const NAMESPACES = 60;
const BRIDGES = 10;
const PORTS_PER_BRIDGE = 4;
const LINKS = 30;

const kebab = (code: string) => code.toLowerCase().replaceAll("_", "-");
const sorted = (list: string[]) => [...list].sort().join(",");

function checkVectors(): { files: string[]; failed: number } {
  const files = readdirSync(VECTOR_DIR).filter((f) => f.endsWith(".json"));
  let failed = 0;
  for (const file of files) {
    const vector = JSON.parse(readFileSync(VECTOR_DIR + file, "utf8"));
    const actual = validate(vector.document).map((i) => i.code);
    const ok = sorted(actual) === sorted(vector.expectedCodes);
    if (!ok) failed++;
    console.log(
      ok
        ? `ok    ${file}`
        : `FAIL  ${file}: expected [${vector.expectedCodes}] got [${actual}]`,
    );
  }
  return { files, failed };
}

function missingCoverage(files: string[]): string[] {
  return Object.keys(ISSUE_CODE).flatMap((code) =>
    ["fail", "ok"]
      .filter(
        (kind) => !files.some((f) => f.startsWith(`${kebab(code)}-${kind}`)),
      )
      .map((kind) => `${kebab(code)}-${kind}`),
  );
}

/** 200 valid resources: 70 nodes, 100 interfaces, 30 links. */
function bigLab(): Document {
  const nodes = [
    ...Array.from({ length: NAMESPACES }, (_, i) => ({
      id: `n${i}`,
      name: `ns${i}`,
      type: "namespace" as const,
    })),
    ...Array.from({ length: BRIDGES }, (_, i) => ({
      id: `b${i}`,
      name: `br${i}`,
      type: "bridge" as const,
      bridge: { stp: false },
    })),
  ];
  const make = (id: string, nodeId: string, name: string, cidr?: string) => ({
    id,
    nodeId,
    name,
    mtu: 1500,
    state: "up" as const,
    addresses: cidr ? [{ cidr }] : undefined,
  });
  const interfaces = [
    ...Array.from({ length: NAMESPACES }, (_, i) =>
      make(`e${i}`, `n${i}`, "eth0", `10.${i}.0.1/24`),
    ),
    ...Array.from({ length: BRIDGES * PORTS_PER_BRIDGE }, (_, i) =>
      make(
        `p${i}`,
        `b${Math.floor(i / PORTS_PER_BRIDGE)}`,
        `port${i % PORTS_PER_BRIDGE}`,
      ),
    ),
  ];
  const links = Array.from({ length: LINKS }, (_, i) => ({
    id: `l${i}`,
    endpointA: `e${i}`,
    endpointB: `p${i}`,
    kind: "veth" as const,
    mtu: 1500,
    state: "up" as const,
  }));
  return {
    schemaVersion: 1,
    lab: { id: "a1b2", name: "big" },
    nodes,
    interfaces,
    links,
  };
}

const { files, failed } = checkVectors();
const missing = missingCoverage(files);
missing.forEach((name) => console.log(`MISSING vector ${name}`));

const lab = bigLab();
const start = performance.now();
const bigIssues = validate(lab);
const elapsed = performance.now() - start;
console.log(
  `speed: ${elapsed.toFixed(1)} ms for ${lab.nodes.length + lab.interfaces.length + lab.links.length} resources, ${bigIssues.length} issues`,
);

const slow = elapsed >= SPEED_LIMIT_MS || bigIssues.length > 0;
process.exit(failed || missing.length || slow ? 1 : 0);
