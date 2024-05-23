"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Session {
  id: number;
  status: string;
  start_time: string;
  end_time: string;
  student_satisfaction?: number;
  notes?: string;
  student_phone_number?: string;
  coach_phone_number?: string;
  student_name?: string;
  coach_name?: string;
}

export default function StudentSessions({ studentId }: { studentId: string }) {
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [notesValues, setNotesValues] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/student/${studentId}`, {
        method: "GET",
      });
      const data = await response.json();
      const sessions: Session[] = data.sessions;

      console.log(sessions);
      const upcoming = sessions.filter(
        (session) => session.status === "scheduled"
      );
      const completed = sessions.filter(
        (session) => session.status !== "scheduled"
      );

      setUpcomingSessions(upcoming);
      setCompletedSessions(completed);
    } catch (error) {
      console.log("Error fetching sessions:", error);
    }
  };

  const handleCompleteSession = async (sessionId: number) => {
    try {
      const response = await fetch(`/api/student/sessions/${studentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          student_satisfaction: ratings[sessionId],
          notes: notesValues[sessionId],
        }),
      });

      if (response.ok) {
        setRatings((prevRatings) => {
          const updatedRatings = { ...prevRatings };
          delete updatedRatings[sessionId];
          return updatedRatings;
        });
        setNotesValues((prevNotes) => {
          const updatedNotes = { ...prevNotes };
          delete updatedNotes[sessionId];
          return updatedNotes;
        });
        fetchSessions();
      } else {
        console.log("Failed to complete session");
      }
    } catch (error) {
      console.log("Error completing session:", error);
    }
  };

  const handleRatingChange = (sessionId: number, value: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [sessionId]: value,
    }));
  };

  const handleNotesChange = (sessionId: number, value: string) => {
    setNotesValues((prevNotes) => ({
      ...prevNotes,
      [sessionId]: value,
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Student Sessions</h1>

      <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
      {upcomingSessions.length === 0 ? (
        <p>No upcoming sessions.</p>
      ) : (
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <CardTitle>Session {session.id}</CardTitle>
                <CardDescription>
                  {session.status === "scheduled" ? "Upcoming" : "Completed"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Coach: {session.coach_name}</p>
                <p>Coach Phone: {session.coach_phone_number}</p>

                <p>
                  Start Time: {new Date(session.start_time).toLocaleString()}
                </p>
                <p>End Time: {new Date(session.end_time).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Completed Sessions</h2>
      {completedSessions.length === 0 ? (
        <p>No completed sessions.</p>
      ) : (
        <div className="space-y-4">
          {completedSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <CardTitle>Session {session.id}</CardTitle>
                <CardDescription>Completed</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Coach: {session.coach_name}</p>
                <p>Coach Phone: {session.coach_phone_number}</p>

                <p>
                  Start Time: {new Date(session.start_time).toLocaleString()}
                </p>
                <p>End Time: {new Date(session.end_time).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
