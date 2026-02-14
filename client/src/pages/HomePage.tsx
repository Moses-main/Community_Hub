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
      {/* Hero Section - Clean white like Copperx with church background */}
      <section className="relative min-h-[85vh] h-screen flex items-center justify-center overflow-hidden">
        {/* Church background image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&auto=format&fit=crop&q=80" 
            alt="Worship Background" 
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        {/* Content */}
        <div className="container relative z-10 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs md:text-sm font-medium mb-4 md:mb-6 border border-white/20">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              Welcome to WCCRM Lagos
            </div>
            
            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white mb-4 md:mb-6 leading-tight">
              Experience the
              <span className="block text-white">
                Power of Faith
              </span>
            </h1>
            
            <p className="text-base md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto mb-6 md:mb-10 font-light leading-relaxed">
              Join a vibrant community dedicated to loving God, loving people, and making a difference in our city and beyond.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-base md:text-lg px-6 md:px-10 py-3 md:py-6 rounded-lg bg-red-900/60 backdrop-blur-md border border-red-700/30 text-red-100 hover:bg-red-800/70 transition-colors"
              >
                <Link href="/events">
                  Plan a Visit <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
              >
                <Link href="/sermons">
                  <Play className="mr-2 w-4 h-4 md:w-5 md:h-5" /> Watch Online
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mt-12 md:mt-16 pt-12 md:pt-16 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">5000+</div>
              <div className="text-xs md:text-sm text-white/70">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">15+</div>
              <div className="text-xs md:text-sm text-white/70">Years Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">50+</div>
              <div className="text-xs md:text-sm text-white/70">Ministries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container px-3 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-2 md:mb-3">
                Upcoming Events
              </h2>
              <p className="text-gray-500 text-base md:text-lg">
                Join us for fellowship and growth
              </p>
            </div>
            <Button variant="ghost" asChild className="gap-2 self-start md:self-auto">
              <Link href="/events">
                View All Events <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-3 md:space-y-4">
                  <Skeleton className="h-40 md:h-48 rounded-xl md:rounded-2xl" />
                  <Skeleton className="h-5 md:h-6 w-3/4" />
                  <Skeleton className="h-3 md:h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {upcomingEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 md:py-16 border border-gray-100 rounded-xl md:rounded-2xl">
              <Calendar className="h-10 w-10 md:h-16 md:w-16 mx-auto text-gray-200 mb-3 md:mb-4" />
              <p className="text-gray-500 text-base md:text-lg">No upcoming events at this time.</p>
              <Button variant="ghost" asChild className="mt-3 md:mt-4">
                <Link href="/events"><span>View Past Events</span></Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Latest Sermons Section */}
      <section className="py-8 md:py-16 bg-gray-50/50">
        <div className="container px-3 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-2 md:mb-3">
                Latest Sermons
              </h2>
              <p className="text-gray-500 text-base md:text-lg">
                Experience God's word through our preaching
              </p>
            </div>
            <Button variant="ghost" asChild className="gap-2 self-start md:self-auto">
              <Link href="/sermons">
                View All Sermons <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          {loadingSermons ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-3 md:space-y-4">
                  <Skeleton className="aspect-video rounded-xl md:rounded-2xl" />
                  <Skeleton className="h-5 md:h-6 w-3/4" />
                  <Skeleton className="h-3 md:h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : sermons && sermons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sermons.slice(0, 3).map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 md:py-16 bg-gray-50 rounded-xl md:rounded-2xl">
              <Play className="h-10 w-10 md:h-16 md:w-16 mx-auto text-gray-300 mb-3 md:mb-4" />
              <p className="text-gray-500 text-base md:text-lg">No sermons available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action - Prayer & Giving */}
      {/* <section className="section-py bg-white">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
      </section> */}

      {/* Features / Ministries Preview */}
      <section className="py-8 md:py-16 bg-gray-50/50">
        <div className="container px-3 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-3 md:mb-4">
              Our Ministries
            </h2>
            <p className="text-gray-500 text-base md:text-lg">
              We have various ministries designed to help you grow in your faith and serve others
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <MinistryCard 
              icon={<Users className="w-6 h-6 md:w-8 md:h-8" />}
              title="Community Groups"
              description="Connect with others in small groups for fellowship and growth"
            />
            <MinistryCard 
              icon={<BookOpen className="w-6 h-6 md:w-8 md:h-8" />}
              title="Bible Study"
              description="Dive deeper into God's word with our weekly Bible study sessions"
            />
            <MinistryCard 
              icon={<Heart className="w-6 h-6 md:w-8 md:h-8" />}
              title="Prayer Ministry"
              description="Join our prayer team and experience the power of prayer"
            />
          </div>
        </div>
      </section>

      {/* Church Building Section */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/church_building.avif" 
            alt="WCCRM Lagos Church Building" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="container relative z-10 px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display font-bold text-2xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6">
              Visit Us This Sunday
            </h2>
            <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed">
              We welcome you to join us for worship, fellowship, and community. 
              Experience the warmth of God's love at WCCRM Lagos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-6 rounded-lg bg-white text-gray-900 hover:bg-gray-100"
              >
                <Link href="/events">
                  Service Times <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-6 rounded-lg border-white text-white bg-transparent hover:bg-white/10"
              >
                <Link href="/contact">
                  Get Directions
                </Link>
              </Button>
            </div>
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
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100 bg-white h-full">
        <div className="aspect-[4/3] relative bg-gray-50">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="h-10 w-10 md:h-12 md:w-12 text-gray-200" />
            </div>
          )}
          <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-center shadow-sm border border-gray-100">
            <div className="text-[10px] md:text-xs font-semibold uppercase text-gray-500">{format(eventDate, "MMM")}</div>
            <div className="text-lg md:text-xl font-bold text-gray-900 leading-none">{format(eventDate, "dd")}</div>
          </div>
        </div>
        <CardContent className="p-3 md:p-4">
          <h3 className="font-semibold text-gray-900 mb-1.5 md:mb-2 line-clamp-1 text-sm md:text-base">{event.title}</h3>
          <div className="space-y-1 text-xs md:text-sm text-gray-500">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span>{format(eventDate, "EEEE, h:mm a")}</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" />
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
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100 bg-white h-full">
        <div className="aspect-video relative bg-gray-50 group">
          {sermon.thumbnailUrl ? (
            <img 
              src={sermon.thumbnailUrl} 
              alt={sermon.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="h-8 w-8 md:h-10 md:w-10 text-gray-200" />
            </div>
          )}
          {sermon.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow">
                <Play className="h-3 w-3 md:h-4 md:w-4 text-gray-900 ml-0.5" />
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-3 md:p-4">
          {sermon.series && (
            <p className="text-[10px] md:text-xs font-medium text-purple-600 mb-1 md:mb-1.5">
              {sermon.series}
            </p>
          )}
          <h3 className="font-semibold text-gray-900 mb-1.5 md:mb-2 line-clamp-2 text-sm md:text-base">{sermon.title}</h3>
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500">
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
    <Card className="bg-white border border-gray-100 hover:shadow-lg transition-all duration-200 h-full">
      <CardContent className="p-4 md:p-6 text-center">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3 md:mb-4 text-purple-600">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 mb-1.5 md:mb-2 text-sm md:text-base">{title}</h3>
        <p className="text-gray-500 text-xs md:text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
