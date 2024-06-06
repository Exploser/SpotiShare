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
        className={`flex justify-between items-center text-xl font-semibold duration-100 h-20 ${scrolled ? 'scrolled bg-green-600 bg-opacity-60 p-4 text-black h-12' : 'text-white bg-transparent h-20 p-2'
          }`}
      >
        <div className="max-w-screen-xl flex justify-between items-center w-full mx-auto">
          <div className="flex items-center justify-center">
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className={`logo ${scrolled ? 'items-center justify-center' : ''}`}></div>
              <span className={`text-2xl font-semibold whitespace-nowrap dark ${scrolled ? 'hidden' : ''}`}>TacoTunes</span>
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