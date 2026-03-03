"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MOCK_PLANS } from "@/lib/mocks";
import { formatCurrency, handleContractError } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useWriteContract } from "wagmi";
import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  DialogTitle,
} from "@headlessui/react";
import { Input } from "@/components/ui/input";
import { PlanRegistryContractABI } from "@/lib/contracts/abi/plan-registry.abi";
import { PlanRegistryContractAddress } from "@/lib/contracts";
import { formatUnits, hexToString, parseUnits, stringToHex } from "viem";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { FieldDescription } from "@base-ui/react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { IMerchant } from "@/lib/models/merchants";

const createPlanSchema = (window: number) =>
  z.object({
    name: z
      .string()
      .min(1, "Plan name is required")
      .max(100, "Plan name must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Description must be less than 1000 characters"),
    price: z
      .string()
      .min(1, "Price is required")
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        "Price must be a valid positive number",
      ),
    interval: z
      .string()
      .min(1, "Interval is required")
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        "Interval must be a valid positive number",
      )
      .refine(
        (val) => Number(val) >= window,
        "Interval must be at least the merchant window period",
      ),
    grace: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
        "Grace period must be a valid non-negative number",
      ),
  });

type Props = {
  mid: `0x${string}`;
  window: number;
  plans: IMerchant["plans"];
};

export const MerchantPlansView = ({ mid, plans, window }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate, isPending } = useWriteContract({
    mutation: {
      onError: (error) => {
        const msg = handleContractError(error);
        toast.error(msg || "Failed to create plan");
        console.log({ error });
      },
      onSuccess: () => {
        toast.success("Plan created successfully");
        setIsModalOpen(false);
      },
    },
  });
  const schema = useMemo(() => createPlanSchema(window), [window]);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      price: "",
      interval: "",
      grace: "",
      description: "",
    },
  });

  const onSubmit = (data: Record<string, string>) => {
    console.log("Form data:", data);
    // Call mutate to submit to blockchain

    if (!data.name || !data.price) return;

    const metadata = JSON.stringify({
      name: data.name,
      description: data.description,
    });

    mutate({
      abi: PlanRegistryContractABI,
      address: PlanRegistryContractAddress,
      functionName: "createPlan",
      args: [
        BigInt(Math.floor(Number(data.price) * 10 ** 18)), // Assumes 18 decimals for stablecoins
        BigInt(data.interval),
        BigInt(data.grace),
        stringToHex(metadata),
      ],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subscription Plans</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 rounded-xl"
        >
          <Plus size={18} />
          New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col h-full">
            <div className="p-6 flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <Badge variant={plan.status ? "success" : "destructive"}>
                  {plan.status ? "Active" : "Paused"}
                </Badge>
                <span className="text-[10px] font-mono text-neutral-400">
                  ID: #{plan.id}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Basic</h3>
                <p className="text-sm text-neutral-500 mt-1">Basic access</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  {formatCurrency(
                    Number(formatUnits(BigInt(plan.price), 18)),
                  )}{" "}
                  USD
                </span>
                <span className="text-neutral-400 text-sm">
                  /{plan.billingInterval} days
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-50">
                <div>
                  <p className="text-[10px] uppercase text-neutral-400 font-bold">
                    Subscribers
                  </p>
                  <p className="text-lg font-bold">
                    {plan.subscriptions.length ?? "0"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-neutral-400 font-bold">
                    Grace Period
                  </p>
                  <p className="text-lg font-bold">{plan.grace} days</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-neutral-50/50 flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl">
                Edit
              </Button>
              <Button variant="secondary" className="flex-1 rounded-xl">
                Stats
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-lg shadow-lg max-w-md w-full space-y-4 p-6">
            <DialogTitle className="text-lg font-bold">
              Create Subscription Plan
            </DialogTitle>

            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-name">
                        Plan Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-input-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Provide plan name"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-textarea-description">
                        Description of Plan
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="form-rhf-textarea-description"
                          placeholder="What's included in this plan?"
                          rows={8}
                          className="min-h-24 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value.length}/1000 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="price"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-input-price">
                        Price (USD)
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        id="form-rhf-input-price"
                        aria-invalid={fieldState.invalid}
                        placeholder="0.0"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="interval"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-input-interval">
                          Plan Duration
                        </FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          id="form-rhf-input-interval"
                          aria-invalid={fieldState.invalid}
                          placeholder="0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />

                <Controller
                  name="grace"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-input-grace">
                          Grace period (in seconds)
                        </FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          id="form-rhf-input-grace"
                          aria-invalid={fieldState.invalid}
                          placeholder="0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>

              <div className="flex gap-2 justify-end pt-4 border-t border-neutral-200">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : null}
                  Create Plan
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};
