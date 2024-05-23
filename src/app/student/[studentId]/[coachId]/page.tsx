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
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CoachSelection({
  params,
}: {
  params: { studentId: string; coachId: string };
}) {
  const [searchDate, setSearchDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [timeSlots, setTimeSlots] = useState([]);
  const [filteredTimeSlots, setFilteredTimeSlots] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTimeSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTimeSlots = async () => {
    const url = `http://localhost:3000/api/coach/${params.coachId}`;
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      console.log("Failed to fetch coach data:", response);
    }
    const data = await response.json();
    setTimeSlots(data);
    setFilteredTimeSlots(data);
  };

  useEffect(() => {
    filterTimeSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDate, timeSlots]);

  const filterTimeSlots = () => {
    if (timeSlots.length === 0) {
      return;
    }
    const filtered = timeSlots.filter((slot: { start: string }) => {
      const slotDate = new Date(slot.start).toISOString().split("T")[0];
      return slotDate === searchDate;
    });

    setFilteredTimeSlots(filtered);
    setCurrentPage(1);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectTimeSlot = async (slot: { start: string }) => {
    const startTime = new Date(slot.start);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours to start time

    const requestBody = {
      coachId: params.coachId,
      studentId: params.studentId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    const response = await fetch("http://localhost:3000/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      // refresh the slots
      fetchTimeSlots();
    } else {
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentTimeSlots: any = [];
  if (filteredTimeSlots.length > 0) {
    currentTimeSlots = filteredTimeSlots?.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Select a Time Slot</h1>
      <div className="mb-4">
        <Label htmlFor="searchDate">Search by Date</Label>
        <Input
          id="searchDate"
          type="date"
          value={searchDate}
          onChange={handleDateChange}
        />
      </div>
      {currentTimeSlots && currentTimeSlots.length === 0 ? (
        <p>No available time slots.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTimeSlots.map(
              (
                slot: {
                  start: string;
                  end: string;
                },
                index
              ) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>
                      Time Slot{" "}
                      {new Date(slot.start).toLocaleString().split(",")[1]}
                    </CardTitle>
                    <CardDescription>
                      {new Date(slot.start).toLocaleString()} -{" "}
                      {new Date(slot.end).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => handleSelectTimeSlot(slot)}
                    >
                      Select
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </div>
          <div className="mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous Page
            </Button>
            <Button
              disabled={indexOfLastItem >= filteredTimeSlots.length}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next Page
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
