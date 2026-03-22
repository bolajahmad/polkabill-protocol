import { FILTER_SUBSCRIPTIONS } from "@/lib/apis/queries/charges";
import { squidClient } from "@/lib/apis/squid-client";

export async function GET(
  request: Request,
) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
  const mid = searchParams.get("mid"); // The merchant's address

  const variable = {} as Record<string, string>;
  if (status) variable.status = status;
  if (mid) variable.mid = mid.toLowerCase();
  const data = await squidClient.request(FILTER_SUBSCRIPTIONS, variable);

  const subs = data.subscriptions.map((sub: any) => ({
    ...sub,
    id: Number(sub.id),
    startTime: Number(sub.startTime) / 1000,
    billingCycle: Number(sub.billingCycle),
    nextBillingTime: Number(sub.nextBillingTime) > 1000000000000 ?  Number(sub.nextBillingTime) / 1000 : Number(sub.nextBillingTime),
    cancelledAt: sub.cancelledAt ? Number(sub.cancelledAt) / 1000 : null,
  }))

  return Response.json(subs);
}
