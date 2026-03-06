import { StorachaDelegationProof, StorachaKey } from "@/lib/constants";
import { create } from "@storacha/client";
import { Signer } from "@storacha/client/principal/ed25519";
import * as Proof from "@storacha/client/proof";
import { StoreMemory } from "@storacha/client/stores/memory";

export async function POST(request: Request) {
    const body = await request.json();
    console.log({ body });

  // Load client with my private key
  const principal = Signer.parse(StorachaKey);
  const store = new StoreMemory();
  const client = await create({ principal, store });

  // Bring in the proof
  const proof = await Proof.parse(StorachaDelegationProof);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());

  const metadata = JSON.stringify({
    version: body.version,
    title: body.title,
    description: body.description,
    type: body.type,
  });
  const file = new File([metadata], `${body.title}`, {
    type: "application/json",
  });
  const cid = await client.uploadFile(file);

  return Response.json({ hash: cid.toString() });
}

