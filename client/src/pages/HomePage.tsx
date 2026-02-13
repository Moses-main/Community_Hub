import { Link } from "wouter";
import { ArrowRight, Play, Calendar, Heart, Clock, MapPin } from "lucide-react";
import { useSermons } from "@/hooks/use-sermons";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaPray } from "react-icons/fa";
import { FaHandHoldingHeart } from "react-icons/fa";
import { format } from "date-fns";

export default function HomePage() {
  const { data: sermons, isLoading: loadingSermons } = useSermons();
  const { data: events, isLoading: loadingEvents } = useEvents();

  // Sort events by date (upcoming first)
  const upcomingEvents = events
    ?.filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  // Group sermons by series
  const sermonsBySeries = sermons?.reduce((acc, sermon) => {
    const series = sermon.series || "Uncategorized";
    if (!acc[series]) acc[series] = [];
    acc[series].push(sermon);
    return acc;
  }, {} as Record<string, typeof sermons>) || {};

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&auto=format&fit=crop&q=80"
            alt="Worship Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter text-white mb-6 drop-shadow-sm">
            Welcome
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            A place to belong, believe, and become who God created you to be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-10 py-6 rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              Plan a Visit
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm shadow-xl"
              asChild
            >
              <Link href="/sermons">Watch Online</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="container px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground">
              Join us for fellowship and growth
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex gap-2 border-gray/60 hover:bg-black/10">
            <Link href="/events">
              View All <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        {loadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 6).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          ) : (
          <div className="text-center py-12 bg-secondary/30 rounded-xl">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No upcoming events at this time.</p>
            <Button variant="ghost" asChild className="mt-2">
              <Link href="/events"><span>View Past Events</span></Link>
            </Button>
          </div>
        )}

        <Button variant="outline" asChild className="w-full mt-8 md:hidden">
          <Link href="/events">View All Events</Link>
        </Button>
      </section>

      {/* Sermon Series Section */}
      <section className="bg-secondary/30 py-20">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">
                Sermon Series
              </h2>
              <p className="text-muted-foreground">
                Explore our message series
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex gap-2 border-gray/60 hover:bg-black/10">
              <Link href="/sermons">
                View All <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          {loadingSermons ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : sermons && sermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.slice(0, 6).map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-background rounded-xl">
              <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No sermons available yet.</p>
            </div>
          )}

          <Button variant="outline" asChild className="w-full mt-8 md:hidden">
            <Link href="/sermons">View All Sermons</Link>
          </Button>
        </div>
      </section>

      {/* Prayer & Giving CTA */}
      <section className="container px-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-primary/5 rounded-3xl p-10 flex flex-col items-center text-center border border-primary/10">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
              <FaPray size={32}/>
            </div>
            <h3 className="text-2xl font-display font-bold mb-3">
              Need Prayer?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              We believe in the power of prayer. Share your request and let our
              community stand with you.
            </p>
            <Button asChild className="px-8">
              <Link href="/prayer">Share Request</Link>
            </Button>
          </div>

          <div className="bg-accent/5 rounded-3xl p-10 flex flex-col items-center text-center border border-accent/10">
            <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
              <FaHandHoldingHeart size={32}/>
            </div>
            <h3 className="text-2xl font-display font-bold mb-3">
              Give Online
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Support the mission and ministry of WCCRM Lagos through generous
              giving.
            </p>
            <Button asChild variant="secondary" className="px-8">
              <Link href="/give">Give Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const eventDate = new Date(event.date);
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative bg-muted">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <Calendar className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-center shadow-sm">
          <div className="text-xs font-bold uppercase text-primary">{format(eventDate, "MMM")}</div>
          <div className="text-xl font-display font-bold leading-none">{format(eventDate, "dd")}</div>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-display font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary flex-shrink-0" />
            <span>{format(eventDate, "EEEE, h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-primary flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/events/${event.id}`}>Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function SermonCard({ sermon }: { sermon: any }) {
  const sermonDate = new Date(sermon.date);
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-video relative bg-muted">
        {sermon.thumbnailUrl ? (
          <img 
            src={sermon.thumbnailUrl} 
            alt={sermon.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <Play className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        {sermon.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-primary ml-1" />
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        {sermon.series && (
          <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
            {sermon.series}
          </p>
        )}
        <h3 className="font-display font-bold text-lg mb-2 line-clamp-2">{sermon.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{sermon.speaker}</p>
        <p className="text-xs text-muted-foreground">
          {format(sermonDate, "MMMM d, yyyy")}
        </p>
        <Button variant="secondary" className="w-full mt-4" asChild>
          <Link href={`/sermons/${sermon.id}`}>Watch</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
