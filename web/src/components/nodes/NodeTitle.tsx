import { useEffect, useRef, useState } from "react";
import { NODE_NAME_LABEL } from "../../constants/palette";
import { useTopologyStore } from "../../store/topologyStore";

interface Props {
  nodeId: string;
  name: string;
}

export default function NodeTitle({ nodeId, name }: Props) {
  const renameNode = useTopologyStore((s) => s.renameNode);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) input.current?.select();
  }, [editing]);

  const start = () => {
    setDraft(name);
    setError(null);
    setEditing(true);
  };
  const cancel = () => {
    setEditing(false);
    setError(null);
  };
  const commit = () => {
    const problem = renameNode(nodeId, draft);
    setError(problem);
    if (!problem) setEditing(false);
  };
  const onKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
    if (event.key === "Enter") commit();
    if (event.key === "Escape") cancel();
  };

  if (!editing)
    return (
      <span
        className="min-w-0 flex-1 truncate"
        title={name}
        onDoubleClick={start}
      >
        {name}
      </span>
    );

  return (
    <span className="min-w-0 flex-1">
      <input
        ref={input}
        autoFocus
        aria-label={NODE_NAME_LABEL}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={cancel}
        className="nodrag nopan w-full border border-signal bg-panel px-1 text-sm font-semibold text-ink"
      />
      {error && (
        <span role="alert" className="block text-xs font-normal text-led-fault">
          {error}
        </span>
      )}
    </span>
  );
}
