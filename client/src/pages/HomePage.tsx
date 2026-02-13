import { Link } from "wouter";
import { ArrowRight, Play, Calendar, Heart, Clock, MapPin, Sparkles, Users, BookOpen } from "lucide-react";
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

  const upcomingEvents = events
    ?.filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 hero-gradient hero-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container relative z-10 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Welcome to WCCRM Lagos
            </div>
            
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
              Experience the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-200">
                Power of Faith
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Join a vibrant community dedicated to loving God, loving people, and making a difference in our city and beyond.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-10 py-6 rounded-full bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/events">
                  Plan a Visit <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm shadow-xl"
              >
                <Link href="/sermons">
                  <Play className="mr-2 w-5 h-5" /> Watch Online
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-16 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">5000+</div>
              <div className="text-sm text-white/70">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">15+</div>
              <div className="text-sm text-white/70">Years Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-white/70">Ministries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section-py bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Upcoming Events
              </h2>
              <p className="text-gray-500 text-lg">
                Join us for fellowship and growth
              </p>
            </div>
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/events">
                View All Events <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No upcoming events at this time.</p>
              <Button variant="ghost" asChild className="mt-4">
                <Link href="/events"><span>View Past Events</span></Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Latest Sermons Section */}
      <section className="section-py bg-white">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Latest Sermons
              </h2>
              <p className="text-gray-500 text-lg">
                Experience God's word through our preaching
              </p>
            </div>
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/sermons">
                View All Sermons <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          {loadingSermons ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : sermons && sermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.slice(0, 3).map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Play className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No sermons available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action - Prayer & Giving */}
      <section className="section-py bg-gradient-to-br from-primary via-purple-700 to-primary relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-30" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
        
        <div className="container px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Prayer Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <FaPray className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">
                Need Prayer?
              </h3>
              <p className="text-white/80 mb-6">
                We believe in the power of prayer. Share your request and let our community stand with you.
              </p>
              <Button asChild variant="secondary" className="rounded-full px-8">
                <Link href="/prayer">Share Request</Link>
              </Button>
            </div>

            {/* Giving Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <FaHandHoldingHeart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">
                Give Online
              </h3>
              <p className="text-white/80 mb-6">
                Support the mission and ministry of WCCRM Lagos through generous giving.
              </p>
              <Button asChild className="rounded-full px-8 bg-amber-500 hover:bg-amber-400 text-white">
                <Link href="/give">Give Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Ministries Preview */}
      <section className="section-py bg-gray-50">
        <div className="container px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Our Ministries
            </h2>
            <p className="text-gray-500 text-lg">
              We have various ministries designed to help you grow in your faith and serve others
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MinistryCard 
              icon={<Users className="w-8 h-8" />}
              title="Community Groups"
              description="Connect with others in small groups for fellowship and growth"
            />
            <MinistryCard 
              icon={<BookOpen className="w-8 h-8" />}
              title="Bible Study"
              description="Dive deeper into God's word with our weekly Bible study sessions"
            />
            <MinistryCard 
              icon={<Heart className="w-8 h-8" />}
              title="Prayer Ministry"
              description="Join our prayer team and experience the power of prayer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const eventDate = new Date(event.date);
  
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white">
        <div className="aspect-[4/3] relative bg-gray-100">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-50">
              <Calendar className="h-12 w-12 text-primary/30" />
            </div>
          )}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-center shadow-lg">
            <div className="text-xs font-bold uppercase text-primary">{format(eventDate, "MMM")}</div>
            <div className="text-2xl font-display font-bold leading-none">{format(eventDate, "dd")}</div>
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="font-display font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-primary" />
              <span>{format(eventDate, "EEEE, h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function SermonCard({ sermon }: { sermon: any }) {
  const sermonDate = new Date(sermon.date);
  
  return (
    <Link href={`/sermons/${sermon.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white">
        <div className="aspect-video relative bg-gray-100 group">
          {sermon.thumbnailUrl ? (
            <img 
              src={sermon.thumbnailUrl} 
              alt={sermon.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-50">
              <Play className="h-12 w-12 text-primary/30" />
            </div>
          )}
          {sermon.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
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
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">{sermon.speaker}</span>
            <span>•</span>
            <span>{format(sermonDate, "MMM d, yyyy")}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function MinistryCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-50 flex items-center justify-center mx-auto mb-5 text-primary">
          {icon}
        </div>
        <h3 className="font-display font-bold text-xl mb-3">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
}
