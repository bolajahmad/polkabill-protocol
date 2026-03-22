import { GET_ALL_CHARGES } from "@/lib/apis/queries/charges";
import { squidClient } from "@/lib/apis/squid-client";

export async function GET(request: Request) {
    const data = await squidClient.request(
        GET_ALL_CHARGES,
        {
            limit: 20,
            offset: 0
        }
    );

    return Response.json(data.charges)
}