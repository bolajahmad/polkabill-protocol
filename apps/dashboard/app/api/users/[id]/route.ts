import { GET_USER_BY_ID } from "@/lib/apis/queries/users";
import { squidClient } from "@/lib/apis/squid-client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // The user's address

  const user = await squidClient.request(GET_USER_BY_ID, {
    id: id.toLowerCase(),
  });

  console.log({ user });
  return Response.json(user.userById);
}
