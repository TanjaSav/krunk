
import Writepost from "./components/writepost";
import TweetFeed from "./components/tweetfeed";
import getTweets  from "./lib/getTweets";
import Navbar from "./components/navbar";
import Mobilenav from "./components/mobilenav";


export default async function Home() {
  const tweets = await getTweets();

   return (
    <div className="flex" >
      <aside className="hidden sm:block" >
        <Navbar />
      </aside>
      <main className="flex flex-col w-full">
        <div className="w-full sm:max-w-sm md:max-w-md">
          <Writepost />
          <TweetFeed tweets={tweets} />
          <Mobilenav />
        </div>
      </main>
    </div>
  );
}