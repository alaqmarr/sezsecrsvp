import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const rsvps = await prisma.rSVPDay.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        rsvps: true,
      },
    });
    return NextResponse.json(rsvps);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch RSVP data" },
      { status: 500 }
    );
  }
}
