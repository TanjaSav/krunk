import Yourpost from './yourpost';

interface TweetFeedProps {
  tweets: any[];
}

export default function TweetFeed({ tweets }: TweetFeedProps) {
  return (
    <div className="flex flex-col space-y-4 relative">
      {tweets.map((tweet: any) => (
        <Yourpost
          key={tweet._id.toString()}
          content={tweet.content}
          imageUrl={tweet.imageUrl}
          createdAt={tweet.createdAt}
          authorName={tweet.authorName}
          authorAvatar={tweet.authorAvatar}
        />
      ))}
    </div>
  );
}