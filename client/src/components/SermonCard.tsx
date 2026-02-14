import { Link } from "wouter";
import { format } from "date-fns";
import { Play, Calendar, User } from "lucide-react";
import type { Sermon } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SermonCardProps {
  sermon: Sermon;
}

export function SermonCard({ sermon }: SermonCardProps) {
  return (
    <Link href={`/sermons/${sermon.id}`}>
      <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 cursor-pointer">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {sermon.thumbnailUrl ? (
            <img 
              src={sermon.thumbnailUrl} 
              alt={sermon.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            // Fallback placeholder
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Play className="text-primary/40 w-10 h-10 md:w-12 md:h-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Play className="w-4 h-4 md:w-5 md:h-5 text-primary ml-0.5" />
            </div>
          </div>
        </div>
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <Badge variant="secondary" className="text-[10px] md:text-xs font-normal">
              {sermon.series || "Sunday Service"}
            </Badge>
            <span className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
              {format(new Date(sermon.date), "MMM d, yyyy")}
            </span>
          </div>
          <h3 className="font-display font-bold text-base md:text-lg leading-tight mb-1.5 md:mb-2 group-hover:text-primary transition-colors">
            {sermon.title}
          </h3>
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
            <User className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>{sermon.speaker}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
