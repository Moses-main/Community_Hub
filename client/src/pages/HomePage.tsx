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
      {/* Hero Section - Clean white like Copperx */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />

        <div className="container relative z-10 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Welcome to WCCRM Lagos
            </div>
            
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-6 leading-tight">
              Experience the
              <span className="block text-purple-600">
                Power of Faith
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Join a vibrant community dedicated to loving God, loving people, and making a difference in our city and beyond.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-10 py-6 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              >
                <Link href="/events">
                  Plan a Visit <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Link href="/sermons">
                  <Play className="mr-2 w-5 h-5" /> Watch Online
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-16 border-t border-gray-100">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">5000+</div>
              <div className="text-sm text-gray-500">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">15+</div>
              <div className="text-sm text-gray-500">Years Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">50+</div>
              <div className="text-sm text-gray-500">Ministries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section-py bg-white">
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
            <div className="text-center py-16 border border-gray-100 rounded-2xl">
              <Calendar className="h-16 w-16 mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 text-lg">No upcoming events at this time.</p>
              <Button variant="ghost" asChild className="mt-4">
                <Link href="/events"><span>View Past Events</span></Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Latest Sermons Section */}
      <section className="section-py bg-gray-50/50">
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
      <section className="section-py bg-white">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Prayer Card */}
            <div className="border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center mb-5">
                <FaPray className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-3">
                Need Prayer?
              </h3>
              <p className="text-gray-500 mb-6">
                We believe in the power of prayer. Share your request and let our community stand with you.
              </p>
              <Button asChild variant="outline" className="rounded-lg px-6">
                <Link href="/prayer">Share Request</Link>
              </Button>
            </div>

            {/* Giving Card */}
            <div className="border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center mb-5">
                <FaHandHoldingHeart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-3">
                Give Online
              </h3>
              <p className="text-gray-500 mb-6">
                Support the mission and ministry of WCCRM Lagos through generous giving.
              </p>
              <Button asChild className="rounded-lg px-6 bg-purple-600 hover:bg-purple-700">
                <Link href="/give">Give Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Ministries Preview */}
      <section className="section-py bg-gray-50/50">
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
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100 bg-white">
        <div className="aspect-[4/3] relative bg-gray-50">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="h-12 w-12 text-gray-200" />
            </div>
          )}
          <div className="absolute top-3 left-3 bg-white px-3 py-2 rounded-lg text-center shadow-sm border border-gray-100">
            <div className="text-xs font-semibold uppercase text-gray-500">{format(eventDate, "MMM")}</div>
            <div className="text-xl font-bold text-gray-900 leading-none">{format(eventDate, "dd")}</div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
          <div className="space-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{format(eventDate, "EEEE, h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
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
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100 bg-white">
        <div className="aspect-video relative bg-gray-50 group">
          {sermon.thumbnailUrl ? (
            <img 
              src={sermon.thumbnailUrl} 
              alt={sermon.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="h-10 w-10 text-gray-200" />
            </div>
          )}
          {sermon.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
                <Play className="h-4 w-4 text-gray-900 ml-0.5" />
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          {sermon.series && (
            <p className="text-xs font-medium text-purple-600 mb-1.5">
              {sermon.series}
            </p>
          )}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{sermon.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{sermon.speaker}</span>
            <span>·</span>
            <span>{format(sermonDate, "MMM d")}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function MinistryCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-white border border-gray-100 hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-4 text-purple-600">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
