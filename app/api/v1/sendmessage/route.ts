import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { number, name } = await request.json();
    const endpoint = "https://server.gallabox.com/devapi/messages/whatsapp";
    const json = {
      channelId: "684fc682a8649a3161213268",
      channelType: "whatsapp",
      recipient: {
        name: name,
        phone: number,
      },
      whatsapp: {
        type: "template",
        template: {
          templateName: "invition",
          bodyValues: {
            name: name,
          },
        },
      },
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        apiKey: "684fc98571011f1db625575b",
        apiSecret: "07e228371f6745ed80bb5bf62f08e37b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
