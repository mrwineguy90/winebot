// generateNewsTake.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateNewsTake({ title, summary }) {
  const prompt = `
You are a sharp, friendly wine commentator. 
Here’s a news headline and short summary. 
Write me a concise, 3-4 sentence take that adds context or a small opinion.
Please craft the summary in a way that will drive engagement.
The goal is to provoke conversation that can be used to derive a sentiment
of the market. The more engagement, the better. Please refrain from being 
overly political as well. Your position can be thought provoking, even controversial,
but do not make it overly combattive. Please pick a position and clearly state your opinion/thoughts
 on the article before reaching out and asking the readers to engage.

Headline: ${title}
Summary: ${summary}
  `.trim();

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 500,
  });
  return res.choices[0].message.content.trim();
}
