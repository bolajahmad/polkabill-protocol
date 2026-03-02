import { GET_ADAPTERS } from "@/lib/apis/queries/chains";
import { squidClient } from "@/lib/apis/squid-client";
import { IAdapter, Status } from "@/lib/models/chains";

export async function GET(request: Request) {
    interface ChainsResponse {
        // Define your response structure here
        adapters: IAdapter[];
    }

    const data = await squidClient.request<ChainsResponse>(
        GET_ADAPTERS,
        {
            limit: 10,
            offset: 0
        }
    );

    return Response.json({
        data: data.adapters.map((a) => {
            return ({
            ...a,
            id: Number(a.id),
        })})
    })
}