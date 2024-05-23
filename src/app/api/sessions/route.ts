import { NextResponse } from "next/server";
import db from "@/../../db";

export async function POST(request: Request) {
  const { coachId, studentId, startTime, endTime } = await request.json();

  try {
    // Check if the coach and student exist
    const coach = await db("users").where({ id: coachId }).first();
    const student = await db("users").where({ id: studentId }).first();
    const coachPhone = await db("user_phone_numbers")
      .select("id")
      .where({ user_id: coachId })
      .first();
    const studentPhone = await db("user_phone_numbers")
      .select("id")
      .where({ user_id: studentId })
      .first();

    if (!coach || !student) {
      return NextResponse.json(
        { error: "Coach or student not found" },
        { status: 404 }
      );
    }

    // Convert startTime and endTime to UTC
    const startTimeUTC = new Date(startTime).toUTCString();
    const endTimeUTC = new Date(endTime).toUTCString();

    // Create the session
    const [sessionId] = await db("sessions")
      .insert({
        start_time: startTimeUTC,
        end_time: endTimeUTC,
        status: "scheduled",
      })
      .returning("id");

    try {
      // Add coach and student as session participants
      await db("session_participants").insert([
        {
          user_id: coachId,
          session_id: sessionId.id,
          role: "COACH",
          phone_number_id: coachPhone.id,
        },
        {
          user_id: studentId,
          session_id: sessionId.id,
          role: "STUDENT",
          phone_number_id: studentPhone.id,
        },
      ]);
    } catch (error) {
      console.error("Error adding participants to session:", error);
      return NextResponse.json(
        { error: "Failed to add participants to session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Session created successfully",
      sessionId,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
