import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch the popular movies page
    const { data } = await axios.get(
      "https://www.goojara.to/watch-movies-popular"
    );

    // Load the HTML into cheerio for parsing
    const $ = cheerio.load(data);

    // Initialize an array to store movie details
    const movieDetails = [];

    // Loop through each movie element and extract details
    $(".dflex div").each((index, element) => {
      const title = $(element).find("a").attr("title"); // Adjust this selector based on actual movie title class
      const link = $(element).find("a").attr("href");
      const imageUrl = $(element).find("img").attr("data-src");

      // Store the extracted movie details
      movieDetails.push({
        title,
        link: link,
        imageUrl,
      });
    });

    // Return the movie details as a JSON response
    return NextResponse.json({ movies: movieDetails });
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    return NextResponse.json({ message: "Failed to fetch movie data" });
  }
}
