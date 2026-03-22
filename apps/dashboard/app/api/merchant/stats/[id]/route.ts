import { GET_MERCHANT_SUBSCRIPTIONS } from '@/lib/apis/queries/subscriptions';
import { squidClient } from '@/lib/apis/squid-client';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // The merchant's address
  const data = await squidClient.request(GET_MERCHANT_SUBSCRIPTIONS, {
    merchantId: id.toLowerCase(),   
  });

  const revenue = data.subscriptions.reduce((acc: number, sub: any) => {
    return acc + sub.plan.price * sub.billingCycle;
  }, 0);
  const activeSubs = data.subscriptions.filter((sub: any) =>
    ['ACTIVE', 'PAST_DUE'].includes(sub.status),
  ).length;
  console.log({ activeSubs});

  const stats = {
    revenue,
    activeSubCount: activeSubs,
    churn: 0,
    ltv: 0,
  };
  return Response.json(stats);
}