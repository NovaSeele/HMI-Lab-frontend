"use client"

import { Nunito } from "next/font/google";
import "../globals.css";
import Header from "@/components/common/header";
import SideBar from "@/components/common/sideBar";
// Removed useState import

const inter = Nunito({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  // Removed isSidebarVisible state and toggleSidebar function

  return (
    <html lang="en">
      <body className={inter.className + ""}>
        <Header />
        <main className="flex content pt-[40px] translate-y-12">
          <SideBar isVisible={true} /> {/* Sidebar is always visible */}
          <div className="ml-[379px] w-full"> {/* Fixed margin for sidebar */}
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}