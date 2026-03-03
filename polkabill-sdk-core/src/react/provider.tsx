import type { ReactNode } from "react";
import { PolkabillContext } from "./context";
import { PolkabillClient } from "../core/client";

interface Props {
  client: PolkabillClient;
  children: ReactNode;
}

export function PolkabillProvider({ client, children }: Props) {
  return (
    <PolkabillContext.Provider value={client}>
      {children}
    </PolkabillContext.Provider>
  );
}