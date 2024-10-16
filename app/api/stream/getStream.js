import puppeteer from "puppeteer";

export default async function getStream(url) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const streamContent = {};

    // Open the main page
    await page.goto(url, { waitUntil: "networkidle2" });

    // Wait for the iframe and extract its src URL
    const { posterLink, title, desc } = await page.evaluate(() => {
      const posterImg = document.querySelector("#poster a img");
      const posterLink = posterImg ? posterImg.getAttribute("src") : null;
      const titleElement = document.querySelector(".marl h1");
      const title = titleElement ? titleElement.textContent : "No title";
      const descElement = document.querySelector(".marl p");
      const desc = descElement ? descElement.textContent : "No description";

      return { posterLink, title, desc };
    });

    streamContent["posterLink"] = posterLink;
    streamContent["title"] = title;
    streamContent["desc"] = desc;
    const iframe = await page.waitForSelector("iframe", { timeout: 10000 });
    const linkToVideo = await iframe.evaluate((el) => el.src);

    // Open the iframe's video page
    await page.goto(linkToVideo, { waitUntil: "networkidle2" });

    // Extract content from the iframe's page

    const playButtonSelector = ".play-button";

    try {
      await page.waitForSelector(playButtonSelector, { timeout: 5000 });

      // Monitor for new tabs opened by clicking the play button
      const [newPage] = await Promise.all([
        new Promise((resolve) =>
          browser.once("targetcreated", async (target) => {
            const newTab = await target.page();
            resolve(newTab);
          })
        ),
        page.click(playButtonSelector), // Trigger play button click
      ]);

      // Close the new tab if it opens
      if (newPage) {
        await newPage.close();
      }
    } catch (e) {
      console.warn("Play button not found or click failed.");
    }

    // Wait for the video element to appear
    const videoSelector = "video";
    await page.waitForSelector(videoSelector, { timeout: 10000 });

    // Extract video URL
    const videoURL = await page.evaluate(() => {
      const video = document.querySelector("video");
      return video ? video.src : null;
    });

    streamContent["videoURL"] = videoURL;

    await browser.close();
    return streamContent;
  } catch (error) {
    console.error("Error while fetching video:", error.message);
    return "";
  }
}
