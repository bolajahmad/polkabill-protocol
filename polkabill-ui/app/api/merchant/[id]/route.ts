import { GET_MERCHANT_BY_ID } from "@/lib/apis/queries/merchants"
import { squidClient } from "@/lib/apis/squid-client"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params // The merchant's address

  const merchant = await squidClient.request(GET_MERCHANT_BY_ID, { id: id.toLowerCase() });

    return Response.json(merchant.merchantById);
}
