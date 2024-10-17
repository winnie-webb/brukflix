import puppeteer from "puppeteer";
import fs from "fs";

// Check if running in Docker by checking for the existence of a file or env variable
const isDocker = fs.existsSync("/.dockerenv") || process.env.IS_DOCKER;

async function getBrowser() {
  const browser = await puppeteer.launch({
    executablePath: isDocker
      ? process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium"
      : undefined, // Use default Chromium in dev
    args: isDocker
      ? ["--no-sandbox", "--disable-setuid-sandbox"] // Docker-specific args
      : [], // Dev-specific args
  });

  return browser;
}

export default getBrowser;
