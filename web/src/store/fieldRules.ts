import {
  FIELD_ERROR,
  INTERFACE_NAME_MAX,
  MTU_MAX,
  MTU_MIN,
} from "../constants/inspector";
import type { RouteDraft } from "../types/inspector";
import type { Document } from "../types/topology";
import { isCidr, isIpAddress } from "./ipAddress";

const WHITESPACE = /\s/;
const WHOLE_NUMBER = /^\d+$/;
const RESERVED_NAMES = [".", ".."];

const interfaceOf = (document: Document, interfaceId: string) =>
  document.interfaces.find((i) => i.id === interfaceId);

export function validateInterfaceName(
  document: Document,
  interfaceId: string,
  name: string,
): string | null {
  if (!name) return FIELD_ERROR.NAME_EMPTY;
  if (name.length > INTERFACE_NAME_MAX) return FIELD_ERROR.NAME_LONG;
  if (name.includes("/") || WHITESPACE.test(name))
    return FIELD_ERROR.NAME_CHARS;
  if (RESERVED_NAMES.includes(name)) return FIELD_ERROR.NAME_DOT;
  const nodeId = interfaceOf(document, interfaceId)?.nodeId;
  const taken = document.interfaces.some(
    (i) => i.nodeId === nodeId && i.id !== interfaceId && i.name === name,
  );
  return taken ? FIELD_ERROR.NAME_TAKEN : null;
}

export function validateMtu(text: string): string | null {
  const valid =
    WHOLE_NUMBER.test(text) &&
    Number(text) >= MTU_MIN &&
    Number(text) <= MTU_MAX;
  return valid ? null : FIELD_ERROR.MTU_RANGE;
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
