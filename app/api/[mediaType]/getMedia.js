import axios from "axios";
import * as cheerio from "cheerio";
export default async function getMedia(
  mediaType,
  mediaCategory = "",
  categorySpecifier = ""
) {
  let response;
  if (mediaCategory === "" && categorySpecifier === "") {
    response = await axios.get(
      `https://www.goojara.to/watch-${mediaType}-${mediaCategory}`
    );
  } else {
    response = await axios.get(
      `https://www.goojara.to/watch-${mediaType}-${mediaCategory}-${categorySpecifier}`
    );
  }
  const html = response.data;
  const $ = cheerio.load(html);
  const mediaDetails = [];
  $(".mxwd:nth-child(4) .dflex div").each((index, element) => {
    const title = $(element).find("a").attr("title");
    const link = $(element).find("a").attr("href");
    const imageUrl = $(element).find("img").attr("data-src");

    mediaDetails.push({
      title,
      link,
      imageUrl,
    });
  });
  return mediaDetails;
}
