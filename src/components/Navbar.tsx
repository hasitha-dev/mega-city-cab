import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  Car,
  MapPin,
  DollarSign,
  HelpCircle,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Check if the current route is active
  const isActive = (path: string) => location.pathname === path;

  // Handle scroll event to add shadow to navbar when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Create nav links conditionally based on user role
  const getNavLinks = () => {
    const links = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <User className="h-4 w-4 mr-2" />,
      },
    ];

    // Only show Booking to non-admin users
    if (!isAdmin) {
      links.push({
        name: "Booking",
        path: "/booking",
        icon: <MapPin className="h-4 w-4 mr-2" />,
      });
    }

    links.push({
      name: "Billing",
      path: "/billing",
      icon: <DollarSign className="h-4 w-4 mr-2" />,
    });

    // Add Admin link only for admin users
    if (isAdmin) {
      links.push({
        name: "Admin",
        path: "/admin",
        icon: <Car className="h-4 w-4 mr-2" />,
      });
    }

    // Add Help link only for non-admin users
    if (!isAdmin) {
      links.push({
        name: "Help",
        path: "/help",
        icon: <HelpCircle className="h-4 w-4 mr-2" />,
      });
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-primary font-semibold text-xl flex items-center"
            >
              <Car className="h-6 w-6 mr-2" />
              <span>Mega Cabs</span>
            </Link>
          </div>

          {/* Desktop menu */}
          {isAuthenticated && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* User menu - Desktop */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-foreground focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && isAuthenticated && (
        <div className="md:hidden glass border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-secondary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
