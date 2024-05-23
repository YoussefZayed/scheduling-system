import { NextResponse } from "next/server";
import db from "@/../../db";

export async function POST(request: Request) {
  const { name, role, timeZone } = await request.json();

  try {
    const [userId] = await db("users")
      .insert({
        name,
        time_zone: timeZone,
      })
      .returning("id");

    await db("user_roles").insert({
      user_id: userId.id,
      role,
    });

    return NextResponse.json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // get all users joined with their roles
  console.log("Fetching users...");
  const users = await db("users")
    .join("user_roles", "users.id", "user_roles.user_id")
    .select("users.*", "user_roles.role");

  return NextResponse.json(users);
}
