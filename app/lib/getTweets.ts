import clientPromise from '@/lib/mongodb';

export default async function getTweets() {
  const client = await clientPromise;
  const database = client.db("twitter");
  const tweets = await database.collection("posts")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  
  return tweets;
}