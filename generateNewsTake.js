// generateNewsTake.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateNewsTake({ title, summary }) {
  const prompt = `
You are a wine enthusiast and blogger sharing daily industry news on Twitter. 
Read the following article and summary and draft a single tweet with:
- a short, catchy headline or key takeaway from the article,
- a friendly, insightful commentary in a conversational tone (as if chatting with fellow wine lovers), 
- **Include** one personal insight or a thought-provoking question to invite replies, 
- **Include** 1-2 relevant emojis (to add personality), 
- **Include** 2-3 hashtags (mix of broad wine hashtags and one specific or trending hashtag).

The tweet should feel like it’s written by a human, not a bot – warm, witty, and engaging.

Headline: ${title}
Summary: ${summary}
  `.trim();

  const res = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 500,
  });
  return res.choices[0].message.content.trim();
}
