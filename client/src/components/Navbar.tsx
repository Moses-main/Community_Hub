import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, ChevronDown, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { apiRoutes } from "@/lib/api-routes";
import { buildApiUrl } from "@/lib/api-config";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/sermons", label: "Sermons" },
    { href: "/events", label: "Events" },
    { href: "/prayer", label: "Prayer" },
    { href: "/give", label: "Give" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100/50 shadow-sm">
      <div className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <img 
            src="/church_logo.jpeg" 
            alt="WCCRM Lagos" 
            className="h-10 md:h-12 w-auto rounded-full object-contain"
          />
          <span className="hidden sm:inline">
            WCCRM<span className="text-primary"> Lagos</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive(link.href)
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User / Mobile Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all">
                    <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                      {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline text-sm font-medium text-gray-700">
                      {user.firstName || user.email.split('@')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 z-50 bg-white border-gray-200 shadow-xl rounded-xl p-1">
                  <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                    <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {user.isAdmin ? (
                      <DropdownMenuItem asChild className="cursor-pointer px-4 py-3 hover:bg-gray-100 rounded-lg mx-1">
                        <Link href="/admin" className="flex items-center gap-3 text-gray-700">
                          <LayoutDashboard className="w-5 h-5 text-primary" />
                          <span className="font-medium">Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild className="cursor-pointer px-4 py-3 hover:bg-gray-100 rounded-lg mx-1">
                        <Link href="/dashboard" className="flex items-center gap-3 text-gray-700">
                          <LayoutDashboard className="w-5 h-5 text-primary" />
                          <span className="font-medium">My Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </div>
                  <DropdownMenuSeparator className="my-1" />
                  <div className="py-1">
                    <DropdownMenuItem onClick={() => logout()} className="cursor-pointer px-4 py-3 hover:bg-red-50 rounded-lg mx-1 text-red-600">
                      <LogOut className="w-5 h-5 mr-3" />
                      <span className="font-medium">Sign out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4"
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-2 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-medium p-3 rounded-xl transition-colors ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <>
                    <Link
                      href={user.isAdmin ? "/admin" : "/dashboard"}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium p-3 rounded-xl transition-colors flex items-center gap-2 ${
                        isActive("/dashboard") || isActive("/admin")
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      {user.isAdmin ? "Admin Dashboard" : "My Dashboard"}
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="text-lg font-medium p-3 rounded-xl transition-colors flex items-center gap-2 text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign out
                    </button>
                  </>
                )}
                {!user && (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium p-3 rounded-xl transition-colors flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      Sign In
                    </Link>
                    <Button asChild className="w-full rounded-xl bg-gradient-primary" onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/login">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
