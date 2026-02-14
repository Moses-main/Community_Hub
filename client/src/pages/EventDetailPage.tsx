import { useRoute } from "wouter";
import { useEvent } from "@/hooks/use-events";
import { useAuth } from "@/hooks/use-auth";
import { useRsvpEvent } from "@/hooks/use-events";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, ArrowLeft, Share2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function EventDetailPage() {
  const [, params] = useRoute<{ id: string }>("/events/:id");
  const eventId = params?.id ? parseInt(params.id) : null;
  const { data: event, isLoading, error } = useEvent(eventId!);
  const { user } = useAuth();
  const { mutate: rsvp, isPending } = useRsvpEvent();
  const { toast } = useToast();

  const handleRsvp = () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    rsvp(eventId!, {
      onSuccess: () => {
        toast({
          title: "RSVP Confirmed!",
          description: "We look forward to seeing you there.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Could not RSVP. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-3 md:px-4 py-6 md:py-8">
          <Skeleton className="h-6 md:h-8 w-24 md:w-32 mb-6 md:mb-8" />
          <Skeleton className="h-10 md:h-16 w-2/3 mb-2 md:mb-4" />
          <Skeleton className="h-4 md:h-6 w-1/3 mb-6 md:mb-8" />
          <Skeleton className="h-48 md:h-64 w-full rounded-xl" />
          <Skeleton className="h-24 md:h-32 w-full mt-4 md:mt-6 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-3 md:px-4 py-12 md:py-20 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Event not found</h1>
          <Button asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-3 md:px-4 py-5 md:py-8">
        {/* Back Button */}
        <Link href="/events" className="inline-flex items-center gap-1.5 md:gap-2 text-sm md:text-base text-gray-500 hover:text-gray-900 mb-5 md:mb-8">
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Back to Events
        </Link>

        {/* Header */}
        <div className="mb-5 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-3 md:gap-6 text-xs md:text-base text-gray-500">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Calendar className="w-3.5 h-3.5 md:w-5 md:h-5" />
              <span>{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Clock className="w-3.5 h-3.5 md:w-5 md:h-5" />
              <span>{format(eventDate, "h:mm a")}</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Image */}
        {event.imageUrl && (
          <div className="aspect-video rounded-xl overflow-hidden mb-5 md:mb-8 bg-gray-50">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-100">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">About this event</h2>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{event.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="border border-gray-100 sticky top-20 md:top-24">
              <CardContent className="p-4 md:p-6">
                <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Event Details</h3>
                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm md:text-base">{format(eventDate, "MMMM d, yyyy")}</p>
                      <p className="text-xs md:text-sm">{format(eventDate, "EEEE")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm md:text-base">{format(eventDate, "h:mm a")}</p>
                      <p className="text-xs md:text-sm">West Africa Time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm md:text-base">Location</p>
                      <p className="text-xs md:text-sm">{event.location}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleRsvp} 
                  disabled={isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-sm md:text-base py-2.5 md:py-3"
                  size="lg"
                >
                  {isPending ? "Confirming..." : "RSVP Now"}
                </Button>
                
                <div className="flex gap-2 md:gap-3 mt-3">
                  <Button variant="outline" className="flex-1 text-xs md:text-sm py-2" size="sm">
                    <Share2 className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs md:text-sm py-2" size="sm">
                    <CalendarPlus className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
