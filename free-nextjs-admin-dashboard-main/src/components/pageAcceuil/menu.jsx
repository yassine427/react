// src/components/layout/AppHeader.jsx (or your preferred location)
"use client"; // Mark as a client component if it contains client-side interactions or hooks
import { useState } from 'react'; // Make sure this is imported
import Link from 'next/link';
import React from 'react';

// Import icons from lucide-react (make sure to install it: npm install lucide-react)
import { LogOutIcon,LogInIcon, MessageSquareIcon, StethoscopeIcon, LayoutDashboardIcon } from 'lucide-react'; // Added LayoutDashboardIcon
import { useSession, signIn, signOut } from 'next-auth/react'
const AppHeader = ({ className = '' }) => {
  const { data: session } = useSession()
  // Placeholder for logo - replace src with your actual logo path
  const logoSrc = "https://res.cloudinary.com/dpcuxruyo/image/upload/v1745080918/Music-1110x739_sytkh0.jpg";

  return (
    <header className={`bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 ${className}`}>
      {/* Main container for header content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Left Section: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {/* Use an img tag for your logo */}
              <img
                className="h-8 md:h-10 w-auto" // Adjust height as needed
                src={logoSrc}
                alt="Clinic Logo"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x50/cccccc/ffffff?text=Logo+Error"; }} // Basic fallback
              />
              {/* Optional: Add Clinic Name text next to logo */}
              {/* <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">Clinic Name</span> */}
            </Link>
          </div>

          {/* Center Section: Navigation Menu */}
          {/* Hidden on small screens, shown on medium and up */}
          <nav className="hidden md:flex flex-grow justify-center">
            <ul className="flex items-center space-x-4 lg:space-x-8">
              {/* Menu Item: Nos spécialités */}
              <li>
                <Link
                  href="/specialties"
                  className="group inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-all duration-200 ease-in-out"
                >
                  <StethoscopeIcon className="mr-2 h-4 w-4 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400" aria-hidden="true" />
                  Nos spécialités
                </Link>
              </li>
              {/* Menu Item: MyChart - Added */}
              <li>
                <Link
                  href="/mychart" // Adjust href to your actual MyChart route
                  className="group inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-all duration-200 ease-in-out"
                >
                  <LayoutDashboardIcon className="mr-2 h-4 w-4 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400" aria-hidden="true" />
                  MyChart
                </Link>
              </li>
              {/* Menu Item: Contact us */}
              <li>
                <Link
                  href="/contact"
                  className="group inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-all duration-200 ease-in-out"
                >
                  <MessageSquareIcon className="mr-2 h-4 w-4 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400" aria-hidden="true" />
                  Contact us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Section: Login Button */}
          {/* Hidden on small screens, shown on medium and up */}
          <div className="hidden md:flex items-center flex-shrink-0">
            {session ? (
              // If user is logged in, show Logout button
              <button
                onClick={() => signOut()} // Calls NextAuth signOut function
              
              >
                <LogOutIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                Se déconnecter
              </button>
            ) : (
              // If user is not logged in, show Login button
              <button
                onClick={() => signIn()} // Calls NextAuth signIn function (can redirect to a sign-in page)
                                         // Alternatively, use <Link href="/auth/signin"> if you have a dedicated page
             
              >
                <LogInIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                Se connecter
              </button>
            )}
          </div>

          {/* Mobile Menu Button (Example - Needs state and handler) */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-controls="mobile-menu"
              aria-expanded="false"
              // onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} // Add state and handler
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed. */}
              {/* Heroicon name: outline/bars-3 */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              {/* Icon when menu is open. */}
              {/* <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg> */}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu, show/hide based on state (Example - Needs state and implementation) */}
      {/* Add MyChart link here too if implementing mobile menu */}
      {/* <div className="md:hidden" id="mobile-menu">
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <Link href="/specialties" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">Nos spécialités</Link>
          <Link href="/mychart" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">MyChart</Link>
          <Link href="/contact" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">Contact us</Link>
          <Link href="/login" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">Log in</Link>
        </div>
      </div> */}
    </header>
  );
};


// Example of how to use it on a page, including the hero image placeholder
const HomePage = () => {
  // Placeholder for hero image - replace with your actual image or component
  const heroImageSrc = "https://placehold.co/1200x500/e2e8f0/4a5568?text=Hero+Image+Area&font=sans";

  return (
    <div>
      <AppHeader />

      {/* Hero Image Section Placeholder */}
      <div className="relative bg-gray-200 dark:bg-gray-700">
        {/* You can use an img tag or a background image */}
        <img
          src={heroImageSrc}
          alt="Clinic hero banner"
          className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover" // Adjust height and object-fit
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x500/cccccc/ffffff?text=Image+Load+Error"; }}
        />
        {/* Optional: Add text overlay on top of the image */}
        {/* <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <h1 className="text-white text-3xl md:text-5xl font-bold text-center px-4">
            Your Clinic's Catchphrase
          </h1>
        </div> */}
      </div>

      {/* Rest of your page content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page content goes here */}
        <p>Welcome to our clinic!</p>
      </main>
    </div>
  );
};

// export default HomePage; // Export the page component if this is a page file
export default AppHeader; // Export the header component if this is just the header file
