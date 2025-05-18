// src/app/layout.jsx

import { Outfit } from "next/font/google";
import "./globals.css";

// Import AppHeader as the main menu
import AppHeader from "@/components/pageAcceuil/menu";
// Remove this if AppHeader is your main menu:
// import Menu from "../components/pageAcceuil/menu";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/providers/authProvider"; // Wraps session context

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AuthProvider>
          <ThemeProvider>
            <SidebarProvider> {/* Keep if AppHeader or children use this context */}
              <AppHeader /> {/* AppHeader is now part of the layout */}
              <main> {/* It's good practice to wrap page content in a <main> tag */}
                {children}
              </main>
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}