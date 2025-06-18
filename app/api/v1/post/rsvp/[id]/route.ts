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
    if (dinner) {
      try {
        const endpoint = "https://server.gallabox.com/devapi/messages/whatsapp";
        const json = {
          channelId: "684fc682a8649a3161213268",
          channelType: "whatsapp",
          recipient: {
            name,
            phone: "91" + number,
          },
          whatsapp: {
            type: "template",
            template: {
              templateName: "invite",
              bodyValues: { name },
            },
          },
        };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            apiKey: "685163b483fa2876fe4495fe",
            apiSecret: "5540208648a74a22a631d784809d7e52",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(json),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("WhatsApp message failed:", errorData);
        } else {
          const data = await res.json();
          console.log("WhatsApp message sent:", data);
        }
      } catch (msgError) {
        console.error("Error sending WhatsApp message:", msgError);
      }
    }

    return NextResponse.json(rsvp);
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
