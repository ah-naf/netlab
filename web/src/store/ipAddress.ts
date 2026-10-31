const IPV4_PARTS = 4;
const IPV4_PART_MAX = 255;
const IPV4_PREFIX_MAX = 32;
const IPV6_PREFIX_MAX = 128;
const WHOLE_NUMBER = /^\d+$/;
const IPV6_CHARS = /^[0-9a-fA-F:.]+$/;

export const isIpv4 = (text: string): boolean => {
  const parts = text.split(".");
  return (
    parts.length === IPV4_PARTS &&
    parts.every((p) => WHOLE_NUMBER.test(p) && Number(p) <= IPV4_PART_MAX)
  );
};

/** The URL parser already implements IPv6 address parsing. */
export const isIpv6 = (text: string): boolean => {
  if (!text.includes(":") || !IPV6_CHARS.test(text)) return false;
  try {
    new URL(`http://[${text}]/`);
    return true;
  } catch {
    return false;
  }
};

export const isIpAddress = (text: string): boolean =>
  isIpv4(text) || isIpv6(text);

/** An address, a slash, and a prefix length; host bits may be set. */
export function isCidr(text: string): boolean {
  const [address, prefix, ...rest] = text.split("/");
  if (rest.length || prefix === undefined || !WHOLE_NUMBER.test(prefix))
    return false;
  if (isIpv4(address)) return Number(prefix) <= IPV4_PREFIX_MAX;
  return isIpv6(address) && Number(prefix) <= IPV6_PREFIX_MAX;
}

const IPV4_BITS = 32;
const IPV6_BITS = 128;
const IPV4_PART_BITS = 8n;
const IPV6_GROUP_BITS = 16n;
const IPV6_GROUPS = 8;
const HEX = 16;

interface ParsedIp {
  value: bigint;
  bits: number;
}

const v4Value = (text: string): bigint =>
  text.split(".").reduce((n, p) => (n << IPV4_PART_BITS) | BigInt(p), 0n);

const v6Groups = (part: string): bigint[] =>
  part
    ? part.split(":").flatMap((g) => {
        if (!g.includes(".")) return [BigInt(parseInt(g, HEX))];
        const v4 = v4Value(g);
        return [v4 >> IPV6_GROUP_BITS, v4 & 0xffffn];
      })
    : [];

function v6Value(text: string): bigint {
  const [head, tail] = text.split("::");
  const first = v6Groups(head);
  const groups =
    tail === undefined
      ? first
      : [
          ...first,
          ...Array<bigint>(
            IPV6_GROUPS - first.length - v6Groups(tail).length,
          ).fill(0n),
          ...v6Groups(tail),
        ];
  return groups.reduce((n, g) => (n << IPV6_GROUP_BITS) | g, 0n);
}

/** Null when the text is not an IP address. */
export function parseIp(text: string): ParsedIp | null {
  if (isIpv4(text)) return { value: v4Value(text), bits: IPV4_BITS };
  if (isIpv6(text)) return { value: v6Value(text), bits: IPV6_BITS };
  return null;
}

/** True when the address lies inside the CIDR; different IP families never match. */
export function cidrContains(cidr: string, ip: string): boolean {
  const [network, prefix] = cidr.split("/");
  const net = parseIp(network);
  const addr = parseIp(ip);
  if (!net || !addr || net.bits !== addr.bits) return false;
  const shift = BigInt(net.bits - Number(prefix));
  return net.value >> shift === addr.value >> shift;
}
