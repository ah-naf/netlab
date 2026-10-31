import {} from "../constants/inspectorBridgeLink";
import { ISSUE_MESSAGE } from "../constants/validation";
import { FIELD_ERROR } from "../constants/inspector";
import type { RouteDraft } from "../types/inspector";
import type { Document } from "../types/topology";
import { isCidr, isIpAddress } from "./ipAddress";
import { interfaceNameCodes } from "./validation/nameRules";

const WHOLE_NUMBER = /^\d+$/;

const interfaceOf = (document: Document, interfaceId: string) =>
  document.interfaces.find((i) => i.id === interfaceId);

export function validateInterfaceName(
  document: Document,
  interfaceId: string,
  name: string,
): string | null {
  const [code] = interfaceNameCodes(document, interfaceId, name);
  return code ? ISSUE_MESSAGE[code] : null;
}

export function validateAddress(
  document: Document,
  interfaceId: string,
  text: string,
): string | null {
  if (!isCidr(text)) return FIELD_ERROR.CIDR_INVALID;
  const exists = interfaceOf(document, interfaceId)?.addresses?.some(
    (a) => a.cidr === text,
  );
  return exists ? FIELD_ERROR.ADDRESS_DUPLICATE : null;
}

/** Empty is allowed: it means no gateway. */
export const validateGateway = (text: string): string | null =>
  !text || isIpAddress(text) ? null : FIELD_ERROR.GATEWAY_INVALID;

export const validateDestination = (text: string): string | null =>
  isCidr(text) ? null : FIELD_ERROR.CIDR_INVALID;

/** Empty is allowed: the metric is optional. */
export const validateMetric = (text: string): string | null =>
  !text || WHOLE_NUMBER.test(text) ? null : FIELD_ERROR.METRIC_INVALID;

export function validateRoute(draft: RouteDraft): string | null {
  return (
    validateDestination(draft.destination) ??
    validateGateway(draft.gateway) ??
    validateMetric(draft.metric) ??
    (draft.gateway || draft.interfaceId ? null : FIELD_ERROR.ROUTE_NEXT_HOP)
  );
}

export const validateLabName = (text: string): string | null =>
  text.trim() ? null : FIELD_ERROR.LAB_NAME_EMPTY;
