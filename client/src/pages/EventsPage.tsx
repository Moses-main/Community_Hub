import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EventsPage() {
  const { data: events, isLoading } = useEvents();

  const now = new Date();
  
  const sortedEvents = events?.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const isPastA = dateA < now;
    const isPastB = dateB < now;
    
    if (isPastA && !isPastB) return 1;
    if (!isPastA && isPastB) return -1;
    return dateA.getTime() - dateB.getTime();
  }) || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-secondary/30 py-16 border-b border-border">
        <div className="container px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Events Calendar</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Get involved and connect with others at one of our upcoming gatherings.
          </p>
        </div>
      </div>

      <div className="container px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main List */}
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-display font-bold mb-6">Upcoming Events</h2>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))
            ) : (
              sortedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[350px] space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
              <h3 className="font-bold text-lg mb-2">Host a Small Group?</h3>
              <p className="text-sm text-muted-foreground mb-4">
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
