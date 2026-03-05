import { PolkabillProvider } from "@polkabill/react";
import { PolkabillClient } from "@polkabill/sdk-core";
import { useMemo, type ReactNode } from "react";
import { createPublicClient, http } from "viem";
import { useConnection } from "wagmi";

export const RootContext = ({ children }: { children: ReactNode }) => {
  const { chain } = useConnection();
  
  const client = useMemo(() => {
    return createPublicClient({
      chain,
      transport: http("https://base-sepolia.gateway.tenderly.co"),
    });
  }, [chain]);

  const polkabill = useMemo(() => {
    return new PolkabillClient({ publicClient: client as any });
  }, [client]); 

  return (
    <PolkabillProvider client={{ polkabill}}>
      {children}
    </PolkabillProvider>
  );
};
