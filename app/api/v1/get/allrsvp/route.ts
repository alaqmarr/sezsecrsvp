import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const device = searchParams.get("device");

  try {
    const rsvps = await prisma.rSVP.findMany({
      where: {
        deviceId: device || undefined, // Filter by deviceId if provided
      },
      include: {
        rsvpDay: true,
      },
    });
    return NextResponse.json(rsvps);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}
