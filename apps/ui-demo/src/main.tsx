import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import App from "./App.tsx";
import { RootContext } from "./context/RootContext.tsx";
import "./index.css";
import { getConfig } from "./wallet/wagmi.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={getConfig()}>
      <RootContext>
        <App />
      </RootContext>
    </WagmiProvider>
  </StrictMode>,
);
