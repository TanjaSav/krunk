import { MongoClient, ServerApiVersion } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI as string;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await client.connect();
    const database = client.db("your_database_name");
    const posts = database.collection("posts");
    const result = await posts.insertOne({ title, content });
    return NextResponse.json({
      message: "Post created",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Error creating post" },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
}
