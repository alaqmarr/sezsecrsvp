import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, field, number, lunch, dinner, deviceId } = await req.json();

    if (!name || !number || !id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const check = await prisma.rSVP.findFirst({
      where: {
        rsvpDayId: id,
        number: number,
      },
    });

    if (check) {
      return NextResponse.json(
        { error: "You have already submitted an RSVP" },
        { status: 400 }
      );
    }

    // Create RSVP
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

    // If dinner is selected, try to send WhatsApp message (optional but non-blocking)
    

    return NextResponse.json(rsvp);
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
