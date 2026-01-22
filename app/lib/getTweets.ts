import clientPromise from '@/lib/mongodb';

export default async function getTweets() {
  try {
    const client = await clientPromise;
    const database = client.db("twitter");
    const tweets = await database.collection("posts")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    
    return tweets;
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return [];
  }
}