import { NextResponse } from "next/server";
import getMedia from "../getMedia";
export async function GET() {
  try {
    const movieDetails = await getMedia("movies", "popular");
    return NextResponse.json({ movies: movieDetails });
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    return NextResponse.json({ message: "Failed to fetch movie data" });
  }
}
