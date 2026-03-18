import { GET_MERCHANTS } from '@/lib/apis/queries/merchants';
import { GET_ALL_SUBSCRIPTIONS } from '@/lib/apis/queries/subscriptions';
import { squidClient } from '@/lib/apis/squid-client';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const data = await squidClient.request(GET_ALL_SUBSCRIPTIONS);
  const merchantsData = await squidClient.request(GET_MERCHANTS);

  const totalSubs = data.subscriptions.length;
  const revenue = data.subscriptions.reduce((acc: number, sub: any) => {
    return acc + sub.plan.price * sub.billingCycle;
  }, 0);
  const fees = revenue * 0.05; // Assuming a 5% fee
  const merchantCount = merchantsData.merchants.length;

  const stats = {
    revenue,
    subscriptionCount: totalSubs,
    fees,
    totalMerchants: merchantCount,
  };
  return Response.json(stats);
}
