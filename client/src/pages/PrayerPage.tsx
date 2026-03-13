import { usePrayerRequests } from "@/hooks/use-prayer";
import { PrayerCard } from "@/components/PrayerCard";
import { CreatePrayerDialog } from "@/components/CreatePrayerDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function PrayerPage() {
  const { data: requests, isLoading } = usePrayerRequests();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-10 sm:pb-16 md:pb-24">
      {/* Hero */}
      <div className="relative py-10 sm:py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="orb orb-purple w-48 sm:w-80 h-48 sm:h-80 top-0 right-0 animate-float" />
        <div className="orb orb-blue w-32 sm:w-56 h-32 sm:h-56 bottom-10 left-10" style={{ animationDelay: '2s' }} />
        <div className="orb orb-gold w-24 sm:w-40 h-24 sm:h-40 top-1/2 left-1/3 animate-glow" />
        <div className="container px-4 sm:px-6 md:px-8 text-center relative z-10">
          <span className="text-accent font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 block">{t("prayerWall")}</span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white font-[--font-display] tracking-tight mb-3 sm:mb-5">
            {t("howCanWePray")} <span className="text-gradient-gold">{t("prayForYou")}</span> {t("forYouPrayer")}
          </h1>
          <p className="text-xs sm:text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-5 sm:mb-8">
            {t("prayerDescription")}
          </p>
          <CreatePrayerDialog />
        </div>
      </div>

      <div className="container px-4 sm:px-6 md:px-10 py-6 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-56 md:h-72 w-full rounded-3xl" />
            ))
          ) : (
            requests?.map(request => (
              <PrayerCard key={request.id} request={request} />
            ))
          )}
        </div>
        {!isLoading && (!requests || requests.length === 0) && (
          <div className="text-center py-16">
            <Heart className="h-14 w-14 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground">{t("noPrayerRequests")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
