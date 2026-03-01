import { createContext } from "react";
import { PolkabillClient } from "../core/client";

export const PolkabillContext = createContext<PolkabillClient | null>(null);
