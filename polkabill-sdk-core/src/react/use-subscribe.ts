import { useContext, useState } from "react";
import { PolkabillContext } from "./context";
import { type ILifecycle } from "../core/types";

export function useSubscribe() {
  const client = useContext(PolkabillContext);
  const [state, setState] = useState<ILifecycle>({
    status: "idle",
  });

  if (!client) throw new Error("PolkabillProvider missing");

  const subscribe = async (planId: bigint) => {
    await client.subscribe(planId, setState);
  };

  return { subscribe, state };
}