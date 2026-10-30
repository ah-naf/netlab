const IPV4_PARTS = 4;
const IPV4_PART_MAX = 255;
const IPV4_PREFIX_MAX = 32;
const IPV6_PREFIX_MAX = 128;
const WHOLE_NUMBER = /^\d+$/;

export const isIpv4 = (text: string): boolean => {
  const parts = text.split(".");
  return (
    parts.length === IPV4_PARTS &&
    parts.every((p) => WHOLE_NUMBER.test(p) && Number(p) <= IPV4_PART_MAX)
  );
};

/** The URL parser already implements IPv6 address parsing. */
export const isIpv6 = (text: string): boolean => {
  if (!text.includes(":")) return false;
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
