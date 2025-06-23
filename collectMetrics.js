// collectMetrics.js
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import Sentiment from "sentiment";

dotenv.config();
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
const sentiment = new Sentiment();

export async function fetchAndScoreReplies(tweetId) {
  const replies = [];
  const searchQuery = `in_reply_to_status_id:${tweetId}`;
  for await (const tweet of twitterClient.v2.search(searchQuery, {
    "tweet.fields": "created_at,public_metrics",
  })) {
    const text = tweet.text;
    const result = sentiment.analyze(text);
    replies.push({
      tweet_id: tweetId,
      reply_id: tweet.id,
      text,
      created_at: tweet.created_at,
      likes: tweet.public_metrics.like_count,
      sentiment:
        result.score > 0
          ? "POSITIVE"
          : result.score < 0
          ? "NEGATIVE"
          : "NEUTRAL",
      score: result.comparative,
    });
  }
  return replies;
}
