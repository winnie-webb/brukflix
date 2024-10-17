import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";
import getBrowser from "../utils/getBrowser";

export async function POST(req) {
  const { searchTerm } = await req.json();

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    // Block unnecessary resources
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.setViewport({ width: 1280, height: 800 });

    await page.goto("https://www.goojara.to", {
      waitUntil: "domcontentloaded",
    });

    await page.type("#putin", searchTerm);
    await page.waitForSelector("#result");
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
              const linkRef = $$(".seho h1 a").attr("href");
              if (!linkRef) return;
              link = linkRef;
            } catch (err) {
              console.error(`Failed to fetch series link: ${err.message}`);
            }
          }
          return { title, link, isSeries };
        })
        .get()
    );

    await browser.close();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error during Puppeteer scrape:", error.message);
    return NextResponse.json({ error: error.message });
  }
}
