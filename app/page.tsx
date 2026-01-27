import Navbar from "./components/navbar";
import TweetFeed from "./components/tweetfeed";
import getTweets from "./lib/getTweets";
import Mobilenav from "./components/mobilenav";
import { getSession } from "./lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const username = await getSession();

  if (!username) {
    redirect("/login");
  }

  const tweets = await getTweets();

  // Serialize the data to plain objects
  const serializedTweets = tweets.map((tweet: any) => ({
    ...tweet,
    _id: tweet._id.toString(),
    createdAt: tweet.createdAt.toISOString(),
    updatedAt:
      tweet.updatedAt instanceof Date
        ? tweet.updatedAt.toISOString()
        : tweet.updatedAt,
  }));

  return (
    <div className="flex h-screen overflow-hidden justify-center">
      <aside className="hidden sm:block flex-shrink-0">
        <Navbar />
      </aside>
      <main className="flex flex-col w-full sm:max-w-sm md:max-w-md h-screen overflow-hidden">
        <TweetFeed tweets={serializedTweets} username={username} />
        <Mobilenav />
      </main>
    </div>
  );
}
