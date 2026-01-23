import Navbar from "./components/navbar";
import Writepost from "./components/writepost";
import TweetFeed from "./components/tweetfeed";
import getTweets  from "./lib/getTweets";
import Mobilenav from "./components/mobilenav";
import { getSession } from "./lib/auth";
import { redirect } from "next/navigation";


export default async function Home() {
  const username = await getSession();
  
  // Redirect to login if not authenticated
  if (!username) {
    redirect('/login');
  }

  const tweets = await getTweets();

   return (
    <div className="flex" >
      <aside className="hidden sm:block" >
        <Navbar />
      </aside>
      <main className="flex flex-col w-full">
        <div className="w-full sm:max-w-sm md:max-w-md">
          <Writepost />
          <TweetFeed tweets={tweets} username={username} />
          <Mobilenav />
        </div>
      </main>
    </div>
  );
}