import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Bell, LayoutDashboard, Package2, BarChart2, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/inventory", label: "Inventory", icon: <Package2 className="h-5 w-5" /> },
    { href: "/reports", label: "Reports", icon: <BarChart2 className="h-5 w-5" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="text-gray-500 focus:outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 bg-gray-800 text-white">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-center h-16 border-b border-gray-700">
                    <h1 className="text-xl font-semibold">Inventory Pro</h1>
                  </div>
                  <nav className="flex-1 px-2 py-4 space-y-1">
                    {navItems.map((item) => (
                      <Link 
                        key={item.href} 
                        href={item.href} 
                        onClick={() => setIsOpen(false)}
                      >
                        <a 
                          className={cn(
                            "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                            location === item.href 
                              ? "bg-gray-900 text-white" 
                              : "text-gray-300 hover:bg-gray-700"
                          )}
                        >
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </a>
                      </Link>
                    ))}
                  </nav>
                  <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                          JD
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">John Doe</p>
                        <p className="text-xs font-medium text-gray-400">Admin</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="ml-3 text-lg font-semibold">Inventory Pro</h1>
          </div>
          <div>
            <button className="p-1 rounded-full text-gray-500 focus:outline-none">
              <Bell className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex flex-col items-center py-2 px-3",
                location === item.href ? "text-blue-500" : "text-gray-600"
              )}>
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
