import { STATE_CHOICES } from "../../constants/inspector";
import {
  BRIDGE_LINK_FIELD_LABEL,
  BRIDGE_LINK_GROUP_TITLE,
} from "../../constants/inspectorBridgeLink";
import { setLinkState } from "../../store/bridgeLinkOps";
import { useTopologyStore } from "../../store/topologyStore";
import type { State } from "../../types/topology";
import LinkEndpoint from "./LinkEndpoint";
import Section from "./Section";
import SelectField from "./SelectField";

export default function LinkForm({ linkId }: { linkId: string }) {
  const link = useTopologyStore((s) =>
    s.document.links.find((l) => l.id === linkId),
  );
  const edit = useTopologyStore((s) => s.edit);
  if (!link) return null;

  return (
    <div>
      <Section title={BRIDGE_LINK_GROUP_TITLE.LINK}>
        <div className="space-y-2 px-3 pb-3">
          <SelectField
            label={BRIDGE_LINK_FIELD_LABEL.LINK_STATE}
            value={link.state}
            options={STATE_CHOICES}
            onChange={(state) =>
              edit((d) => setLinkState(d, linkId, state as State))
            }
          />
        </div>
      </Section>
      <Section title={BRIDGE_LINK_GROUP_TITLE.ENDPOINT_A}>
        <LinkEndpoint interfaceId={link.endpointA} />
      </Section>
      <Section title={BRIDGE_LINK_GROUP_TITLE.ENDPOINT_B}>
        <LinkEndpoint interfaceId={link.endpointB} />
      </Section>
    </div>
  );
}
