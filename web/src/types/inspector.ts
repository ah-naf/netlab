/** Returns an error text, or null when the value is valid. */
export type FieldRule = (value: string) => string | null;

/** Route fields as typed text, before they are stored in the lab. */
export interface RouteDraft {
  destination: string;
  gateway: string;
  interfaceId: string;
  metric: string;
}
