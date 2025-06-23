// fetchNews.js
import Parser from "rss-parser";
const parser = new Parser();

export async function fetchWineNews(limit = 5) {
  // Google News search feed for “wine industry”
  const sources = [
    "https://www.winespectator.com/rss/news",
    "https://www.decanter.com/feed/",
    "https://vinepair.com/rss/",
    "https://winemag.com/feed/",
    "https://news.google.com/rss/search?q=wine+industry&hl=en-US&gl=US&ceid=US:en",
  ];
  const feed = await parser.parseURL(
    sources[Math.floor(Math.random() * sources.length)]
  );
  // return top N articles
  return feed.items
    .filter((item) => item.title && item.link)
    .slice(0, limit)
    .map(({ title, link, contentSnippet: summary }) => ({
      title,
      link,
      summary,
    }));
}
