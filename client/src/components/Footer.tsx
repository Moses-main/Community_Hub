import { Link } from "wouter";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ChevronRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <img 
                src="/church_logo.jpeg" 
                alt="WCCRM Lagos" 
                className="h-10 w-auto object-contain"
              />
              <span className="font-semibold text-slate-900 text-lg">
                WCCRM<span className="text-indigo-600"> Lagos</span>
              </span>
            </Link>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-6 max-w-sm">
              A community dedicated to loving God, loving people, and making a difference in our city and beyond.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200">
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200">
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200">
                <Youtube className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/events" className="text-slate-500 hover:text-indigo-600 text-[15px] flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="text-slate-500 hover:text-indigo-600 text-[15px] flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Sermon Archive
                </Link>
              </li>
              <li>
                <Link href="/devotionals" className="text-slate-500 hover:text-indigo-600 text-[15px] flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Daily Devotionals
                </Link>
              </li>
              <li>
                <Link href="/prayer" className="text-slate-500 hover:text-indigo-600 text-[15px] flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Prayer Requests
                </Link>
              </li>
              <li>
                <Link href="/give" className="text-slate-500 hover:text-indigo-600 text-[15px] flex items-center gap-2 group">
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Ways to Give
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-5">Service Times</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                <div>
                  <p className="font-medium text-slate-800 text-[15px]">Sunday Service</p>
                  <p className="text-slate-500 text-sm">8:30 AM - 12:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                <div>
                  <p className="font-medium text-slate-800 text-[15px]">Tuesday Bible Study</p>
                  <p className="text-slate-500 text-sm">6:00 PM - 8:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0"></div>
                <div>
                  <p className="font-medium text-slate-800 text-[15px]">Thursday Prayers</p>
                  <p className="text-slate-500 text-sm">6:00 PM - 8:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <p className="text-slate-500 text-[15px] leading-relaxed">
                  7 Silverbird Road,<br/>
                  Jakande First Gate,<br/>
                  Lekki, Lagos State
                </p>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-600 shrink-0" />
                <a href="tel:+2341234567890" className="text-slate-500 hover:text-indigo-600 text-[15px] transition-colors">
                  +234 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
                <a href="mailto:info@wccrmlagos.org" className="text-slate-500 hover:text-indigo-600 text-[15px] transition-colors">
                  info@wccrmlagos.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} WCCRM Lagos Church. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-slate-400 hover:text-indigo-600 text-sm transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-200">|</span>
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
