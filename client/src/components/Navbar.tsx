import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, User, Church } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/sermons", label: "Sermons" },
    { href: "/events", label: "Events" },
    { href: "/prayer", label: "Prayer" },
    { href: "/give", label: "Give" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Church size={20} />
          </div>
          <span>Grace<span className="text-primary">Community</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User / Mobile Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-semibold">
                  {user.firstName ? `Hi, ${user.firstName}` : user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm" className="hidden md:flex">
              <a href="/api/login">Sign In</a>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`text-lg font-medium p-2 rounded-md transition-colors ${
                      isActive(link.href) ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <Button asChild className="w-full mt-4">
                    <a href="/api/login">Sign In</a>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
