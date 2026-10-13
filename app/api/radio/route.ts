import { NextResponse } from "next/server";

const TAGS = ["lounge", "chill", "ambient", "jazz", "classical", "soul", "pop"];

export async function GET() {
  const tag = TAGS[Math.floor(Math.random() * TAGS.length)];

  try {
    const response = await fetch(
      `https://de1.api.radio-browser.info/json/stations/search?tag=${tag}&limit=50&order=random&hidebroken=true&has_extended_info=false`,
      { headers: { "User-Agent": "GalleryPlayer/1.0" }, cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json({ stations: [] }, { status: 502 });
    }

    const stations = (await response.json())
      .filter(
        (station: { url_resolved?: string; lastcheckok?: number }) =>
          station.url_resolved?.startsWith("https://") && station.lastcheckok !== 0
      )
      .map((station: { name?: string; url_resolved: string; favicon?: string; tags?: string; country?: string }) => ({
        name: station.name || "Unknown station",
        url_resolved: station.url_resolved,
        favicon: station.favicon || "",
        tags: station.tags || "",
        country: station.country || "",
      }));

    return NextResponse.json({ stations });
  } catch {
    return NextResponse.json({ stations: [] }, { status: 502 });
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
