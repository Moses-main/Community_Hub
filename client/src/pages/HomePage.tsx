import { Link } from "wouter";
import { ArrowRight, Play, Calendar, Clock, MapPin, Users, BookOpen, Heart, ChevronRight } from "lucide-react";
import { useSermons } from "@/hooks/use-sermons";
import { useEvents } from "@/hooks/use-events";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { LocationMap } from "@/components/LocationMap";

export default function HomePage() {
  const { data: sermons, isLoading: loadingSermons } = useSermons();
  const { data: events, isLoading: loadingEvents } = useEvents();
  const { user } = useAuth();
  const { t } = useLanguage();

  const upcomingEvents = events
    ?.filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section - Clean SaaS Style */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&auto=format&fit=crop&q=80" 
            alt="Worship Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/40 to-gray-900/20" />
        </div>
        
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium mb-6 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Welcome to CHub
            </div>
            
            <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-[1.15]">
              Experience the
              <span className="block text-indigo-200 mt-1">Power of Faith</span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
              Join a vibrant community dedicated to loving God, loving people, and making a difference in our city and beyond.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="rounded-xl px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                <Link href="/events">
                  Plan a Visit <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-xl px-6 py-3 border-white/20 text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm font-medium transition-colors"
              >
                <Link href="/sermons">
                  <Play className="mr-2 w-4 h-4" /> Watch Online
                </Link>
              </Button>
              {user && (
                <Button
                  asChild
                  className="rounded-xl px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                >
                  <Link href="/attendance/checkin">
                    Check In
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16 pt-12 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-semibold text-white mb-1">5000+</div>
              <div className="text-xs text-white/60">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-semibold text-white mb-1">15+</div>
              <div className="text-xs text-white/60">Years Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-semibold text-white mb-1">50+</div>
              <div className="text-xs text-white/60">Ministries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                Upcoming Events
              </h2>
              <p className="text-gray-500 text-sm md:text-base">
                Join us for fellowship and growth
              </p>
            </div>
            <Button variant="ghost" asChild className="gap-2 self-start md:self-auto text-gray-600 hover:text-gray-900">
              <Link href="/events">
                View all <ChevronRight size={16} />
              </Link>
            </Button>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-gray-100 rounded-2xl bg-gray-50/50">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No upcoming events</p>
              <Button variant="ghost" asChild>
                <Link href="/events">View Past Events</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Latest Sermons Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                Latest Sermons
              </h2>
              <p className="text-gray-500 text-sm md:text-base">
                Experience God's word through our preaching
              </p>
            </div>
            <Button variant="ghost" asChild className="gap-2 self-start md:self-auto text-gray-600 hover:text-gray-900">
              <Link href="/sermons">
                View all sermons <ChevronRight size={16} />
              </Link>
            </Button>
          </div>

          {loadingSermons ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : sermons && sermons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.slice(0, 3).map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
              <Play className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No sermons available</p>
            </div>
          )}
        </div>
      </section>

      {/* Ministries Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
              Our Ministries
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              We have various ministries designed to help you grow in your faith and serve others
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MinistryCard 
              icon={<Users className="w-6 h-6" />}
              title="Community Groups"
              description="Connect with others in small groups for fellowship and growth"
              href="/groups"
            />
            <MinistryCard 
              icon={<BookOpen className="w-6 h-6" />}
              title="Bible Study"
              description="Dive deeper into God's word with our weekly Bible study sessions"
              href="/bible"
            />
            <MinistryCard 
              icon={<Heart className="w-6 h-6" />}
              title="Prayer Ministry"
              description="Join our prayer team and experience the power of prayer"
              href="/prayer"
            />
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <Card className="overflow-hidden shadow-soft-md rounded-2xl">
            <div className="grid md:grid-cols-2">
              <div className="relative min-h-[300px] md:min-h-full">
                <img 
                  src="/church_building.avif" 
                  alt="CHub Church Building" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                  Visit Us This Sunday
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  We welcome you to join us for worship, fellowship, and community. 
                  Experience the warmth of God's love at CHub.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    className="rounded-xl px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                  >
                    <Link href="/events">
                      Service Times <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl px-6 py-3 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <Link href="/contact">
                      Get Directions
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Location Map Section */}
      <LocationMap />
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const eventDate = new Date(event.date);
  
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden shadow-soft hover:shadow-soft-md transition-all duration-200 border-0 bg-white rounded-2xl h-full group cursor-pointer">
        <div className="aspect-[4/3] relative bg-gray-100">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="h-10 w-10 text-gray-300" />
            </div>
          )}
          <div className="absolute top-3 left-3 bg-white px-3 py-2 rounded-xl text-center shadow-soft">
            <div className="text-[10px] font-semibold uppercase text-gray-500 tracking-wide">{format(eventDate, "MMM")}</div>
            <div className="text-xl font-semibold text-gray-900 leading-none">{format(eventDate, "dd")}</div>
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-1 text-base">{event.title}</h3>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{format(eventDate, "EEEE, h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
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
      <Card className="overflow-hidden shadow-soft hover:shadow-soft-md transition-all duration-200 border-0 bg-white rounded-2xl h-full group cursor-pointer">
        <div className="aspect-video relative bg-gray-100">
          {sermon.thumbnailUrl ? (
            <img 
              src={sermon.thumbnailUrl} 
              alt={sermon.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="h-8 w-8 text-gray-300" />
            </div>
          )}
          {sermon.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/20">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                <Play className="h-4 w-4 text-gray-900 ml-0.5" />
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-5">
          {sermon.series && (
            <p className="text-xs font-medium text-indigo-600 mb-2">
              {sermon.series}
            </p>
          )}
          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base">{sermon.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{sermon.speaker}</span>
            <span className="text-gray-300">·</span>
            <span>{format(sermonDate, "MMM d")}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function MinistryCard({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <Link href={href}>
      <Card className="bg-white border-0 shadow-soft hover:shadow-soft-md transition-all duration-200 rounded-2xl h-full group cursor-pointer">
        <CardContent className="p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            {icon}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
