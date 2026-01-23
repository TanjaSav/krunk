import Yourpost from './yourpost';
import Otherpost from './otherpost';

interface TweetFeedProps {
  tweets: any[];
  username: string;
}

export default function TweetFeed({ tweets, username }: TweetFeedProps) {
  return (
    <div>
      {tweets.map((tweet: any) => (
        tweet.authorName === username ? (
          <Yourpost
            key={tweet._id.toString()}
            _id={tweet._id.toString()}
            content={tweet.content}
            imageUrl={tweet.imageUrl}
            createdAt={tweet.createdAt}
            authorName={tweet.authorName}
            authorAvatar={tweet.authorAvatar}
            likes={tweet.likes}
            isLiked={tweet.isLiked}
          />
        ) : (
          <Otherpost
            key={tweet._id.toString()}
            _id={tweet._id.toString()}
            content={tweet.content}
            imageUrl={tweet.imageUrl}
            createdAt={tweet.createdAt}
            authorName={tweet.authorName}
            authorAvatar={tweet.authorAvatar}
            likes={tweet.likes}
            isLiked={tweet.isLiked}
          />
        )
      ))}
    </div>
  );
}