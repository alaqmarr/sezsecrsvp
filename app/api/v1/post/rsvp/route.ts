import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { date, lunch, dinner } = await req.json();

  try {
    const markExistingInactive = await prisma.rSVPDay.updateMany({
      where: {
        active: true,
      },
      data: {
        active: false,
      },
    });
    if (markExistingInactive.count === 0) {
      console.log("No active RSVP days found to mark as inactive.");
    }
    const rsvp = await prisma.rSVPDay.create({
      data: {
        date: date,
        lunch,
        dinner,
      },
    });

    return NextResponse.json(rsvp);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create RSVP day | " + error },
      { status: 500 }
    );
  }
}
