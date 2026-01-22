import Navbar from "./components/navbar";
import Writepost from "./components/writepost";
import TweetFeed from "./components/tweetfeed";
import getTweets  from "./lib/getTweets";


export default async function Home() {
  const tweets = await getTweets();

  return (
    <main>
      <Writepost />
      <TweetFeed tweets={tweets} />
       <Navbar />
    </main>
  );
}