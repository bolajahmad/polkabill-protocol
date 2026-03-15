import z from "zod";

export const createAdapterSchema = z.object({
  chainId: z
    .string()
    .min(1, "Chain ID is required")
    .transform((i) => Number(i))
    .refine((n) => n > 0, "Chain ID must be a positive number"),
  adapter: z
    .string()
    .min(1, "Adapter address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"),
});

export const createAdapterSchemaLooseChain = z.object({
    chainId: z
        .string()
        .min(1, "Chain ID is required")
        .regex(/\//,  "Chain ID must include a forward slash"),
    adapter: z
        .string()
        .min(1, "Adapter address is required")
        .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"),
});