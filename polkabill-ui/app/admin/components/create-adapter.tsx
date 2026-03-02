"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChainRegistryContractAddress } from "@/lib/contracts";
import { toast } from "sonner";
import { ChainRegistryContractABI } from "@/lib/contracts/abi/chain-registry.abi";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, ShieldCheck, X, XIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useWriteContract } from "wagmi";
import z from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const createAdapterSchema = z.object({
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

const tokensSchema = z.object({
  tokens: z
    .array(
      z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"),
    )
    .min(1, "Add at least one token address.")
    .max(5, "You can add up to 5 token addresses."),
});

type Props = {
  chainId?: number;
};

/**
 * Creates a new billing adapter, the code hash is deployed on chain, technically
 * Submit a chainID, adapter address to create adapter
 *
 * If successful, optionally create tokens allowed on the adapter.
 * Create tokens takes a list of tokens and (adds them if no tokens)
 * Or removes them, if updating config
 * @param param0
 * @returns
 */
export const UpdateAdapterConfig = ({ chainId }: Props) => {
  const [open, setOpen] = useState(false);
  const [tokens, setTokens] = useState([]);
  const form = useForm({
    resolver: zodResolver(createAdapterSchema),
    defaultValues: {
      chainId: "",
      adapter: "",
    },
  });
  const tokenForm = useForm<z.infer<typeof tokensSchema>>({
    resolver: zodResolver(tokensSchema),
    defaultValues: {
      tokens: [""],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: tokenForm.control,
    name: "tokens",
  });
  const {
    mutate: createBillingAdapter,
    error: createAdapterError,
    isPending,
    isSuccess,
  } = useWriteContract();
  const { mutate: updateSupportedTokens, error: updateTokensError } =
    useWriteContract();

  const onSubmit = (formData: Record<string, string | number>) => {
    // Handle form submission
    console.log("Form data:", formData);
    // Call mutate to submit to blockchain
    const cid = BigInt(formData.chainId || 0);
    createBillingAdapter({
      abi: ChainRegistryContractABI,
      address: ChainRegistryContractAddress,
      functionName: "registerChain",
      args: [cid, formData.adapter as `0x${string}`],
    });
  };

  const handleTokensUpdate = (data: Record<string, string[]>) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
    const chainId = form.watch("chainId");

    updateSupportedTokens({
      abi: ChainRegistryContractABI,
      address: ChainRegistryContractAddress,
      functionName: "setTokenSupport",
      args: [BigInt(chainId), data.tokens[0] as `0x${string}`, true],
    });
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl"
      >
        {chainId ? "Update Chain" : "Add New Chain"}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        {/* Backdrop */}
        <DialogBackdrop
          className="fixed inset-0 bg-black/30"
          aria-hidden="true"
        />

        {/* Full-screen container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {isSuccess ? (
            // Display the Token update modal also
            <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <DialogTitle className="text-xl font-bold">
                  Add supported tokens to Adapter
                </DialogTitle>
                <button
                  onClick={() => setOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form and content */}
              <div className="mb-4">
                <div className="space-y-4">
                  <p className="text-sm text-neutral-500">
                    Please confirm that the Tokens exist on the specified chains
                    before proceeding.
                  </p>

                  {updateTokensError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-2 text-rose-600 text-xs">
                      <AlertTriangle size={16} className="shrink-0" />
                      <p>
                        {updateTokensError.message ||
                          "Transaction failed. Please try again."}
                      </p>
                    </div>
                  )}

                  <form
                    id="form-rhf-tokens"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <FieldSet className="gap-4">
                      <FieldLegend>Token Address(es)</FieldLegend>
                      <FieldDescription>
                        Enter up to 5 addresses where adapter can receive
                        tokens.
                      </FieldDescription>

                      <FieldGroup className="gap-4">
                        {fields.map((field, index) => {
                          return (
                            <Controller
                              key={field.id}
                              name={`tokens.${index}`}
                              control={tokenForm.control}
                              render={({ field: cField, fieldState }) => (
                                <Field
                                  orientation="horizontal"
                                  data-invalid={fieldState.invalid}
                                >
                                  <FieldContent>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...cField}
                                        id={`form-rhf-array-token-${index}`}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="0x0000"
                                        type="text"
                                        autoComplete="address"
                                      />
                                      {fields.length > 1 && (
                                        <InputGroupAddon align="inline-end">
                                          <InputGroupButton
                                            type="button"
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => remove(index)}
                                            aria-label={`Remove email ${index + 1}`}
                                          >
                                            <XIcon />
                                          </InputGroupButton>
                                        </InputGroupAddon>
                                      )}
                                    </InputGroup>
                                    {fieldState.invalid && (
                                      <FieldError errors={[fieldState.error]} />
                                    )}
                                  </FieldContent>
                                </Field>
                              )}
                            />
                          );
                        })}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append("")}
                          disabled={fields.length >= 5}
                        >
                          Add Token
                        </Button>
                      </FieldGroup>
                      {tokenForm.formState.errors.tokens?.root && (
                        <FieldError
                          errors={[tokenForm.formState.errors.tokens.root]}
                        />
                      )}
                    </FieldSet>
                  </form>
                </div>
              </div>
            </DialogPanel>
          ) : (
            <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <DialogTitle className="text-xl font-bold">
                  Register a new Adapter
                </DialogTitle>
                <button
                  onClick={() => setOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <div className="space-y-4">
                  <p className="text-sm text-neutral-500">
                    To become a new adapter, you need to deploy the adapter
                    contract template on-chain.
                  </p>

                  {createAdapterError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-2 text-rose-600 text-xs">
                      <AlertTriangle size={16} className="shrink-0" />
                      <p>
                        {createAdapterError.message ||
                          "Transaction failed. Please try again."}
                      </p>
                    </div>
                  )}

                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                      <ShieldCheck
                        className="text-amber-600 shrink-0"
                        size={20}
                      />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Registering an adapter requires deploying a valid one
                        on-chain. Ensure your adapter is deployed and ready.
                      </p>
                    </div>
                    <FieldGroup>
                      {/* Chain ID where adapter lives */}
                      <Controller
                        name="chainId"
                        control={form.control}
                        render={({ field, fieldState }) => {
                          return (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-rhf-complex-company">
                                Chain ID
                              </FieldLabel>
                              <Input
                                {...field}
                                id="form-rhf-input-chainId"
                                aria-invalid={fieldState.invalid}
                                placeholder="00"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          );
                        }}
                      />

                      {/* Billing adapter contract address */}
                      <Controller
                        name="adapter"
                        control={form.control}
                        render={({ field, fieldState }) => {
                          return (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>
                                Billing window (in seconds)
                              </FieldLabel>
                              <Input
                                {...field}
                                type="number"
                                id="form-rhf-input-adapter"
                                aria-invalid={fieldState.invalid}
                                placeholder="0x0000"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          );
                        }}
                      />
                    </FieldGroup>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending || form.formState.isSubmitting}
                      >
                        {isPending || form.formState.isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Creating Account...
                          </span>
                        ) : (
                          "Create Merchant Account"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          )}
        </div>
      </Dialog>
    </>
  );
};
