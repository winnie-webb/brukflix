import { NextResponse } from "next/server";
import getMedia from "../getMedia";

export async function GET(req) {
  // Accessing the mediaType parameter from the request URL
  const mediaType = req.nextUrl.pathname.split("/")[2];

  console.log("Media Type:", mediaType); // Logs the media type (e.g., "movies" or "series")

  try {
    const mediaDetails = await getMedia(mediaType, "popular");
    return NextResponse.json({ mediaDetails: mediaDetails });
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    return NextResponse.json({ message: "Failed to fetch movie data" });
  }
}
