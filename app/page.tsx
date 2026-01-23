import Navbar from "./components/navbar";
import Writepost from "./components/writepost";
import TweetFeed from "./components/tweetfeed";
import getTweets  from "./lib/getTweets";
import Mobilenav from "./components/mobilenav";


export default async function Home() {
  const tweets = await getTweets();

  return (
    <main>
      <div className="h-22 md:h-0"></div>
      <Writepost />
      <TweetFeed tweets={tweets} />
      <Navbar />
      <Mobilenav />
    </main>
  );
}