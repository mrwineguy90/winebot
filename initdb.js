// initDb.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";

dotenv.config();
(async () => {
  const db = await open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database,
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tweet_replies (
      tweet_id TEXT,
      reply_id TEXT PRIMARY KEY,
      text TEXT,
      created_at TEXT,
      likes INTEGER,
      sentiment TEXT,
      score REAL
    );
  `);
  console.log("Database initialized");
  process.exit(0);
})();
