"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-50/80 dark:bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
              <svg
                className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:to-purple-500 transition-all duration-300">
                MovieDB
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Film Keşfet</p>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/popular" 
                className={`text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ${
                  isActive('/popular') ? 'text-blue-500 dark:text-blue-400 font-medium' : ''
                }`}
              >
                Popüler
              </Link>
              <Link 
                href="/latest" 
                className={`text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ${
                  isActive('/latest') ? 'text-blue-500 dark:text-blue-400 font-medium' : ''
                }`}
              >
                En Yeniler
              </Link>
              <Link 
                href="/upcoming" 
                className={`text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ${
                  isActive('/upcoming') ? 'text-blue-500 dark:text-blue-400 font-medium' : ''
                }`}
              >
                Yakında
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Film ara..."
                    className={`
                      bg-gray-100 dark:bg-gray-800/50 
                      border border-gray-200 dark:border-gray-700
                      text-gray-700 dark:text-gray-200 
                      rounded-lg pl-4 pr-10 py-2
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50
                      transition-all duration-500 ease-in-out
                      ${isSearchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 invisible'}
                    `}
                  />
                  <button 
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg
                      transition-all duration-300
                      ${isSearchOpen 
                        ? 'absolute right-0 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                      }
                    `}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {!isSearchOpen && <span>Ara</span>}
                  </button>
                </div>
              </div>
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
