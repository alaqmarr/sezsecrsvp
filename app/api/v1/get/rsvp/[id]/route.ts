import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const rsvp = await prisma.rSVPDay.findUnique({
      where: {
        id,
      },
    });
    return NextResponse.json(rsvp);
  } catch (error) {
    return NextResponse.json(error);
  }
}
