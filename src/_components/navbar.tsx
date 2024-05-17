'use client';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import React, { useEffect, useState } from 'react';


export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header>
       <nav
      className={`flex w-full items-center justify-between p-4 text-xl font-semibold transition-colors duration-300 h-[10vh] ${
        scrolled ? 'bg-gradient-to-bl from-green-800 to-lime-500' : 'text-white bg-transparent'
      }`}
    >
        <div>Wrapify</div>

        <div className="flex flex-row gap-4 items-center">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>

  );
}  