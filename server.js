// server.js
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/summary", async (req, res) => {
  const db = await open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database,
  });
  const rows = await db.all(
    `
    SELECT date(created_at) as date,
           sentiment,
           COUNT(*) as count
    FROM tweet_replies
    GROUP BY date, sentiment;
  `
  );
  res.json(rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
