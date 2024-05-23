import { NextResponse } from "next/server";
import db from "@/../../db";

export async function GET(
  request: Request,
  { params }: { params: { coachId: string } }
) {
  const { coachId } = params;

  try {
    const schedule = await db
      .select("id", "name", "status")
      .from("schedules")
      .where({ user_id: coachId, status: "active" })
      .first();
    if (!schedule) {
      return NextResponse.json([]);
    }

    const availabilityBlocks = await db
      .select("start_time", "end_time")
      .from("schedule_availability_blocks")
      .where("schedule_id", schedule.id);
    if (!availabilityBlocks) {
      return NextResponse.json(
        { error: "No availability blocks found" },
        { status: 404 }
      );
    }

    const sessions = await db
      .select("start_time", "end_time")
      .from("sessions")
      .join(
        "session_participants",
        "sessions.id",
        "=",
        "session_participants.session_id"
      )
      .where("session_participants.user_id", coachId);

    const scheduledTimeSlots = getScheduledTimeSlots(
      availabilityBlocks,
      sessions
    );

    return NextResponse.json(scheduledTimeSlots);
  } catch (error) {
    console.error("Error getting schedules:", error);
    return NextResponse.json([]);
  }
}

function getScheduledTimeSlots(
  availabilityBlocks: {
    start_time: string;
    end_time: string;
  }[],
  sessions: {
    start_time: string;
    end_time: string;
  }[]
) {
  const sessionLength = 120; // in minutes
  const sessionIncrements = 60; // in minutes

  const timeSlots: { start: Date; end: Date }[] = [];

  availabilityBlocks.forEach((block) => {
    const startTime = new Date(block.start_time);
    const endTime = new Date(block.end_time);

    let currentTime = startTime;

    while (currentTime < endTime) {
      const slotEndTime = new Date(
        currentTime.getTime() + sessionLength * 60000
      );

      if (slotEndTime <= endTime) {
        const isOverlapping = sessions.some((session) => {
          const sessionStartTime = new Date(session.start_time);
          const sessionEndTime = new Date(session.end_time);
          return (
            (currentTime >= sessionStartTime && currentTime < sessionEndTime) ||
            (slotEndTime > sessionStartTime && slotEndTime <= sessionEndTime)
          );
        });

        if (!isOverlapping) {
          timeSlots.push({ start: currentTime, end: slotEndTime });
        }
      }

      currentTime = new Date(currentTime.getTime() + sessionIncrements * 60000);
    }
  });

  return timeSlots;
}
