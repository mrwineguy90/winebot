import cron from "node-cron";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { fetchWineNews } from "./fetchNews.js";
import { generateNewsTake } from "./generateNewsTake.js";
import { postTweet } from "./postToX.js";
import { fetchAndScoreReplies } from "./collectMetrics.js";

dotenv.config();

async function job() {
  try {
    // 1. Fetch top wine news article
    const [article] = await fetchWineNews(3);

    // 2. Generate a quick take
    const take = await generateNewsTake(article);

    // 3. Combine title, link, and take into one tweet
    const text = `${article.title}\n🔗 ${article.link}\n\n💬 ${take}`;

    // 4. Post a single tweet
    const tweetId = await postTweet(text);
    console.log(`[${new Date().toISOString()}] Posted tweet ID:`, tweetId);

    // 5. Fetch & score replies to the main tweet
    const replies = await fetchAndScoreReplies(tweetId);
    if (replies.length === 0) {
      console.log("No replies to save.");
      return;
    }

    // 6. Persist replies to SQLite
    const db = await open({
      filename: process.env.DB_FILE,
      driver: sqlite3.Database,
    });
    const insert = await db.prepare(
      `INSERT OR IGNORE INTO tweet_replies
         (tweet_id, reply_id, text, created_at, likes, sentiment, score)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    for (const r of replies) {
      await insert.run(
        r.tweet_id,
        r.reply_id,
        r.text,
        r.created_at,
        r.likes,
        r.sentiment,
        r.score
      );
    }
    await insert.finalize();
    console.log(`Saved ${replies.length} replies to DB.`);
  } catch (err) {
    console.error("Job error:", err);
  }
}

// Schedule to run every day at 9:00 AM Chicago time (14:00 UTC)
cron.schedule(
  "0 14 * * *",
  () => {
    job();
  },
  {
    timezone: "America/Chicago",
  }
);

// Allow manual invocation: `node scheduler.js --once`
if (process.argv.includes("--once")) {
  (async () => {
    await job();
    console.log("👉 run-once complete");
    process.exit(0);
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

// Export for programmatic use
export { job };
