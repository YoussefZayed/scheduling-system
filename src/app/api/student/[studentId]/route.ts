import { NextResponse } from "next/server";
import db from "@/../../db";

export async function GET(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  const { studentId } = params;

  try {
    const sessions = await db
      .select(
        "start_time",
        "end_time",
        "sessions.student_satisfaction",
        "notes",
        "status",
        "sessions.id"
      )
      .from("sessions")
      .join(
        "session_participants",
        "sessions.id",
        "=",
        "session_participants.session_id"
      )
      .where("session_participants.user_id", studentId)
      .andWhere("session_participants.role", "STUDENT");

    for (let index = 0; index < sessions.length; index++) {
      const session = sessions[index];

      // get the id of the coach for that session
      const coach = await db
        .select("user_id")
        .from("session_participants")
        .where({ session_id: session.id, role: "COACH" })
        .first();

      session.coach_name = (
        await db
          .select("name")
          .from("users")
          .where({ id: coach.user_id })
          .first()
      ).name;

      session.coach_phone_number = (
        await db
          .select("phone_number")
          .from("user_phone_numbers")
          .where({ user_id: coach.user_id })
          .first()
      ).phone_number;

      // get the student's phone number and name (just for consistency - as it might be unnecessary)
      session.student_name = (
        await db.select("name").from("users").where({ id: studentId }).first()
      ).name;

      session.student_phone_number = (
        await db
          .select("phone_number")
          .from("user_phone_numbers")
          .where({ user_id: studentId })
          .first()
      ).phone_number;
    }

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
