import clientPromise from "@/lib/mongodb";
import { getSession } from "./auth";

export default async function getTweets() {
  try {
    const username = await getSession();
    const client = await clientPromise;
    const database = client.db("twitter");
    const tweets = await database
      .collection("posts")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const users = database.collection("users");
    const tweetsWithCurrentAvatars = await Promise.all(
      tweets.map(async (tweet) => {
        const user = await users.findOne({ username: tweet.authorName });
        const likedBy = tweet.likedBy || [];
        const repostedBy = tweet.repostedBy || [];
        const isLiked = username ? likedBy.includes(username) : false;
        const isReposted = username ? repostedBy.includes(username) : false;

        return {
          ...tweet,
          authorAvatar:
            user?.profilePicture || tweet.authorAvatar || "/images/circle.png",
          likes: tweet.likes || 0,
          likedBy: likedBy,
          isLiked: isLiked,
          reposts: tweet.reposts || 0,
          repostedBy: repostedBy,
          isReposted: isReposted,
        };
      }),
    );

    return tweetsWithCurrentAvatars;
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return [];
  }
}
