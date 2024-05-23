import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import CoachSessions from "@/components/sessionsSection";

export default async function CoachDashboard({
  params,
}: {
  params: { coachId: string };
}) {
  // Pass coach id to get schedules using GET request
  const baseUrl = "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/schedules?userId=${params.coachId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  const schedules = await response.json();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Coach Dashboard</h1>
      {schedules.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">You do not have any schedules yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schedules.map(
            (schedule: { id: number; name: string; status: string }) => (
              <Link
                key={schedule.id}
                href={`/coach/${params.coachId}/schedule/${schedule.id}`}
              >
                <Card className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 pt-12 pb-8">
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-lg font-semibold">{schedule.name}</p>
                        <p className="text-sm text-gray-500">
                          {schedule.status}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          )}
        </div>
      )}
      <Link href={`/coach/${params.coachId}/create`}>
        <Button>Create Schedule</Button>
      </Link>
      <CoachSessions coachId={params.coachId} />
    </div>
  );
}
