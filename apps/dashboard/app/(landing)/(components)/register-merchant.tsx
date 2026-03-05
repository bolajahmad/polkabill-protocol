"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Building2,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useConnection, useWriteContract } from "wagmi";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { MerchantContractABI } from "@/lib/contracts/abi/merchant.abi";
import { MerchantContractAddress } from "@/lib/contracts";

const merchantRegistrationSchema = z.object({
  company: z.string().min(2, "Company name must be at least 2 characters"),
  grace: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : Number(val)))
    .pipe(z.number().min(0, "Grace period must be 0 or more").optional()),
  window: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .min(43200, "Billing window must be at least 12 hours (43200 seconds)")
        .max(Number.MAX_SAFE_INTEGER, "Billing window value too large"),
    ),
});

export const RegisterMerchantModal = () => {
  const {
    isPending,
    error: writeError,
    mutate: createMerchant,
  } = useWriteContract({
    mutation: {
      onError: (error) => console.log({ error }),
      onSuccess: (data) => {
        console.log({ data });
        setOpen(false)
      },
    },
  });
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(merchantRegistrationSchema),
    defaultValues: {
      company: "",
      grace: "",
      window: "",
    },
  });

  const onSubmit = (formData: Record<string, string | number>) => {
    // Handle form submission
    console.log("Form data:", formData);
    // Call mutate to submit to blockchain
    const grace = BigInt(formData.grace || 0);
    const window = BigInt(formData.window);
    createMerchant({
      abi: MerchantContractABI,
      address: MerchantContractAddress,
      functionName: "createMerchant",
      args: [grace, window, "0x"], // Assuming empty metadata for now
    });
  };

  return (
    <>
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className="rounded-2xl px-8 gap-2"
      >
        Register as Merchant
        <Building2 size={18} />
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <DialogTitle className="text-xl font-bold">
                Register as Merchant
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
                  To become a merchant on PolkaBill, you need to register your
                  profile on-chain. This will call the{" "}
                  <code className="bg-neutral-100 px-1 rounded">
                    createMerchant
                  </code>{" "}
                  function.
                </p>

                {writeError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-2 text-rose-600 text-xs">
                    <AlertTriangle size={16} className="shrink-0" />
                    <p>
                      {writeError.message ||
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
                      Registration requires a one-time blockchain transaction.
                      Ensure you have enough native tokens for gas.
                    </p>
                  </div>
                  <FieldGroup>
                    {/* Company name first */}
                    <Controller
                      name="company"
                      control={form.control}
                      render={({ field, fieldState }) => {
                        return (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-complex-company">
                              Company Name
                            </FieldLabel>
                            <Input
                              {...field}
                              id="form-rhf-input-company"
                              aria-invalid={fieldState.invalid}
                              placeholder="Provide the company name"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        );
                      }}
                    />

                    {/* General billing window */}
                    <Controller
                      name="window"
                      control={form.control}
                      render={({ field, fieldState }) => {
                        return (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Billing window (in seconds)</FieldLabel>
                            <Input
                              {...field}
                              type="number"
                              id="form-rhf-input-window"
                              aria-invalid={fieldState.invalid}
                              placeholder="0"
                            />
                            <FieldDescription className="text-xs">
                              The period, before the deadline, during which
                              billing can be attempted on Subscriptions.
                            </FieldDescription>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        );
                      }}
                    />

                    {/* Grace period */}
                    <Controller
                      name="grace"
                      control={form.control}
                      render={({ field, fieldState }) => {
                        return (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Grace period (in seconds)</FieldLabel>
                            <Input
                              {...field}
                              type="number"
                              id="form-rhf-input-grace"
                              aria-invalid={fieldState.invalid}
                              placeholder="0"
                            />
                            <FieldDescription className="text-xs">
                              The grace period defines how long after a failed
                              payment attempt the system should wait before
                              considering the subscription delinquent.
                            </FieldDescription>
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
        </div>
      </Dialog>
    </>
  );
};
