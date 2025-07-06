import { useState } from "react";
import { Eye, Volume2, Hand, Circle, FileText, Menu, X, Code, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  id: string;
  path: string;
  icon: JSX.Element;
  label: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: "echo",
    path: "/echo",
    icon: <Volume2 className="w-6 h-6" />,
    label: "ECHO",
    description: "Music"
  },
  {
    id: "view",
    path: "/view",
    icon: <Eye className="w-6 h-6" />,
    label: "VIEW",
    description: "Photography"
  },
  {
    id: "form",
    path: "/form",
    icon: <Hand className="w-6 h-6" />,
    label: "FORM",
    description: "Merchandise"
  },
  {
    id: "core",
    path: "/core",
    icon: <Circle className="w-6 h-6" />,
    label: "CORE",
    description: "Philosophy"
  },
  {
    id: "note",
    path: "/note",
    icon: <FileText className="w-6 h-6" />,
    label: "NOTE",
    description: "Future"
  },
  {
    id: "look",
    path: "/look",
    icon: <Search className="w-6 h-6" />,
    label: "LOOK",
    description: "Search"
  },
  {
    id: "code",
    path: "/code",
    icon: <Code className="w-6 h-6" />,
    label: "CODE",
    description: "Access Content"
  }
];

export default function MinimalNavigation() {
  const [location] = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

  // Determine active section based on current route
  const activeSection = navItems.find(item => item.path === location)?.id || "view";

  return (
    <nav className="fixed top-8 left-8 z-50">
      <div className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
        isMinimized ? 'p-2' : 'p-4'
      }`}>
        {/* Only show menu icon when minimized */}
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="group relative flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 p-1.5 w-8 h-8"
          >
            <Menu className="w-4 h-4" />
            
            {/* Toggle tooltip */}
            <div className="absolute left-full ml-3 bg-black dark:bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Show Menu
            </div>
          </button>
        ) : (
          <>
            {/* Hide Button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="group relative flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 p-2 mb-2"
            >
              <X className="w-5 h-5" />
              
              {/* Toggle tooltip */}
              <div className="absolute left-full ml-3 bg-black dark:bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Hide Menu
              </div>
            </button>

            {/* Theme Toggle */}
            <div className="mb-2">
              <ThemeToggle />
            </div>

            {/* Navigation Items with Icons and Tooltips */}
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`group relative flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 bg-black dark:bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}