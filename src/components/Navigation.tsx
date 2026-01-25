import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, PlusCircle, Cookie, Info } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/add", icon: PlusCircle, label: "Add" },
  { path: "/jar", icon: Cookie, label: "My Jar" },
  { path: "/about", icon: Info, label: "About" },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lifted z-40">
      <div className="container max-w-lg mx-auto">
        <ul className="flex justify-around items-center py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`
                    flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors
                    ${isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="relative">
                    <Icon className="h-6 w-6" />
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
