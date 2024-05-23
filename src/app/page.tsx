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

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/student">
          <Card className="w-full max-w-sm cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
            <CardHeader>
              <CardTitle className="text-center">Enter as a Student</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Click here to navigate to the student page.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/coach">
          <Card className="w-full max-w-sm cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
            <CardHeader>
              <CardTitle className="text-center">Enter as a Coach</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Click here to navigate to the coach page.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
