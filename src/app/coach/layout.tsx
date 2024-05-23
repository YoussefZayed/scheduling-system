import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <header className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/student">
            <Button variant="outline">Student View</Button>
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
