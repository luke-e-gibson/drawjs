import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { DrawProvider } from "../lib/react.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DrawProvider>
      <App />
    </DrawProvider>
  </StrictMode>
);
