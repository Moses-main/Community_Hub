import { Link } from "wouter";
import { format } from "date-fns";
import { MapPin, Clock } from "lucide-react";
import type { Event } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRsvpEvent } from "@/hooks/use-events";
import { useToast } from "@/hooks/use-toast";
import { apiRoutes } from "@/lib/api-routes";
import { buildApiUrl } from "@/lib/api-config";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { user } = useAuth();
  const { mutate: rsvp, isPending } = useRsvpEvent();
  const { toast } = useToast();
  const eventDate = new Date(event.date);

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

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden border-border/50 hover:border-primary/20 transition-all duration-300">
      <div className="md:w-1/3 bg-muted relative min-h-[200px] md:min-h-full">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-4xl font-display font-bold text-muted-foreground/20">
              {format(eventDate, "dd")}
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-center shadow-sm">
          <div className="text-xs font-bold uppercase text-primary">{format(eventDate, "MMM")}</div>
          <div className="text-xl font-display font-bold leading-none">{format(eventDate, "dd")}</div>
        </div>
      </div>
      <CardContent className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-xl mb-2">{event.title}</h3>
          <p className="text-muted-foreground line-clamp-2 mb-4">
            {event.description}
          </p>
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              <span>{format(eventDate, "h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleRsvp} 
            disabled={isPending}
            className="w-full md:w-auto"
          >
            {isPending ? "Confirming..." : "RSVP Now"}
          </Button>
          <Button variant="outline" asChild className="w-full md:w-auto">
            <Link href={`/events/${event.id}`}>Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
