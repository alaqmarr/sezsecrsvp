import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { date, lunch, dinner } = await req.json();

  try {
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
