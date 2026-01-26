import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb"; // adjust path if needed
import { ObjectId } from "mongodb";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const client = await clientPromise;
  const database = client.db("twitter");
  const collection = database.collection("posts");
  const { id } = await params;

  await collection.deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ success: true });
}
