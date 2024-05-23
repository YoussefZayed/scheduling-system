"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function CreateSchedule({
  params,
}: {
  params: { coachId: string };
}) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: params.coachId,
          name,
          isActive,
        }),
      });
      if (response.ok) {
        // Handle successful schedule creation
        console.log("Schedule created successfully");
        // take user back to coach dashboard
        window.location.href = `/coach/${params.coachId}`;
      } else {
        // Handle error
        console.error("Failed to create schedule");
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Create Schedule</h1>
      <Card>
        <CardHeader>
          <CardTitle>Schedule Details</CardTitle>
          <CardDescription>
            Fill in the details to create a new schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Schedule Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <Button type="submit" className="w-full">
              Create Schedule
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
