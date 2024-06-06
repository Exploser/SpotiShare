'use client';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import React, { useEffect, useState } from 'react';
import logo from '../static/logo.svg';


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
        className={`flex justify-between items-center text-xl font-semibold duration-100 h-20 ${scrolled ? 'bg-green-600 bg-opacity-60 p-4 text-black h-fit' : 'text-white bg-transparent h-20 p-2'
          }`}
      >
        <div className="max-w-screen-xl flex justify-between items-center w-full mx-auto">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="https://utfs.io/f/ae825872-1847-443e-b354-206e5dc5a2be-1zbfv.svg" className="h-8" alt="Wrapify Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark">TacoTunes</span>
            </a>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <div className="clerk-image-auth" id="prof-image">
              <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>

  );
}