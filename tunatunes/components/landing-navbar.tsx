"use client";

import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const font = Montserrat({ subsets: ["latin"], weight: '600' });

export const LandingNavbar = () => {

    return (
        <nav className=" p-4 bg-transparent flex items-center justify-between">
            <Link href="/" className="flex items-center">
                <div className="relative w-8 h-8 mr-4">
                    <Image src="/logo.svg" fill alt="logo" />
                </div>
                <h1 className={cn("text-2xl font-bold text-white", font.className)}>TunaTunes</h1>
            </Link>
            <div className="flex items-center gap-x-2">
                <Link href={"/sign-up"}>
                <Button variant={"outline"} className="rounded-full">
                    Get Started
                </Button>
                </Link>
            </div>
        </nav>
    );
}