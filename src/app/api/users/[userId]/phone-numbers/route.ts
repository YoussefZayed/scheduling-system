import { NextResponse } from "next/server";
import db from "@/../../db";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { name, phoneNumber } = await request.json();
  const { userId } = params;

  try {
    await db("user_phone_numbers").insert({
      user_id: userId,
      name,
      phone_number: phoneNumber,
    });

    return NextResponse.json({ message: "Phone number added successfully" });
  } catch (error) {
    console.error("Error adding phone number:", error);
    return NextResponse.json(
      { error: "Failed to add phone number" },
      { status: 500 }
    );
  }
}
