import type { RouteDraft } from "../types/inspector";
import type { Route } from "../types/topology";

export const EMPTY_ROUTE_DRAFT: RouteDraft = {
  destination: "",
  gateway: "",
  interfaceId: "",
  metric: "",
};

export const draftOf = (route: Route): RouteDraft => ({
  destination: route.destination,
  gateway: route.gateway ?? "",
  interfaceId: route.interfaceId ?? "",
  metric: route.metric === undefined ? "" : String(route.metric),
});

/** Empty optional fields are left out of the stored route. */
export const toRoute = (draft: RouteDraft): Route => ({
  destination: draft.destination,
  ...(draft.gateway && { gateway: draft.gateway }),
  ...(draft.interfaceId && { interfaceId: draft.interfaceId }),
  ...(draft.metric && { metric: Number(draft.metric) }),
});
