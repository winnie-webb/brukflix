// pages/api/scrape-goojara.js
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
  const { id } = await req.json();
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Go to Goojara website
    await page.goto(`https://www.goojara.to/${id}`, {
      waitUntil: "networkidle2",
    });

    // Wait for the iframe and get its src attribute
    const iframe = await page.waitForSelector("iframe");
    const linkToVideo = await iframe.evaluate((el) => el.src);

    // Navigate to the video page inside the iframe
    await page.goto(linkToVideo, { waitUntil: "networkidle2" });

    // Wait for the play button and prepare to click
    const playButtonSelector = ".play-button"; // Ensure the correct selector
    await page.waitForSelector(playButtonSelector);

    // Listen for new tab opening due to ad
    const [newPage] = await Promise.all([
      new Promise((resolve) =>
        browser.once("targetcreated", async (target) => {
          const newTab = await target.page();
          resolve(newTab);
        })
      ),
      page.click(playButtonSelector), // Click play button
    ]);

    // Close the newly opened ad page (new tab)
    await newPage.close();

    // Focus back on the original page and wait for the video element
    const videoSelector = "video"; // Selector for video element
    await page.waitForSelector(videoSelector);

    // Extract the video URL from the video element
    const videoUrl = await page.evaluate(() => {
      const video = document.querySelector("video");
      return video ? video.src : null;
    });

    console.log("Video URL:", videoUrl); // Log the video URL for debugging

    // await browser.close();

    return NextResponse.json({ videoUrl });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ message: "An error occurred while scraping." });
  }
}
