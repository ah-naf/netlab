import { Component, type ReactNode } from "react";
import { SECTION_ERROR } from "../../constants/inspector";
import ActionButton from "../nodes/ActionButton";

interface State {
  failed: boolean;
}

/** Keeps one failing group from blanking the rest of the panel. */
export default class SectionBoundary extends Component<
  { children: ReactNode },
  State
> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="px-3 py-2 text-xs">
        <p role="alert" className="text-led-fault">
          {SECTION_ERROR.TEXT}
        </p>
        <ActionButton onClick={() => this.setState({ failed: false })}>
          {SECTION_ERROR.RETRY}
        </ActionButton>
      </div>
    );
  }
}
