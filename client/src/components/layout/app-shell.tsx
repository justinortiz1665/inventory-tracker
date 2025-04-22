import { ReactNode } from "react";
import Sidebar from "./sidebar";
import MobileNav from "./mobile-nav";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Mobile navigation */}
      <MobileNav />
      
      {/* Main content */}
      <main className="flex-1 relative z-0 overflow-y-auto pt-5 pb-16 md:pb-5 md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-12 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
