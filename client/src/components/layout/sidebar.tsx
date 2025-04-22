import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package2, 
  BarChart2, 
  Settings, 
  Tag, 
  RefreshCcw 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { 
      href: "/", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      href: "/inventory", 
      label: "Inventory", 
      icon: <Package2 className="h-5 w-5" /> 
    },
    { 
      href: "/transactions", 
      label: "Transactions", 
      icon: <RefreshCcw className="h-5 w-5" /> 
    },
    { 
      href: "/facilities", 
      label: "Facilities", 
      icon: <Tag className="h-5 w-5" /> 
    },
    { 
      href: "/reports", 
      label: "Reports", 
      icon: <BarChart2 className="h-5 w-5" /> 
    },
    { 
      href: "/settings", 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  return (
    <aside className={cn(
      "hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-10 bg-gray-800 text-white",
      className
    )}>
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-semibold">Inventory Pro</h1>
      </div>
      <div className="flex flex-col flex-grow overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
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
      </div>
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
    </aside>
  );
}
