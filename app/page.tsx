import Navbar from "./components/navbar";
import Writepost from "./components/writepost";
import TweetFeed from "./components/tweetfeed";
import getTweets  from "./lib/getTweets";
import Mobilenav from "./components/mobilenav";


export default async function Home() {
  const tweets = await getTweets();

  return (
    <main>
      <Writepost />
      <TweetFeed tweets={tweets} />
       <Navbar />
       <Mobilenav />
    </main>
  );
}