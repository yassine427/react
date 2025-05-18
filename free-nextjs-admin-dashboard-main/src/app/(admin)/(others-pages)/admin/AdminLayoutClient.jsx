// src/app/admin/AdminLayoutClient.jsx (Create this new file)
"use client"; // This component handles client-side interactions

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayoutClient({ children }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  // Note: Fixed potentially invalid class name `max-w-(--breakpoint-2xl)` in original code.
  // Assuming you meant a standard Tailwind max-width like `max-w-7xl` or similar.
  // Also fixed missing quotes in className definition.
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]" // Use specific pixel values or Tailwind spacing scale (e.g., lg:ml-72)
    : "lg:ml-[90px]"; // Use specific pixel values or Tailwind spacing scale (e.g., lg:ml-20)

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop are likely client components */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`} // Ensure template literal is correctly formatted
      >
        {/* Header is likely a client component */}
        <AppHeader />
        {/* Page Content */}
        {/* Assuming max-w-7xl here, adjust as needed based on your design */}
        <main className="p-4 mx-auto max-w-7xl md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}