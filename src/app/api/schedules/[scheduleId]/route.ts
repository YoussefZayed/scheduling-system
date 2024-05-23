import { NextResponse } from "next/server";
import db from "@/../../db";

export async function POST(
  request: Request,
  { params }: { params: { scheduleId: string } }
) {
  const { startDateTime, endDateTime } = await request.json();
  const { scheduleId } = params;

  try {
    const schedule = await db("schedules").where({ id: scheduleId }).first();

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    const startDateTimeUTC = new Date(startDateTime).toUTCString();
    const endDateTimeUTC = new Date(endDateTime).toUTCString();

    await db("schedule_availability_blocks").insert({
      schedule_id: scheduleId,
      start_time: startDateTimeUTC,
      end_time: endDateTimeUTC,
    });

    return NextResponse.json({
      message: "Availability block added successfully",
    });
  } catch (error) {
    console.error("Error adding availability block:", error);
    return NextResponse.json(
      { error: "Failed to add availability block" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { scheduleId: string } }
) {
  const { scheduleId } = params;

  try {
    const availabilityBlocks = await db
      .select("start_time", "end_time")
      .from("schedule_availability_blocks")
      .where({ schedule_id: scheduleId });

    return NextResponse.json(availabilityBlocks);
  } catch (error) {
    console.error("Error getting availability blocks:", error);
    return NextResponse.json(
      { error: "Failed to get availability blocks" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { scheduleId: string } }
) {
  const { scheduleId } = params;

  try {
    await db("schedule_availability_blocks").where({ schedule_id: scheduleId });

    return NextResponse.json({
      message: "Availability block deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting availability block:", error);
    return NextResponse.json(
      { error: "Failed to delete availability block" },
      { status: 500 }
    );
  }
}
