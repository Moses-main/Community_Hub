import { Link } from "wouter";
import { Church, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/30 pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Church size={20} />
              </div>
              <span>Grace<span className="text-primary">Community</span></span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A community dedicated to loving God, loving people, and making a difference in our city and beyond.
            </p>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/events" className="hover:text-primary transition-colors">Upcoming Events</Link></li>
              <li><Link href="/groups" className="hover:text-primary transition-colors">Small Groups</Link></li>
              <li><Link href="/volunteer" className="hover:text-primary transition-colors">Volunteer</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sermons" className="hover:text-primary transition-colors">Sermon Archive</Link></li>
              <li><Link href="/prayer" className="hover:text-primary transition-colors">Prayer Requests</Link></li>
              <li><Link href="/give" className="hover:text-primary transition-colors">Ways to Give</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Bible Reading Plan</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Visit Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>123 Faith Avenue</p>
              <p>Springfield, ST 12345</p>
              <p className="pt-2">Sundays at 9:00am & 11:00am</p>
              <div className="flex gap-4 pt-4">
                <a href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
                <a href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></a>
                <a href="#" className="hover:text-primary transition-colors"><Youtube size={20} /></a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Grace Community Church. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
