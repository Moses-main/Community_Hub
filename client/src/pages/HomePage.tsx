import { Link } from "wouter";
import { ArrowRight, Play, Calendar, Heart } from "lucide-react";
import { useSermons } from "@/hooks/use-sermons";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { SermonCard } from "@/components/SermonCard";
import { EventCard } from "@/components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { FaPray } from "react-icons/fa";
import { FaHandHoldingHeart } from "react-icons/fa";


export default function HomePage() {
  const { data: sermons, isLoading: loadingSermons } = useSermons();
  const { data: events, isLoading: loadingEvents } = useEvents();

  // Get latest sermon and upcoming 2 events
  const latestSermons = sermons?.slice(0, 3) || [];
  const upcomingEvents = events?.slice(0, 2) || [];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Unsplash: Modern church worship atmosphere */}
          <img
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&auto=format&fit=crop&q=80"
            alt="Worship Background"
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-black/30" /> */}
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
              className="text-lg px-8 py-6 rounded-full shadow-xl hover:scale-105 transition-transform"
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

      {/* Latest Sermons */}
      <section className="container px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">
              Latest Messages
            </h2>
            <p className="text-muted-foreground">
              Watch or listen to recent sermons
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex gap-2">
            <Link href="/sermons">
              View Archive <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingSermons
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-video rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
            : latestSermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
        </div>

        <Button variant="outline" asChild className="w-full mt-8 md:hidden">
          <Link href="/sermons">View All Sermons</Link>
        </Button>
      </section>

      {/* Upcoming Events */}
      <section className="bg-secondary/30 py-20">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Join us for fellowship and growth
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex gap-2">
              <Link href="/events">
                Full Calendar <Calendar size={16} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loadingEvents
              ? Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="w-1/3 h-48 rounded-xl" />
                      <div className="flex-1 space-y-4 py-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))
              : upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
          </div>

          <Button variant="outline" asChild className="w-full mt-8 md:hidden">
            <Link href="/events">View Full Calendar</Link>
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
