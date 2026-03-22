import { GET_ALL_CHARGES } from '@/lib/apis/queries/charges';
import { GET_MERCHANTS } from '@/lib/apis/queries/merchants';
import { GET_ALL_SUBSCRIPTIONS } from '@/lib/apis/queries/subscriptions';
import { squidClient } from '@/lib/apis/squid-client';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const data = await squidClient.request(GET_ALL_CHARGES);
  const subs = await squidClient.request(GET_ALL_SUBSCRIPTIONS);
  const merchantsData = await squidClient.request(GET_MERCHANTS);

  const totalSubs = subs.subscriptions.length;
  const revenue = data.charges
    .filter((charge: any) => charge.success)
    .reduce((acc: number, charge: any) => {
      return acc + charge.amount;
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
