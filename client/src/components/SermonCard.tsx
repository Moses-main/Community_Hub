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
              <Play className="text-primary/40 w-12 h-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Play className="w-5 h-5 text-primary ml-1" />
            </div>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs font-normal">
              {sermon.series || "Sunday Service"}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar size={12} />
              {format(new Date(sermon.date), "MMM d, yyyy")}
            </span>
          </div>
          <h3 className="font-display font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
            {sermon.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={14} />
            <span>{sermon.speaker}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
