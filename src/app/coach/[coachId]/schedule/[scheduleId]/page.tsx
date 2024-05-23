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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function ScheduleAvailability({
  params,
}: {
  params: { coachId: string; scheduleId: string };
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availabilityBlocks, setAvailabilityBlocks] = useState<
    { startDateTime: string; endDateTime: string }[]
  >([]);

  useEffect(() => {
    // Load availability blocks on mount
    const fetchAvailabilityBlocks = async () => {
      try {
        const response = await fetch(`/api/schedules/${params.scheduleId}`, {
          method: "GET",
        });
        if (response.ok) {
          const blocks = await response.json();
          setAvailabilityBlocks(
            blocks.map((block: any) => ({
              startDateTime: new Date(
                `${block.start_day} ${block.start_time}`
              ).toISOString(),
              endDateTime: new Date(
                `${block.end_day} ${block.end_time}`
              ).toISOString(),
            }))
          );
        } else {
          console.error("Failed to load availability blocks");
        }
      } catch (error) {
        console.error("Error loading availability blocks:", error);
      }
    };

    fetchAvailabilityBlocks();
  }, [params.scheduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDateTime = new Date(`${startDate}T${startTime}`).toISOString();
      const endDateTime = new Date(`${endDate}T${endTime}`).toISOString();

      const response = await fetch(`/api/schedules/${params.scheduleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDateTime,
          endDateTime,
        }),
      });

      if (response.ok) {
        setAvailabilityBlocks((prevBlocks) => [
          ...prevBlocks,
          { startDateTime, endDateTime },
        ]);
        setStartDate("");
        setEndDate("");
        setStartTime("");
        setEndTime("");
      } else {
        console.error("Failed to add availability block");
      }
    } catch (error) {
      console.error("Error adding availability block:", error);
    }
  };

  const handleDelete = async (blockIndex: number) => {
    try {
      const block = availabilityBlocks[blockIndex];
      const response = await fetch(`/api/schedules/${params.scheduleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDateTime: block.startDateTime,
          endDateTime: block.endDateTime,
        }),
      });

      if (response.ok) {
        setAvailabilityBlocks((prevBlocks) =>
          prevBlocks.filter((_, index) => index !== blockIndex)
        );
      } else {
        console.error("Failed to delete availability block");
      }
    } catch (error) {
      console.error("Error deleting availability block:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Schedule Availability</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add Availability Block</CardTitle>
          <CardDescription>
            Select the start and end date and time for the availability block.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Select
                  value={startTime}
                  onValueChange={(value) => setStartTime(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Select
                  value={endTime}
                  onValueChange={(value) => setEndTime(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Add Availability
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Availability Blocks</h2>
        {availabilityBlocks.length === 0 ? (
          <p>No availability blocks added yet.</p>
        ) : (
          <ul className="space-y-4">
            {availabilityBlocks.map((block, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded">
                <p>
                  Start:{" "}
                  {format(
                    new Date(block.startDateTime),
                    "MMMM d, yyyy 'at' h:mm a"
                  )}
                </p>
                <p>
                  End:{" "}
                  {format(
                    new Date(block.endDateTime),
                    "MMMM d, yyyy 'at' h:mm a"
                  )}
                </p>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Helper function to generate time options for the select components
function generateTimeOptions() {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      options.push(time);
    }
  }
  return options;
}
