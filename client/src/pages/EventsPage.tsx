import { useState } from "react";
import { useEvents, useEventCategories } from "@/hooks/use-events";
import { EventCard } from "@/components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: events, isLoading } = useEvents();
  const { data: categories } = useEventCategories();
  const { t } = useLanguage();

  const now = new Date();

  const filteredEvents = events?.filter(event => {
    if (!selectedCategory) return true;
    return event.category === selectedCategory;
  }).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const isPastA = dateA < now;
    const isPastB = dateB < now;
    if (isPastA && !isPastB) return 1;
    if (!isPastA && isPastB) return -1;
    return dateA.getTime() - dateB.getTime();
  }) || [];

  return (
    <div className="min-h-screen bg-background pb-10 sm:pb-16 md:pb-24">
      {/* Hero */}
      <div className="relative py-10 sm:py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="orb orb-blue w-48 sm:w-72 h-48 sm:h-72 top-0 right-0 animate-float" />
        <div className="orb orb-purple w-32 sm:w-48 h-32 sm:h-48 bottom-0 left-10" style={{ animationDelay: '2s' }} />
        <div className="container px-4 sm:px-6 md:px-8 relative z-10">
          <span className="text-accent font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 block">{t("whatsHappening")}</span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white font-[--font-display] tracking-tight mb-2 sm:mb-4">{t("eventsCalendar")}</h1>
          <p className="text-sm sm:text-lg md:text-xl text-white/40 max-w-2xl">
            {t("eventsDescription")}
          </p>
        </div>
      </div>

      <div className="container px-4 sm:px-6 md:px-10 py-6 sm:py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 md:gap-14">
          {/* Main List */}
          <div className="flex-1 space-y-4 sm:space-y-6 md:space-y-8">
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-full font-bold ${selectedCategory === null ? 'gradient-accent text-primary-foreground shadow-lg shadow-primary/20' : 'border-border/50'}`}
                >
                  {t("all")}
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`rounded-full font-bold ${selectedCategory !== cat.name ? 'border-border/50' : ''}`}
                    style={selectedCategory === cat.name ? { backgroundColor: cat.color } : {}}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            )}

            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 font-[--font-display] tracking-tight">
              {selectedCategory ? `${selectedCategory} ${t("events")}` : t("upcomingEvents")}
              <span className="text-muted-foreground font-normal text-xs sm:text-base ml-2 sm:ml-3">({filteredEvents.length})</span>
            </h2>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40 sm:h-56 md:h-72 w-full rounded-2xl sm:rounded-3xl" />
              ))
            ) : filteredEvents.length > 0 ? (
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 sm:py-16 text-muted-foreground glass-card rounded-2xl sm:rounded-3xl">
                <p className="text-sm sm:text-lg">{t("noEventsFound")}{selectedCategory ? ` in ${selectedCategory}` : ''}.</p>
                <p className="text-xs sm:text-base mt-2">{t("checkBackSoon")}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[320px] space-y-4 sm:space-y-8 hidden sm:block">
            <div className="glass-card-strong rounded-3xl overflow-hidden">
              <div className="p-5 pb-3">
                <h3 className="text-xl font-bold font-[--font-display]">{t("calendarView")}</h3>
              </div>
              <div className="px-4 pb-5">
                <Calendar mode="single" selected={new Date()} className="rounded-2xl border border-border/30" />
              </div>
            </div>

            {categories && categories.length > 0 && (
              <div className="glass-card-strong rounded-3xl overflow-hidden">
                <div className="p-5 pb-3">
                  <h3 className="text-xl font-bold font-[--font-display]">{t("categories")}</h3>
                </div>
                <div className="px-4 pb-5 space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      selectedCategory === null ? 'gradient-accent text-primary-foreground shadow-lg' : 'hover:bg-muted/50'
                    }`}
                  >
                    {t("allEvents")} ({events?.length || 0})
                  </button>
                  {categories.map((cat) => {
                    const count = events?.filter(e => e.category === cat.name).length || 0;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between ${
                          selectedCategory === cat.name ? 'text-primary-foreground shadow-lg' : 'hover:bg-muted/50'
                        }`}
                        style={selectedCategory === cat.name ? { backgroundColor: cat.color } : {}}
                      >
                        <span>{cat.name}</span>
                        <span className={`text-xs ${selectedCategory === cat.name ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="glass-card rounded-3xl p-6 shimmer-border">
              <h3 className="font-bold text-lg mb-2 font-[--font-display]">{t("hostSmallGroup")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("hostSmallGroupDesc")}
              </p>
              <button className="text-sm font-bold text-primary hover:underline">{t("learnMore")} &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
