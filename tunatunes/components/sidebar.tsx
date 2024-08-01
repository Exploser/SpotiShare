"use client";

import { cn } from "@/lib/utils";
import { AudioWaveform, History, LayoutDashboard, MessageSquare, MicVocal, Music, Settings, VideoIcon } from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"],
});

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: 'text-sky-500',
    },
    {
        label: "Artists",
        icon: MicVocal,
        href: "/artists",
        color: 'text-violet-500',
    },
    {
        label: "Tracks",
        icon: Music,
        href: "/tracks",
        color: 'text-pink-500',
    },
    {
        label: "Recent",
        icon: History,
        href: "/recent",
        color: 'text-orange-500',
    },
    {
        label: "Discover",
        icon: AudioWaveform,
        href: "/discover",
        color: 'text-emerald-500',
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
];

const Sidebar = () => {
    const pathname = usePathname();
    return ( 
        <div className="space-y-4 py-4 flex flex-col h-[100vh] bg-[#111827] text-white justify-between ">
            <div className="px-3 py-2 flex-1">
                <Link href={"/"} className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Image src="/logo.svg" layout="fill" alt="Loser Logo"/>
                    </div>
                    <h1 className={cn("text-2xl font-bold text-white", montserrat.className)}>
                        TunaTunes
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route, index) => (
                            <Link key={index} href={route.href} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition", pathname===route.href ? "text-white bg-white/10" : 'text-zinc-400')}>
                        <div className="flex items-center flex-1">
                            <route.icon className={cn("w-6 h-6 mr-4", route.color)}/>
                            {route.label}
                        </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
     );
}
 
export default Sidebar;