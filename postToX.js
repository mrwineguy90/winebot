// postToTwitter.js
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
const requiredEnvVars = [
  "TWITTER_API_KEY",
  "TWITTER_API_SECRET",
  "TWITTER_ACCESS_TOKEN",
  "TWITTER_ACCESS_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const twitter = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
const rwClient = twitter.readWrite;

/**
 * Posts a single tweet combining title+link+take, with URL normalization
 * to satisfy Twitter's 280-character limit.
 * @param {string} text - Full tweet text
 * @returns {Promise<string>} - The posted tweet's ID
 */
export async function postTweet(text) {
  if (!text || text.trim().length === 0) {
    throw new Error("Tweet text cannot be empty");
  }

  // Twitter counts URLs as 23 chars regardless of length
  const LINK_LENGTH = 23;
  // Replace each URL with a fixed-length placeholder for length check
  const normalized = text.replace(/https?:\/\/\S+/g, "X".repeat(LINK_LENGTH));
  if (normalized.length > 25000) {
    throw new Error(
      `Tweet too long: ${normalized.length} characters (max 280)`
    );
  }

  try {
    const { data } = await rwClient.v2.tweet(text);
    console.log(`Tweet posted successfully! ID: ${data.id}`);
    return data.id;
  } catch (error) {
    console.error("Error posting tweet:", error.message);
    if (error.code === 403) {
      console.error("Access denied - check your API permissions");
    } else if (error.code === 401) {
      console.error("Authentication failed - check your API credentials");
    } else if (error.code === 429) {
      console.error("Rate limit exceeded - try again later");
    }
    throw error;
  }
}
