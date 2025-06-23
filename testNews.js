// testNews.js
import dotenv from "dotenv";
import { fetchWineNews } from "./fetchNews.js";
import { generateNewsTake } from "./generateNewsTake.js";

dotenv.config(); // loads OPENAI_API_KEY from .env

(async () => {
  try {
    // 1) Grab the top 3 headlines
    const articles = await fetchWineNews(3);
    console.log("Fetched articles:\n", articles);

    // 2) For each, generate & print your “quick take”
    for (const { title, summary, link } of articles) {
      console.log("\n📰", title);
      console.log("🔗", link);
      console.log("ℹ️  Summary snippet:", summary);
      const take = await generateNewsTake({ title, summary });
      console.log("💬 Quick take:", take);
    }
  } catch (err) {
    console.error("Error in test:", err);
  }
})();
