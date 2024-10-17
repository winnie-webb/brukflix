import puppeteer from "puppeteer";

async function getBrowser() {
  const browser = await puppeteer.launch({
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Disable sandbox
  });

  return browser;
}
export default getBrowser;
