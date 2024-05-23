import { NextResponse } from "next/server";
import db from "@/../../db";

export async function GET(
  request: Request,
  { params }: { params: { coachId: string } }
) {
  const { coachId } = params;

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
      .where("session_participants.user_id", coachId);
    const coach_name = await db
      .select("name")
      .from("users")
      .where({ id: coachId })
      .first();
    const coach_phone_number = await db
      .select("phone_number")
      .from("user_phone_numbers")
      .where({ user_id: coachId })
      .first();
    // get the phone number for each session
    for (let index = 0; index < sessions.length; index++) {
      const session = sessions[index];
      session.coach_phone_number = coach_phone_number.phone_number;
      session.coach_name = coach_name.name;

      // get the id of the student that took the session
      const student = await db
        .select("phone_number_id", "user_id")
        .from("session_participants")
        .where({ session_id: session.id, role: "STUDENT" })
        .first();
      session.student_name = (
        await db
          .select("name")
          .from("users")
          .where({ id: student.user_id })
          .first()
      ).name;
      session.student_phone_number = (
        await db
          .select("phone_number")
          .from("user_phone_numbers")
          .where({ user_id: student.user_id })
          .first()
      ).phone_number;
    }

    // get the student phone number for each session

    return NextResponse.json({ sessions });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { coachId: string } }
) {
  const { coachId } = params;
  const { session_id, student_satisfaction, notes } = await request.json();

  try {
    await db
      .update({ status: "done", student_satisfaction, notes })
      .from("sessions")
      .where({ id: session_id });

    return NextResponse.json({
      message: "Session completed successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
