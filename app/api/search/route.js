import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export async function POST(req) {
  const { searchTerm } = await req.json();

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the Goojara page with the search box
    await page.goto("https://www.goojara.to", { waitUntil: "networkidle2" });

    await page.type("#putin", searchTerm);
    await page.waitForSelector("#result");
    await new Promise((resolve) => setTimeout(resolve, 500)); // Equivalent of waitForTimeout(2000)
    const content = await page.content();
    const $ = cheerio.load(content);
    const titles = [];

    $(".mfeed li a div strong").each((index, element) => {
      const title = $(element).text();
      titles.push(title);
    });
    await browser.close();

    return NextResponse.json({ titles });
  } catch (error) {
    console.error("Error during Puppeteer scrape:", error.message);
    return NextResponse.json({ error: error.message });
  }
}
