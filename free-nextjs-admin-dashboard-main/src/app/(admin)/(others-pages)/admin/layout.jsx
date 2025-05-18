// src/app/admin/layout.jsx
// This is the SERVER component layout for the /admin/* routes.
// It handles authentication/authorization BEFORE rendering the client UI.

import React from 'react';
// Ensure you import from 'next-auth/next' for server components
import { getServerSession } from 'next-auth/next';
// Adjust the path to your authOptions file if necessary
import { authOptions } from '../../../api/auth/[...nextauth]/route';
// Import the Client Component that holds the actual UI structure
import AdminLayoutClient from './AdminLayoutClient';

// This function MUST be async to use await getServerSession
export default async function AdminLayout({ children }) {
  // Fetch session data on the server
  const session = await getServerSession(authOptions);
  console.log("ADMIN LAYOUT (SERVER): Fetched session:", JSON.stringify(session, null, 2)); // Debug log

  // --- Authorization Check ---
  // Use optional chaining (?.) for safer access to nested properties
  if (!session || session.user?.role !== 'admin') {
    console.log("ADMIN LAYOUT (SERVER): Auth check FAILED. Role:", session?.user?.role); // Debug log
    // Render an unauthorized message if not logged in or not an admin
    return (
      <section className='flex items-center justify-center min-h-screen py-24'>
        <div className='container text-center px-4'> {/* Added padding */}
          <h1 className='text-2xl font-bold text-red-600 dark:text-red-400'>
            Unauthorized Access
          </h1>
          <p className='mt-2 text-gray-700 dark:text-gray-300'>
            You do not have the necessary permissions to view this page.
          </p>
          {/* Optional: Add a link to login or home page */}
          {/* <Link href={session ? "/" : "/login"} className="mt-4 inline-block text-blue-500 hover:underline">
            {session ? "Go Home" : "Go to Login"}
          </Link> */}
        </div>
      </section>
    );
  }

  // --- Render Client Component if Authorized ---
  // If the check passes, render the client component wrapper
  // and pass the children down to it.
 
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
