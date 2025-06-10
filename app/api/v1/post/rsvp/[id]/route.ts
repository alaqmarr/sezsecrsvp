import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, field, number, lunch, dinner, deviceId } = await req.json();

  try {
    const rsvp = await prisma.rSVP.create({
      data: {
        name,
        field,
        number,
        rsvpDayId: id,
        lunch,
        dinner,
        deviceId,
      },
    });

    return NextResponse.json(rsvp);
  } catch (error) {
    return NextResponse.json(error);
  }
}
