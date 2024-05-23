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

import Link from "next/link";

export default function Admin() {
  async function createRandomUsers() {
    const randomNames = [
      "John",
      "Jane",
      "Bob",
      "Alice",
      "Charlie",
      "David",
      "Emily",
      "Frank",
      "Grace",
      "Henry",
    ];
    const roles = ["COACH", "STUDENT"];
    const timeZones = [
      "America/New_York",
      "America/Chicago",
      "America/Los_Angeles",
    ];

    for (let i = 0; i < 4; i++) {
      const name = randomNames[Math.floor(Math.random() * randomNames.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const timeZone = timeZones[Math.floor(Math.random() * timeZones.length)];
      // call api

      const user = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, role, timeZone }),
      });
      // read response
      const data = await user.json();

      const randomPhoneNumbers = [
        "1234567890",
        "9876543210",
        "5555555555",
        "1111111111",
        "2222222222",
        "3333333333",
        "4444444444",
        "5555555555",
        "6666666666",
      ];
      const userPhoneNumbersNames = ["home", "work", "mobile"];
      const userPhoneNumber = await fetch(
        "/api/users/" + data.userId.id + "/phone-numbers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userPhoneNumbersNames[Math.floor(Math.random() * 3)],
            phoneNumber:
              randomPhoneNumbers[
                Math.floor(Math.random() * randomPhoneNumbers.length)
              ],
          }),
        }
      );
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Button
          onClick={async () => {
            await createRandomUsers();
            alert("Users created successfully");
          }}
        >
          Create Random Users
        </Button>
      </div>
    </div>
  );
}
