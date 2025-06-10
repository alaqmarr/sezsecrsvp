import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  // Get today's IST midnight
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istMidnight = new Date(now.getTime() + istOffsetMs);
  istMidnight.setUTCHours(0, 0, 0, 0);

  // Convert back to UTC time
  const startOfTodayISTinUTC = new Date(istMidnight.getTime() - istOffsetMs);

  const today = new Date();
  try {
    const rsvp = await prisma.rSVPDay.findFirst({
      orderBy: {
        date: "desc",
      },
      where: {
        active: true,
      },
      include: {
        rsvps: true,
      },
    });

    return NextResponse.json(rsvp);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch RSVP data | " + error },
      { status: 500 }
    );
  }
};
