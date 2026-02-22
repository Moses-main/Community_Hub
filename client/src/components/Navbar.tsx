import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useUnreadCount } from "@/hooks/use-messages";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, ChevronDown, LogOut, LayoutDashboard, Settings, CalendarCheck, QrCode, Shield, Bell, Music, Mic, Users, Heart, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { apiRoutes } from "@/lib/api-routes";
import { buildApiUrl } from "@/lib/api-config";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSelector } from "@/components/LanguageSelector";

export function Navbar() {
  const [location] = useLocation();
  const { user, isLoading: authLoading, logout } = useAuth();
  const { data: unreadCount } = useUnreadCount();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/live", label: t("live") },
    { href: "/events", label: t("events") },
    { href: "/prayer", label: t("prayer") },
    { href: "/volunteer", label: t("volunteer") },
    { href: "/devotionals", label: t("devotionals") },
    { href: "/give", label: t("give") },
  ];

  const mediaLinks = [
    { href: "/sermons", label: t("sermons"), icon: Mic },
    { href: "/music", label: t("music"), icon: Music },
    { href: "/bible", label: t("bible"), icon: BookOpen },
    { href: "/discipleship", label: t("discipleship"), icon: BookOpen },
  ];

  const communityLinks = [
    { href: "/groups", label: t("groups"), icon: Users },
    { href: "/house-cells", label: t("houseCells"), icon: Heart },
  ];

  const isActive = (path: string) => location === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full md:bg-white/80 md:backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
    >
      <div className="container mx-auto px-3 md:px-8 h-14 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <img 
            src="/church_logo.jpeg" 
            alt="WCCRM Lagos" 
            className="h-8 md:h-12 w-auto rounded-full object-contain"
          />
          <span className="hidden sm:inline text-sm md:text-base">
            WCCRM<span className="text-primary"> Lagos</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          
          {/* Media Dropdown - Hover */}
          <div className="relative group">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg flex items-center gap-1">
              {t("media")} <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl py-2 w-48 overflow-hidden">
                {mediaLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Community Dropdown - Hover */}
          <div className="relative group">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg flex items-center gap-1">
              {t("community")} <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl py-2 w-48 overflow-hidden">
                {communityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User / Mobile Actions */}
        <div className="flex items-center gap-3">
          <LanguageSelector variant="navbar" />
          {user ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all relative">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      {unreadCount?.count ? (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                        </span>
                      ) : null}
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
                    <DropdownMenuItem asChild className="cursor-pointer px-4 py-3 hover:bg-gray-100 rounded-lg mx-1">
                      <Link href="/attendance" className="flex items-center gap-3 text-gray-700">
                        <CalendarCheck className="w-5 h-5 text-primary" />
                        <span className="font-medium">My Attendance</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer px-4 py-3 hover:bg-gray-100 rounded-lg mx-1">
                      <Link href="/privacy" className="flex items-center gap-3 text-gray-700">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-medium">Privacy & Data</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer px-4 py-3 hover:bg-gray-100 rounded-lg mx-1">
                      <Link href="/messages" className="flex items-center gap-3 text-gray-700 w-full">
                        <div className="relative">
                          <Bell className="w-5 h-5 text-primary" />
                          {unreadCount?.count ? (
                            <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold px-1">
                              {unreadCount.count > 9 ? '9+' : unreadCount.count}
                            </span>
                          ) : null}
                        </div>
                        <span className="font-medium flex-1">Messages</span>
                      </Link>
                    </DropdownMenuItem>
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
                className="text-gray-600 hover:text-primary hover:bg-gray-100 px-4"
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
              <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-2 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg3 rounded-xl transition font-medium p--colors ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Media Section */}
                <div className="pt-4 mt-2 border-t">
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Media</p>
                  {mediaLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium p-3 rounded-xl transition-colors flex items-center gap-2 ${
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Community Section */}
                <div className="pt-4 mt-2 border-t">
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Community</p>
                  {communityLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium p-3 rounded-xl transition-colors flex items-center gap-2 ${
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}
                </div>
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
                    <Link
                      href="/attendance"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium p-3 rounded-xl transition-colors flex items-center gap-2 ${
                        isActive("/attendance")
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <CalendarCheck className="w-5 h-5" />
                      My Attendance
                    </Link>
                    <Link
                      href="/attendance/scan"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium p-3 rounded-xl transition-colors flex items-center gap-2 ${
                        isActive("/attendance/scan")
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <QrCode className="w-5 h-5" />
                      Scan QR
                    </Link>
                    <Link
                      href="/messages"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium p-3 rounded-xl transition-colors flex items-center gap-2 ${
                        isActive("/messages")
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Bell className="w-5 h-5" />
                      Messages
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
    </motion.nav>
  );
}
