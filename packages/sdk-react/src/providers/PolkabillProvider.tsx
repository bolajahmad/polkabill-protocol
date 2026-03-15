import { createContext, useContext } from "react";
import { PolkabillClient } from "@polkabill/sdk-core";

const Context = createContext<PolkabillClient | null>(null);

export function PolkabillProvider({
    client,
    children
}: any) {
    return (
        <Context.Provider value={client}>
            {children}
        </Context.Provider>
    )
}

export function usePolkabill() {
    const ctx = useContext(Context);

    if (!ctx) throw new Error("usePolkabill must be used within a PolkabillProvider");

    return ctx;
}

export default PolkabillProvider;