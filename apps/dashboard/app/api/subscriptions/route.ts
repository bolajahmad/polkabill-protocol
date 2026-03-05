import { GET_MERCHANT_SUBSCRIPTIONS } from "@/lib/apis/queries/subscriptions";
import { squidClient } from "@/lib/apis/squid-client";

export async function GET(
  request: Request,
) {
    const { searchParams } = new URL(request.url);
  const mid = searchParams.get("mid"); // The merchant's address

  const data = await squidClient.request(GET_MERCHANT_SUBSCRIPTIONS, {
    merchantId: mid?.toLowerCase()
  });

  const subs = data.subscriptions.map((sub: any) => ({
    ...sub,
    id: Number(sub.id),
    startTime: Number(sub.startTime),
    billingCycle: Number(sub.billingCycle),
    nextBillingTime: Number(sub.nextBillingTime),
    cancelledAt: sub.cancelledAt ? Number(sub.cancelledAt) : null,
  }))

  return Response.json(subs);
}
