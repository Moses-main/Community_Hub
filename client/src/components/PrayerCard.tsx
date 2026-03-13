import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, User } from "lucide-react";
import type { PrayerRequest } from "@/types/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePrayForRequest } from "@/hooks/use-prayer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PrayerCardProps {
  request: PrayerRequest;
}

export function PrayerCard({ request }: PrayerCardProps) {
  const { mutate: pray, isPending } = usePrayForRequest();
  const [hasPrayed, setHasPrayed] = useState(false);

  const handlePray = () => {
    if (hasPrayed) return;
    pray(request.id, {
      onSuccess: () => setHasPrayed(true),
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col border-border/50 hover:shadow-md transition-shadow rounded-none">
      <CardContent className="p-4 sm:p-8 flex-1">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={14} className="sm:hidden" />
            <User size={18} className="hidden sm:block" />
          </div>
          <div>
            <div className="font-semibold text-xs sm:text-base">
              {request.isAnonymous ? "Anonymous" : (request.authorName || "Community Member")}
            </div>
            <div className="text-[10px] sm:text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(request.createdAt || new Date()), { addSuffix: true })}
            </div>
          </div>
        </div>
        <p className="text-foreground/90 leading-relaxed italic text-xs sm:text-base">
          "{request.content}"
        </p>
      </CardContent>
      <CardFooter className="p-3 sm:p-5 bg-secondary/30 border-t border-border/50 flex justify-between items-center">
        <div className="text-xs sm:text-base text-muted-foreground">
          <span className="font-semibold text-primary">{request.prayCount}</span> prayed
        </div>
        <Button 
          variant={hasPrayed ? "secondary" : "outline"} 
          size="sm" 
          onClick={handlePray}
          disabled={isPending || hasPrayed}
          className={cn(
            "gap-1.5 transition-all rounded-lg text-xs sm:text-sm",
            hasPrayed && "text-destructive bg-destructive/10 hover:bg-destructive/20 border-destructive/20"
          )}
        >
          <Heart size={14} className={cn(hasPrayed && "fill-current")} />
          {hasPrayed ? "Prayed" : "I Prayed"}
        </Button>
      </CardFooter>
    </Card>
    </motion.div>
  );
}
