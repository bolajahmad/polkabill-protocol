import { GET_ADMIN_RELAY_REQUESTS } from "@/lib/apis/queries/chains";
import { squidClient } from "@/lib/apis/squid-client";
import { IAdapter } from "@/lib/models/chains";

export async function GET(request: Request) {
    interface ChainsResponse {
        // Define your response structure here
        relays: IAdapter[];
    }

    const data = await squidClient.request<ChainsResponse>(
        GET_ADMIN_RELAY_REQUESTS,
        {
            limit: 10,
            offset: 0
        }
    );

    return Response.json({
        data: data.relays.map((a) => {
            return ({
            ...a,
            id: Number(a.id),
        })})
    })
}