import { Link } from "wouter";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ChevronRight, Twitter, MessageCircle } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-hero" />

      <div className="relative z-10 pt-10 sm:pt-20 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-12 mb-8 sm:mb-16">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <img
                  src="/church_logo.jpeg"
                  alt="CHub"
                  className="h-9 sm:h-12 w-auto object-contain rounded-xl sm:rounded-2xl ring-2 ring-white/10"
                />
                <span className="font-bold text-white text-base sm:text-xl font-[--font-display] tracking-tight">
                  CHub
                </span>
              </Link>
              <p className="text-white/40 text-xs sm:text-base leading-relaxed mb-5 sm:mb-8 max-w-sm">
                {t("footerDescription")}
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                {[
                  { href: "https://facebook.com/CHubApp", icon: Facebook },
                  { href: "https://instagram.com/chub_app", icon: Instagram },
                  { href: "https://youtube.com/@CHubApp", icon: Youtube },
                  { href: "https://x.com/chub_app", icon: Twitter },
                  { href: "https://wa.me/2340000000000", icon: MessageCircle },
                ].map(({ href, icon: Icon }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl glass-dark flex items-center justify-center text-white/40 hover:bg-primary/30 hover:text-white transition-all duration-300">
                    <Icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-6 text-sm sm:text-base font-[--font-display] tracking-tight">{t("quickLinks")}</h4>
              <ul className="space-y-2 sm:space-y-3.5">
                {[
                  { href: "/events", label: t("upcomingEvents") },
                  { href: "/sermons", label: t("sermonArchive") },
                  { href: "/devotionals", label: t("dailyDevotionals") },
                  { href: "/prayer", label: t("prayerRequests") },
                  { href: "/give", label: t("waysToGive") },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-white/40 hover:text-accent text-xs sm:text-sm flex items-center gap-1.5 group transition-colors duration-200">
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-accent" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-6 text-sm sm:text-base font-[--font-display] tracking-tight">{t("serviceTimes")}</h4>
              <ul className="space-y-3 sm:space-y-5">
                {[
                  { color: "bg-primary", name: t("sundayService"), time: "8:30 AM - 12:00 PM" },
                  { color: "bg-accent", name: t("tuesdayBibleStudy"), time: "6:00 PM - 8:00 PM" },
                  { color: "bg-secondary", name: t("thursdayPrayers"), time: "6:00 PM - 8:00 PM" },
                ].map(({ color, name, time }) => (
                  <li key={name} className="flex items-start gap-2 sm:gap-3">
                    <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${color} mt-1 sm:mt-1.5 shrink-0`} />
                    <div>
                      <p className="font-semibold text-white text-xs sm:text-sm">{name}</p>
                      <p className="text-white/30 text-[10px] sm:text-xs">{time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-bold text-white mb-3 sm:mb-6 text-sm sm:text-base font-[--font-display] tracking-tight">{t("contact")}</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 shrink-0" />
                  <p className="text-white/40 text-xs sm:text-sm leading-relaxed">Lagos, Nigeria</p>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                  <a href="tel:+2340000000000" className="text-white/40 hover:text-accent text-xs sm:text-sm transition-colors">+234 000 000 0000</a>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                  <a href="mailto:hello@chub.app" className="text-white/40 hover:text-accent text-xs sm:text-sm transition-colors">hello@chub.app</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-white/20 text-xs sm:text-sm">&copy; {new Date().getFullYear()} CHub. {t("allRightsReserved")}</p>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/privacy" className="text-white/20 hover:text-accent text-xs sm:text-sm transition-colors">{t("privacyPolicy")}</Link>
              <span className="text-white/10">|</span>
              <a href="#" className="text-white/20 hover:text-accent text-xs sm:text-sm transition-colors">{t("termsOfService")}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
