import puppeteer from "puppeteer";

export default async function getStream(url, mediaType = "") {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const streamContent = {};

    // Open the main page
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract poster, title, and description
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

    if (mediaType === "series") {
      const seriesContent = await page.evaluate(() => {
        const seasonNodes = document.querySelectorAll(".marl #drop a");
        const episodeNodes = document.querySelectorAll(
          "#sesh a:not(:first-child)"
        );

        // Convert NodeLists to arrays and extract hrefs
        const seasonsLinks = Array.from(seasonNodes).map((season) =>
          season.getAttribute("href")
        );
        const episodesLinks = Array.from(episodeNodes).map((episode) =>
          episode.getAttribute("href")
        );
        return { seasonsLinks, episodesLinks };
      });
      streamContent["seriesContent"] = seriesContent;
    }

    // Retry to find the iframe up to 3 times if needed
    const iframe = await page.waitForSelector("iframe", { timeout: 10000 });

    // Get video source link
    const linkToVideo = await iframe.evaluate((el) => el.src);

    // Open the iframe's video page
    await page.goto(linkToVideo, { waitUntil: "networkidle2" });

    // Attempt to click play button (if available)
    const playButtonSelector = ".play-button";
    try {
      await page.waitForSelector(playButtonSelector, { timeout: 5000 });
      const [newPage] = await Promise.all([
        new Promise((resolve) =>
          browser.once("targetcreated", async (target) => {
            const newTab = await target.page();
            resolve(newTab);
          })
        ),
        page.click(playButtonSelector),
      ]);

      if (newPage) {
        await newPage.close();
      }
    } catch (e) {
      console.warn("Play button not found or click failed:", e.message);
    }

    // Wait for the video element to appear
    const videoSelector = "video";
    await page.waitForSelector(videoSelector, { timeout: 5000 });

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
    return { error: error.message };
  }
}
