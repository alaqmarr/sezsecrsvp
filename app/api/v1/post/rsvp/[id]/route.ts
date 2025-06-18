import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Changed from Promise<{id: string}>
) {
  try {
    const { id } = await params; // No longer awaiting params
    const { name, field, number, lunch, dinner, deviceId } = await req.json();

    // Validate required fields
    if (!name || !number || !id) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    if (dinner) {
      // Send WhatsApp message
      const endpoint = "https://server.gallabox.com/devapi/messages/whatsapp";
      const json = {
        channelId: "684fc682a8649a3161213268",
        channelType: "whatsapp",
        recipient: {
          name,
          phone: "91" + number, // Ensure number is valid
        },
        whatsapp: {
          type: "template",
          template: {
            templateName: "invite", // Fixed possible typo
            bodyValues: {
              name,
            },
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
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to send message:", errorData);
      }

      const data = await res.json();
      console.log("Message sent successfully:", data);
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
