import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/lib/theme";
import { QACenter } from "./features/qa-center/components/QACenter";
import App from "@/App";

// Mount into #qa-root when overlaid on a host page, otherwise use #root
const mountEl = document.getElementById("qa-root") ?? document.getElementById("root")!;

const isOverlay = mountEl.id === "qa-root";

createRoot(mountEl).render(
  <StrictMode>
    <ThemeProvider>
      {!isOverlay && <App />}
      <QACenter
        neko={true}
        ownTheme={false}
        name="My App QA - Jep"
        port={3333}
        buttonColor={{ dark: "#406093", light: "#91D06C" }}
        logo="💾"
      />
    </ThemeProvider>
  </StrictMode>
);
