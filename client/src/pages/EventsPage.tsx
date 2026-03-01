import { useState } from "react";
import { useEvents, useEventCategories } from "@/hooks/use-events";
import { EventCard } from "@/components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: events, isLoading } = useEvents();
  const { data: categories } = useEventCategories();

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
    <div className="min-h-screen bg-background pb-12 md:pb-20">
      <div className="bg-secondary/30 py-10 md:py-16 border-b border-border">
        <div className="container px-3 md:px-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-2 md:mb-4">Events Calendar</h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl">
            Get involved and connect with others at one of our upcoming gatherings.
          </p>
        </div>
      </div>

      <div className="container px-3 md:px-4 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
          {/* Main List */}
          <div className="flex-1 space-y-4 md:space-y-6">
            {/* Category Filter */}
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full"
                >
                  All
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.name)}
                    className="rounded-full"
                    style={selectedCategory === cat.name ? { backgroundColor: cat.color } : {}}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            )}
            
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4 md:mb-6">
              {selectedCategory ? `${selectedCategory} Events` : 'Upcoming Events'}
              <span className="text-muted-foreground font-normal text-lg ml-2">({filteredEvents.length})</span>
            </h2>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-48 md:h-64 w-full rounded-xl" />
              ))
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No events found{selectedCategory ? ` in ${selectedCategory}` : ''}.</p>
                <p className="text-sm mt-2">Check back soon for upcoming events!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[300px] md:lg:w-[350px] space-y-6 md:space-y-8">
            <Card>
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-lg md:text-xl">Calendar View</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Category List in Sidebar */}
            {categories && categories.length > 0 && (
              <Card>
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="text-lg md:text-xl">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === null ? 'bg-primary text-white' : 'hover:bg-secondary'
                    }`}
                  >
                    All Events ({events?.length || 0})
                  </button>
                  {categories.map((cat) => {
                    const count = events?.filter(e => e.category === cat.name).length || 0;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                          selectedCategory === cat.name ? 'text-white' : 'hover:bg-secondary'
                        }`}
                        style={selectedCategory === cat.name ? { backgroundColor: cat.color } : {}}
                      >
                        <span>{cat.name}</span>
                        <span className={`text-xs ${selectedCategory === cat.name ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            )}
            
            <div className="bg-primary/5 p-4 md:p-6 rounded-xl border border-primary/10">
              <h3 className="font-bold text-base md:text-lg mb-1.5 md:mb-2">Host a Small Group?</h3>
              <p className="text-sm text-muted-foreground mb-3 md:mb-4">
                We're always looking for new leaders to host community groups.
              </p>
              <button className="text-sm font-semibold text-primary hover:underline">
                Learn More &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
