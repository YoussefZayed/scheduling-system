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

export default async function Coach() {
  const response = await fetch("http://localhost:3000/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const coaches = data.filter(
    (user: { id: number; name: string; role: string; time_zone: string }) =>
      user.role === "COACH"
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Choose Your Coach</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coaches.map(
          (coach: { id: number; name: string; time_zone: string }) => (
            <Link key={coach.id} href={`/coach/${coach.id}`}>
              <Card className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 pt-12 pb-8">
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Image
                      src={`https://api.dicebear.com/8.x/personas/svg?seed=${coach.name}`}
                      width={64}
                      height={64}
                      alt={coach.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <p className="text-lg font-semibold">
                        Coach {coach.name}
                      </p>
                      <p className="text-sm text-gray-500">{coach.time_zone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
