"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function CoachSessions({ coachId }: { coachId: string }) {
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [notesValues, setNotesValues] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/coach/sessions/${coachId}`, {
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
      const response = await fetch(`/api/coach/sessions/${coachId}`, {
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
      <h1 className="text-3xl font-bold mb-4">Coach Sessions</h1>

      <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
      {upcomingSessions.length === 0 ? (
        <p>No upcoming sessions.</p>
      ) : (
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <CardTitle>Session {session.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Student: {session.student_name}</p>
                <p>Student Phone: {session.student_phone_number}</p>
                <p>
                  Start Time: {new Date(session.start_time).toLocaleString()}
                </p>
                <p>End Time: {new Date(session.end_time).toLocaleString()}</p>
                <div className="mt-4">
                  <Label htmlFor={`rating-${session.id}`}>Rating (1-5):</Label>
                  <Input
                    id={`rating-${session.id}`}
                    type="number"
                    min={1}
                    max={5}
                    value={ratings[session.id] || ""}
                    onChange={(e) =>
                      handleRatingChange(session.id, parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="mt-4">
                  <Label htmlFor={`notes-${session.id}`}>Notes:</Label>
                  <Textarea
                    id={`notes-${session.id}`}
                    value={notesValues[session.id] || ""}
                    onChange={(e) =>
                      handleNotesChange(session.id, e.target.value)
                    }
                  />
                </div>
                <Button
                  className="mt-4"
                  onClick={() => handleCompleteSession(session.id)}
                >
                  Complete Session
                </Button>
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
              </CardHeader>
              <CardContent>
                <p>Student: {session.student_name}</p>
                <p>Student Phone: {session.student_phone_number}</p>
                <p>
                  Start Time: {new Date(session.start_time).toLocaleString()}
                </p>
                <p>End Time: {new Date(session.end_time).toLocaleString()}</p>
                <p>Student Satisfaction: {session.student_satisfaction}</p>
                <p>Notes: {session.notes}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
