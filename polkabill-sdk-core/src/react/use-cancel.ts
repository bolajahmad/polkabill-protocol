import { useContext, useState } from "react";
import { PolkabillContext } from "./context";
import {  type ILifecycle } from "../core/types";

export function useCancel() {
  const client = useContext(PolkabillContext);
  const [state, setState] = useState<ILifecycle>({
    status: "idle",
  });

  if (!client) throw new Error("PolkabillProvider missing");

  const cancel = async (subscriptionId: bigint) => {
    await client.cancel(subscriptionId, setState);
  };

  return { cancel, state };
}