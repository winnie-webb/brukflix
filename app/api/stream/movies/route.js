import { NextResponse } from "next/server";
import getStream from "../getStream";

export async function POST(req) {
  const { url } = await req.json();
  try {
    const streamContent = await getStream(url);
    return NextResponse.json({ streamContent });
  } catch (error) {
    console.error(`Error fetching video: ${error.message}`);
    return NextResponse.json({ error: error.message });
  }
}
