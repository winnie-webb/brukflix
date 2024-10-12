import axios from "axios";
import * as cheerio from "cheerio";
export default async function getMedia(mediaType, path) {
  const { data } = await axios.get(
    `https://www.goojara.to/watch-${mediaType}-${path}`
  );

  const $ = cheerio.load(data);

  const movieDetails = [];

  // Loop through each movie element and extract details
  $(".dflex div").each((index, element) => {
    const title = $(element).find("a").attr("title");
    const link = $(element).find("a").attr("href");
    const imageUrl = $(element).find("img").attr("data-src");

    movieDetails.push({
      title,
      link: link,
      imageUrl,
    });
  });
  return movieDetails;
}
