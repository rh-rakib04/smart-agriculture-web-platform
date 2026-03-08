// app/api/news/route.js
// Fetches Google News RSS and returns parsed articles as JSON.
// No API key required.

import { NextResponse } from "next/server";

const FEEDS = {
  all:     "https://news.google.com/rss/search?q=agriculture+bangladesh+farming&hl=en-BD&gl=BD&ceid=BD:en",
  crops:   "https://news.google.com/rss/search?q=crop+rice+wheat+farming+bangladesh&hl=en-BD&gl=BD&ceid=BD:en",
  weather: "https://news.google.com/rss/search?q=weather+flood+drought+bangladesh+farm&hl=en-BD&gl=BD&ceid=BD:en",
  policy:  "https://news.google.com/rss/search?q=bangladesh+agriculture+policy+government+DAE&hl=en-BD&gl=BD&ceid=BD:en",
  market:  "https://news.google.com/rss/search?q=bangladesh+crop+price+market+fertilizer&hl=en-BD&gl=BD&ceid=BD:en",
};

function extractText(node, tag) {
  const match = node.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  if (!match) return "";
  return (match[1] || match[2] || "").trim();
}

function parseItems(xml) {
  const items = [];
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const block of itemBlocks) {
    const title       = extractText(block, "title").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
    const link        = extractText(block, "link") || block.match(/<link\/>([^<]+)/)?.[1] || "";
    const pubDate     = extractText(block, "pubDate");
    const description = extractText(block, "description")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .slice(0, 200);

    // Source name — Google News puts it in <source> or at end of title after " - "
    const sourceMatch = title.match(/^(.*?)\s+-\s+([^-]+)$/);
    const cleanTitle  = sourceMatch ? sourceMatch[1].trim() : title;
    const source      = extractText(block, "source") || (sourceMatch ? sourceMatch[2].trim() : "News");

    if (!cleanTitle || cleanTitle.length < 10) continue;

    // Use full base64 of link + item index to guarantee uniqueness
    const id = Buffer.from(`${items.length}:${link}`).toString("base64url").slice(0, 32);

    items.push({
      id,
      title:       cleanTitle,
      description,
      link,
      source,
      pubDate:     pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    });
  }

  return items;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";
  const feedUrl  = FEEDS[category] || FEEDS.all;

  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 900 }, // cache 15 min
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SmartAgri/1.0)" },
    });

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml     = await res.text();
    const articles = parseItems(xml).slice(0, 20);

    return NextResponse.json({ success: true, articles, category });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message, articles: [] }, { status: 500 });
  }
}