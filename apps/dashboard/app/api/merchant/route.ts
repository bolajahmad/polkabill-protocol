import { GET_MERCHANTS } from "@/lib/apis/queries/merchants";
import { squidClient } from "@/lib/apis/squid-client";

export async function GET(request: Request) {
    const data = await squidClient.request(
        GET_MERCHANTS,
        {
            limit: 10,
            offset: 0
        }
    );

    console.log({ data });
    return Response.json(data.merchants)
}