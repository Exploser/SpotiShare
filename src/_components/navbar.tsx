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
    <header className="sticky top-0 z-50">
      <nav
        className={`flex justify-between items-center text-xl font-semibold transition-colors duration-300 h-20 bg-opacity-5 ${scrolled ? 'bg-gradient-to-bl from-green-800 to-lime-500 p-4 text-black' : 'text-white bg-transparent p-2'
          }`}
      >
        <div className="max-w-screen-xl flex justify-between items-center w-full mx-auto">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Wrapify Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark">Wrapify</span>
            </a>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>

  );
}