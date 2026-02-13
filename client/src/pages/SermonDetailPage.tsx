import { useRoute } from "wouter";
import { useSermon } from "@/hooks/use-sermons";
import ReactPlayer from "react-player";
import { format } from "date-fns";
import { Play, Calendar, User, ArrowLeft, Share2, Download, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function SermonDetailPage() {
  const [, params] = useRoute<{ id: string }>("/sermons/:id");
  const sermonId = params?.id ? parseInt(params.id) : null;
  const { data: sermon, isLoading, error } = useSermon(sermonId!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="bg-secondary/30 py-16 border-b border-border">
          <div className="container px-4">
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-6" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
        <div className="container px-4 py-8">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Sermon not found</h1>
          <Button asChild>
            <Link href="/sermons">Back to Sermons</Link>
          </Button>
        </div>
      </div>
    );
  }

  const sermonDate = new Date(sermon.date);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary/30 py-16 border-b border-border">
        <div className="container px-4">
          <Button variant="ghost" asChild className="mb-6 -ml-4">
            <Link href="/sermons">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sermons
            </Link>
          </Button>

          {sermon.series && (
            <Badge variant="secondary" className="mb-4 text-sm">
              {sermon.series}
            </Badge>
          )}
          
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {sermon.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="font-medium">{sermon.speaker}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">{format(sermonDate, "MMMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-black relative">
                {sermon.videoUrl ? (
                  <ReactPlayer
                    // @ts-ignore
                    url={sermon.videoUrl}
                    width="100%"
                    height="100%"
                    controls
                    playing={false}
                  />
                ) : sermon.thumbnailUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={sermon.thumbnailUrl}
                      alt={sermon.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-10 w-10 text-primary ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <Play className="h-20 w-20 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            {sermon.description && (
              <Card className="mt-6 p-6">
                <h3 className="text-xl font-bold mb-4">About this message</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {sermon.description}
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Sermon Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Speaker</p>
                    <p className="font-medium">{sermon.speaker}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(sermonDate, "MMMM d, yyyy")}</p>
                  </div>
                </div>
                {sermon.series && (
                  <div className="flex items-start gap-3">
                    <Play className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Series</p>
                      <p className="font-medium">{sermon.series}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <Button variant="outline" className="w-full" size="lg">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                {sermon.audioUrl && (
                  <Button variant="outline" className="w-full" size="lg">
                    <Headphones className="mr-2 h-4 w-4" />
                    Listen Audio
                  </Button>
                )}
                {sermon.audioUrl && (
                  <Button variant="outline" className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download Audio
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
