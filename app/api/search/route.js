import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import axios from "axios";

export async function POST(req) {
  const { searchTerm } = await req.json();

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the Goojara page with the search box
    await page.goto("https://www.goojara.to", { waitUntil: "networkidle2" });

    await page.type("#putin", searchTerm);
    await page.waitForSelector("#result");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait to ensure content loads

    const content = await page.content();
    const $ = cheerio.load(content);
    const data = await Promise.all(
      $(".mfeed li a")
        .map(async (index, element) => {
          const title = $(element).find("div strong").text();
          const isSeries = $(element).find("div").hasClass("it");
          let link = $(element).attr("href");

          if (isSeries) {
            try {
              const response = await axios.get(link);
              const $$ = cheerio.load(response.data);
              link = $$(".seho h1 a").attr("href");
            } catch (err) {
              console.error(`Failed to fetch series link: ${err.message}`);
            }
          }

          return { title, link, isSeries };
        })
        .get() // .get() extracts array from Cheerio map
    );

    await browser.close();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error during Puppeteer scrape:", error.message);
    return NextResponse.json({ error: error.message });
  }
}
