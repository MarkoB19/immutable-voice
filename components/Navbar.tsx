'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-20 bg-gray-900/95 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center text-white">
      <Link href="/" className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-white hover:from-indigo-400 hover:to-indigo-200 transition-all duration-300">
        Immutable Voice
      </Link>

      {/* Hamburger Icon */}
      <button className="md:hidden text-gray-300" onClick={() => setIsOpen(!isOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-16 6h16"} />
        </svg>
      </button>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/" className="text-gray-300 font-medium hover:text-indigo-300 hover:scale-105 transition-all duration-300">Home</Link>
        <Link href="/upload" className="text-gray-300 font-medium hover:text-indigo-300 hover:scale-105 transition-all duration-300">Upload</Link>
        <Link href="/documents" className="text-gray-300 font-medium hover:text-indigo-300 hover:scale-105 transition-all duration-300">Documents</Link>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-900/95 md:hidden flex flex-col items-center gap-4 py-4">
          <Link href="/" className="text-gray-300 font-medium hover:text-indigo-300 transition-all duration-300" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/upload" className="text-gray-300 font-medium hover:text-indigo-300 transition-all duration-300" onClick={() => setIsOpen(false)}>Upload</Link>
          <Link href="/documents" className="text-gray-300 font-medium hover:text-indigo-300 transition-all duration-300" onClick={() => setIsOpen(false)}>Documents</Link>
        </div>
      )}
    </nav>
  );
}
