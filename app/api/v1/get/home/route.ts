import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const today = new Date();
  try {
    const rsvp = await prisma.rSVPDay.findFirst({
      where: {
        date: {
          gte: today,
        },
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
