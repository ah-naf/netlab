import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import exampleLab from "../../examples/bridge-lab.json";
import { useTopologyStore } from "./store/topologyStore";
import { migrate } from "./types/topologyDocument";

useTopologyStore.getState().loadDocument(migrate(exampleLab));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
