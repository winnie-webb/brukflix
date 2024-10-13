import { NextResponse } from "next/server";
import getMedia from "../../getMedia";

export async function GET(req) {
  const mediaType = req.nextUrl.pathname.split("/")[2];
  const mediaCategory = req.nextUrl.pathname.split("/")[3];
  const categorySpecifier = req.nextUrl.pathname.split("/")[4];
  try {
    const mediaDetails = await getMedia(
      mediaType,
      mediaCategory,
      categorySpecifier
    );
    return NextResponse.json(mediaDetails);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
