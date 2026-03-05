// app/api/news/og/route.js
// Resolves Google News redirect URLs and extracts Open Graph metadata.
// Used by FeaturedCard to show article image + richer description.

import { NextResponse } from "next/server";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; SmartAgri/1.0; +https://smartagri.com)",
  "Accept": "text/html,application/xhtml+xml",
};

function extractMeta(html, property) {
  // Try og: property first, then name=
  const ogMatch = html.match(
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i")
  ) || html.match(
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i")
  );
  if (ogMatch) return ogMatch[1].trim();

  const nameMatch = html.match(
    new RegExp(`<meta[^>]+name=["']${property.replace("og:", "")}["'][^>]+content=["']([^"']+)["']`, "i")
  );
  return nameMatch ? nameMatch[1].trim() : null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ success: false, error: "Missing url param" }, { status: 400 });
  }

  try {
    // Step 1: Follow redirects to get the actual article URL
    const redirectRes = await fetch(rawUrl, {
      headers: HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
    });

    const resolvedUrl = redirectRes.url;
    const html        = await redirectRes.text();

    // Step 2: Extract OG metadata
    const image       = extractMeta(html, "og:image");
    const description = extractMeta(html, "og:description") || extractMeta(html, "description");
    const siteName    = extractMeta(html, "og:site_name");
    const title       = extractMeta(html, "og:title");

    return NextResponse.json(
      {
        success:     true,
        resolvedUrl,
        image:       image   ? decodeURIComponent(image)   : null,
        description: description ? description.slice(0, 300) : null,
        siteName,
        title,
      },
      {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
      }
    );
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}