# Wine Bot Node

A **daily wine‑industry news bot** that:

* 📰 Fetches top wine news from RSS feeds
* 💬 Generates a concise “quick take” using OpenAI
* 🚀 Posts a single tweet (title + link + take) to X/Twitter
* 😊 Collects replies, runs sentiment analysis, and stores results in SQLite
* 📊 Exposes a simple dashboard via Express + Chart.js
* ⏰ Runs on a daily cron schedule (9 AM Chicago / 14:00 UTC)

---

## Features

* **News sourcing**: just drop in any RSS feed in `fetchNews.js` (e.g. Wine Spectator, Decanter)
* **AI summarization**: powered by OpenAI (GPT‑3.5‑turbo or any model you choose)
* **Tweet posting**: respects URL length rules, full RW via `twitter-api-v2`
* **Sentiment tracking**: `sentiment` lib classifies replies as Positive/Neutral/Negative
* **Persistence**: lightweight SQLite (`data/bot.db`) with automatic table init
* **Dashboard**: `/api/summary` endpoint + static UI in `public/index.html`
* **Manual & scheduled runs**: `--once` flag for on‑demand tests; cron for daily runs

---

## Getting Started

### 1. Clone & install dependencies

```bash
git clone https://github.com/your‑username/wine‑bot‑node.git
cd wine‑bot‑node
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# then open .env and fill in your keys:
# OPENAI_API_KEY, TWITTER_API_KEY, TWITTER_API_SECRET,
# TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET, DB_FILE
```

### 3. Initialize the database

Creates `data/bot.db` and the `tweet_replies` table.

```bash
npm run init‑db
```

### 4. Run a one‑off job

Smoke‑test your full pipeline (fetch → AI → post → collect → store):

```bash
node scheduler.js --once
```

### 5. Start the scheduler

Let it run daily at 9 AM Chicago:

```bash
npm run scheduler
```

### 6. Launch the dashboard

```bash
npm start
# then open http://localhost:3000 in your browser
```

---

## Configuration

* **News sources**: edit the array in `fetchNews.js` to add or rotate RSS URLs.
* **AI model**: switch models in `generateNewsTake.js` (e.g. `gpt-3.5-turbo` → `gpt-4o-mini`).
* **Cron schedule**: adjust the pattern in `scheduler.js` (`cron.schedule('0 14 * * *', …)`).
* **Tweet formatting**: customize `postTweet` in `postToX.js` (threading, hashtags, truncation).

---

## File Overview

* **initDb.js**: creates the SQLite schema
* **fetchNews.js**: RSS parsing (top N items)
* **generateNewsTake.js**: calls OpenAI for a 1–2 sentence take
* **generateContent.js** *(optional)*
* **postToX.js**: posts tweets, enforces limits
* **collectMetrics.js**: fetches replies + sentiment
* **scheduler.js**: ties it all together + cron
* **server.js**: Express API + static dashboard
* **public/index.html**: Chart.js UI showing daily sentiment

---

## License

[MIT License](LICENSE)
Feel free to copy, fork, and modify!
