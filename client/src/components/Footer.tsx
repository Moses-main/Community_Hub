import { Link } from "wouter";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white pt-10 pb-6 border-t border-gray-100">
      <div className="container mx-auto px-3 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <img 
                src="/church_logo.jpeg" 
                alt="WCCRM Lagos" 
                className="h-10 w-auto object-contain"
              />
              <span className="font-semibold text-gray-900 text-sm">
                WCCRM<span className="text-purple-600"> Lagos</span>
              </span>
            </Link>
            <p className="text-gray-500 text-xs leading-relaxed">
              A community dedicated to loving God, loving people, and making a
              difference in our city and beyond.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200">
                <Facebook size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200">
                <Instagram size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200">
                <Youtube size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold mb-3 text-gray-900 text-sm">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events" className="text-gray-500 hover:text-primary transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="text-gray-500 hover:text-primary transition-colors">
                  Sermon Archive
                </Link>
              </li>
              <li>
                <Link href="/prayer" className="text-gray-500 hover:text-primary transition-colors">
                  Prayer Requests
                </Link>
              </li>
              <li>
                <Link href="/give" className="text-gray-500 hover:text-primary transition-colors">
                  Ways to Give
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="font-display font-semibold mb-3 text-gray-900 text-sm">Service Times</h3>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></span>
                <div>
                  <p className="font-medium text-gray-700">Sunday Service</p>
                  <p>8:30 AM - 12:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1"></span>
                <div>
                  <p className="font-medium text-gray-700">Tuesday (Bible Study)</p>
                  <p>6:00 PM - 8:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1"></span>
                <div>
                  <p className="font-medium text-gray-700">Thursday (Prayers)</p>
                  <p>6:00 PM - 8:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-3 text-gray-900 text-sm">Contact Us</h3>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <p>7 Silverbird Road,<br/>Jakande First Gate,<br/>Lekki, Lagos State</p>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+2341234567890" className="hover:text-primary transition-colors">
                  +234 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:info@wccrmlagos.org" className="hover:text-primary transition-colors">
                  info@wccrmlagos.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} WCCRM Lagos Church. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
