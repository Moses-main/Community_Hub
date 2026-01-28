import { usePrayerRequests } from "@/hooks/use-prayer";
import { PrayerCard } from "@/components/PrayerCard";
import { CreatePrayerDialog } from "@/components/CreatePrayerDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function PrayerPage() {
  const { data: requests, isLoading } = usePrayerRequests();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-secondary/30 py-16 border-b border-border">
        <div className="container px-4 text-center">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Prayer Wall</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">How Can We Pray For You?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Share your request with our community. We believe that prayer changes things.
          </p>
          <CreatePrayerDialog />
        </div>
      </div>

      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))
          ) : (
            requests?.map(request => (
              <PrayerCard key={request.id} request={request} />
            ))
          )}
        </div>
        
        {requests?.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p>No prayer requests yet. Be the first to share.</p>
          </div>
        )}
      </div>
    </div>
  );
}
