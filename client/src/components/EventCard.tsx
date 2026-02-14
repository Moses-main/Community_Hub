import { Link } from "wouter";
import { format } from "date-fns";
import { MapPin, Clock, Calendar, Check, CalendarPlus, Share2 } from "lucide-react";
import type { Event } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRsvpEvent, useRemoveRsvp, useUserRsvps, useAddToCalendar } from "@/hooks/use-events";
import { useToast } from "@/hooks/use-toast";
import { apiRoutes } from "@/lib/api-routes";
import { buildApiUrl } from "@/lib/api-config";
import { useState } from "react";

interface EventCardProps {
  event: Event;
}

function generateCalendarLink(event: Event): string {
  const eventDate = new Date(event.date);
  const startDate = eventDate.toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, 15);
  const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, 15);
  
  const title = encodeURIComponent(event.title);
  const description = encodeURIComponent(event.description);
  const location = encodeURIComponent(event.location);
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}`;
}

export function EventCard({ event }: EventCardProps) {
  const { user } = useAuth();
  const { mutate: rsvp, isPending: isRsvpPending } = useRsvpEvent();
  const { mutate: addToCalendar, isPending: isAddingToCalendar } = useAddToCalendar();
  const { data: userRsvps } = useUserRsvps();
  const { toast } = useToast();
  const eventDate = new Date(event.date);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const userRsvp = userRsvps?.find((r: any) => r.eventId === event.id);
  const isRsvped = !!userRsvp;
  const isAddedToCalendar = userRsvp?.addedToCalendar;

  const handleRsvp = () => {
    if (!user) {
      window.location.href = buildApiUrl(apiRoutes.auth.login);
      return;
    }
    rsvp(event.id, {
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

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: event.description,
      url: `${window.location.origin}/events/${event.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/events/${event.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Event link has been copied to clipboard.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not copy link. Please try again.",
        variant: "destructive",
      });
    }
    setShowShareMenu(false);
  };

  const handleAddToCalendar = () => {
    const calendarUrl = generateCalendarLink(event);
    window.open(calendarUrl, "_blank");
    
    addToCalendar(event.id, {
      onSuccess: () => {
        toast({
          title: "Added to Calendar",
          description: "Event has been added to your calendar.",
        });
      },
      onError: () => {
        toast({
          title: "Note",
          description: "Please add the event to your calendar manually if it didn't open.",
        });
      },
    });
  };

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden border-border/50 hover:border-primary/20 transition-all duration-300">
      <div className="md:w-1/3 bg-muted relative min-h-[160px] md:min-h-full">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-3xl md:text-4xl font-display font-bold text-muted-foreground/20">
              {format(eventDate, "dd")}
            </span>
          </div>
        )}
        <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-white/90 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-md text-center shadow-sm">
          <div className="text-[10px] md:text-xs font-bold uppercase text-primary">{format(eventDate, "MMM")}</div>
          <div className="text-lg md:text-xl font-display font-bold leading-none">{format(eventDate, "dd")}</div>
        </div>
      </div>
      <CardContent className="flex-1 p-4 md:p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-lg md:text-xl mb-1.5 md:mb-2">{event.title}</h3>
          <p className="text-muted-foreground line-clamp-2 mb-3 md:mb-4 text-sm md:text-base">
            {event.description}
          </p>
          <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              <span>{format(eventDate, "h:mm a")}</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {isRsvped ? (
            <>
              <Button 
                variant="default"
                disabled
                className="flex-1 sm:flex-none text-sm md:text-base py-2 md:py-2.5 bg-green-600 cursor-not-allowed"
              >
                <Check className="w-4 h-4 mr-1" /> RSVPED
              </Button>
              <div className="relative">
                <Button 
                  variant="outline"
                  className="flex-1 sm:flex-none text-sm md:text-base py-2 md:py-2.5"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="w-4 h-4 mr-1" /> Share
                </Button>
                {showShareMenu && (
                  <div className="absolute bottom-full mb-2 left-0 bg-white border rounded-lg shadow-lg py-2 min-w-[160px] z-10">
                    <button
                      onClick={handleShare}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" /> Share via...
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
              {!isAddedToCalendar ? (
                <Button 
                  variant="outline"
                  disabled={isAddingToCalendar}
                  className="flex-1 sm:flex-none text-sm md:text-base py-2 md:py-2.5"
                  onClick={handleAddToCalendar}
                >
                  {isAddingToCalendar ? "Adding..." : <><CalendarPlus className="w-4 h-4 mr-1" /> Add to Calendar</>}
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  disabled
                  className="flex-1 sm:flex-none text-sm md:text-base py-2 md:py-2.5 bg-green-50"
                >
                  <Calendar className="w-4 h-4 mr-1" /> Added
                </Button>
              )}
            </>
          ) : (
            <>
              <Button 
                onClick={handleRsvp} 
                disabled={isRsvpPending}
                className="flex-1 md:flex-none text-sm md:text-base py-2 md:py-2.5"
              >
                {isRsvpPending ? "Confirming..." : "RSVP"}
              </Button>
              <div className="relative">
                <Button 
                  variant="outline"
                  className="flex-1 md:flex-none text-sm md:text-base py-2 md:py-2.5"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="w-4 h-4 mr-1" /> Share
                </Button>
                {showShareMenu && (
                  <div className="absolute bottom-full mb-2 left-0 bg-white border rounded-lg shadow-lg py-2 min-w-[160px] z-10">
                    <button
                      onClick={handleShare}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" /> Share via...
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          <Button variant="outline" asChild className="flex-1 md:flex-none text-sm md:text-base py-2 md:py-2.5">
            <Link href={`/events/${event.id}`}>Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
