import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const showNavigation = location.pathname !== "/";

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-end">
        {showNavigation && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center px-4 py-2">
              <Menu className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  to="/wallet"
                  className={cn(
                    "w-full",
                    location.pathname === "/wallet" && "text-primary"
                  )}
                >
                  Wallet
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/loan"
                  className={cn(
                    "w-full",
                    location.pathname === "/loan" && "text-primary"
                  )}
                >
                  Get a Loan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/dashboard"
                  className={cn(
                    "w-full",
                    location.pathname === "/dashboard" && "text-primary"
                  )}
                >
                  Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;