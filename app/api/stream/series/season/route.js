import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    const { url } = await req.json();
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const episodesLinks = [];
    $(".seho h1 a").each((_, elem) => {
      const episodeLink = $(elem).attr("href");
      episodesLinks.push(episodeLink);
    });

    return NextResponse.json({ episodesLinks });
  } catch (err) {
    return NextResponse.json({ episodesLinks: "" });
  }
}
