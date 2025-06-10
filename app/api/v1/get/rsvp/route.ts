import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    return NextResponse.json({
      message: "This is the RSVP API endpoint. Use POST to create an RSVP.",
      method: "GET",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch RSVP data | " + error },
      { status: 500 }
    );
  }
}
