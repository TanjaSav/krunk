import Yourpost from './yourpost';

interface TweetFeedProps {
  tweets: any[];
}

export default function TweetFeed({ tweets }: TweetFeedProps) {
  return (
    <div>
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