import { NextResponse } from "next/server";
import getStream from "../getStream";

export async function POST(req) {
  const { url } = await req.json();

  try {
    console.log(url);
    const streamContent = await getStream(url, "series");
    return NextResponse.json({ streamContent });
  } catch (err) {
    return NextResponse.json({ streamContent: err.message });
  }
}
