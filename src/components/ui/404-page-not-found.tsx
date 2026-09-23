"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <section className="bg-white font-serif min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url(https://cdn.21st.dev/assets/mirror/35/354f63f88b57aceea4536df0c0cff0c3592aa46fe887ff910751fefc12f3e76c.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-black text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8">
                404
              </h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl text-black sm:text-3xl font-bold mb-4">
                Look like you&apos;re lost
              </h3>
              <p className="mb-6 text-black sm:mb-5">
                The page you are looking for is not available!
              </p>

              <Button
                variant="default"
                asChild
                className="my-5 bg-green-600 hover:bg-green-700"
              >
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
