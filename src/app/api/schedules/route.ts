import { NextResponse } from "next/server";
import db from "@/../../db";

// get all schedules for a coach
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 }
    );
  }

  try {
    const schedules = await db("schedules")
      .where({ user_id: userId })
      .select("id", "name", "status");
    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error getting schedules:", error);
    return NextResponse.json(
      { error: "Failed to get schedules" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { userId, name, isActive } = await request.json();

  try {
    if (isActive) {
      await db("schedules")
        .where({ user_id: userId })
        .update({ status: "inactive" });
    }

    const [scheduleId] = await db("schedules")
      .insert({
        user_id: userId,
        name,
        status: isActive ? "active" : "inactive",
      })
      .returning("id");

    return NextResponse.json({
      message: "Schedule created successfully",
      scheduleId,
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    );
  }
}

// patch schedule status and name
export async function PATCH(
  request: Request,
  { params }: { params: { userId: string; scheduleId: string } }
) {
  const { userId, scheduleId } = params;
  const { status, name } = await request.json();

  try {
    if (status === "active") {
      // deactivate all other schedules
      await db("schedules")
        .where({ user_id: userId, status: "active" })
        .update({ status: "inactive" });
    }

    await db("schedules")
      .where({ id: scheduleId, user_id: userId })
      .update({ status, name });
    return NextResponse.json({ message: "Schedule updated successfully" });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    );
  }
}
