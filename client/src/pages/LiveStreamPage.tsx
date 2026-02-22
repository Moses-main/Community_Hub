import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Eye, Users, ArrowLeft, StopCircle, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

interface LiveStream {
  id: number;
  title: string;
  description: string | null;
  streamUrl: string | null;
  embedUrl: string | null;
  youtubeVideoId: string | null;
  youtubeChannelId: string | null;
  youtubeChannelName: string | null;
  isLive: boolean;
  startedAt: string | null;
  endedAt: string | null;
  viewerCount: number;
  createdAt: string;
}

export default function LiveStreamPage() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.isAdmin;

  const { data: currentStream, isLoading: loadingCurrent } = useQuery<LiveStream | null>({
    queryKey: ["/api/live-streams/current"],
    queryFn: async () => {
      const res = await fetch("/api/live-streams/current");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: streams, isLoading: loadingStreams } = useQuery<LiveStream[]>({
    queryKey: ["/api/live-streams"],
    queryFn: async () => {
      const res = await fetch("/api/live-streams");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const endStreamMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/live-streams/${id}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to end stream");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/live-streams"] });
    },
  });

  if (loadingCurrent || loadingStreams) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-[100vh] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0 py-0">
      {/* Header - always visible when scrolling */}
      <div className="sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Live Stream</h1>
          {currentStream && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {currentStream && (
            <span className="text-gray-500 flex items-center gap-1 text-sm">
              <Eye className="w-4 h-4" />
              {currentStream.viewerCount}
            </span>
          )}
          {isAdmin && (
            <Button size="sm" onClick={() => setLocation("/admin/live-stream/new")}>
              <Youtube className="mr-1 h-4 w-4" />
              Go Live
            </Button>
          )}
        </div>
      </div>

      {/* Current Live Stream - Full screen height but scrollable */}
      {currentStream ? (
        <div className="mb-0">
          <Card className="overflow-hidden rounded-none border-0">
            {/* YouTube Embed - Full viewport height */}
            {currentStream.youtubeVideoId ? (
              <div className="relative w-full bg-black" style={{ height: "calc(100vh - 57px)" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${currentStream.youtubeVideoId}?autoplay=1&live=1&rel=0&modestbranding=1`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={currentStream.title}
                />
                <noscript>
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                    <p>Please enable JavaScript to watch the live stream</p>
                  </div>
                </noscript>
              </div>
            ) : currentStream.embedUrl ? (
              <div className="relative w-full" style={{ height: "calc(100vh - 57px)" }}>
                <iframe
                  src={currentStream.embedUrl}
                  className="absolute top-0 left-0 w-full"
                  style={{ height: "100%" }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={currentStream.title}
                />
              </div>
            ) : currentStream.streamUrl ? (
              <div className="w-full flex items-center justify-center bg-gray-900" style={{ height: "calc(100vh - 57px)" }}>
                <a
                  href={currentStream.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-center"
                >
                  <Button size="lg">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Live Stream
                  </Button>
                </a>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center bg-gray-900" style={{ height: "calc(100vh - 57px)" }}>
                <div className="text-center text-white">
                  <Users className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Live stream is starting soon...</p>
                </div>
              </div>
            )}
          </Card>

          {/* Stream Info - Below video */}
          <div className="bg-white p-4 border-t">
            <div className="flex items-start justify-between gap-4 max-w-4xl mx-auto">
              <div>
                <h2 className="text-xl font-bold mb-1">{currentStream.title}</h2>
                {currentStream.description && (
                  <p className="text-gray-600 text-sm mb-2">{currentStream.description}</p>
                )}
                {currentStream.youtubeChannelName && (
                  <p className="text-gray-500 text-xs flex items-center gap-1">
                    <Youtube className="w-3 h-3" />
                    {currentStream.youtubeChannelName}
                  </p>
                )}
                {currentStream.startedAt && (
                  <p className="text-gray-400 text-xs mt-1">
                    Started {format(new Date(currentStream.startedAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                )}
              </div>
              {isAdmin && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => endStreamMutation.mutate(currentStream.id)}
                  disabled={endStreamMutation.isPending}
                >
                  <StopCircle className="mr-1 h-4 w-4" />
                  {endStreamMutation.isPending ? "Ending..." : "End"}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Youtube className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">No Live Stream Currently</h2>
            <p className="text-gray-500">Check back later for live services and events.</p>
            {isAdmin && (
              <Button className="mt-4" onClick={() => setLocation("/admin/live-stream/new")}>
                Start YouTube Stream
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Past Streams / Replays - Only show when not live */}
      {!currentStream && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Past Services & Replays</h2>
          {streams && streams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {streams
                .filter((s) => !s.isLive)
                .map((stream) => (
                  <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation(`/sermons`)}>
                    <div className="aspect-video bg-gray-100 relative">
                      {stream.youtubeVideoId ? (
                        <img
                          src={`https://img.youtube.com/vi/${stream.youtubeVideoId}/maxresdefault.jpg`}
                          alt={stream.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=60";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
                          <Play className="h-4 w-4 text-gray-900 ml-0.5" />
                        </div>
                      </div>
                      {stream.youtubeVideoId && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1">
                          <Youtube className="w-3 h-3" />
                          Watch
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1">{stream.title}</h3>
                      {stream.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{stream.description}</p>
                      )}
                      {stream.startedAt && (
                        <p className="text-xs text-gray-400">
                          {format(new Date(stream.startedAt), "MMMM d, yyyy")}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No past streams available.</p>
          )}
        </div>
      )}
    </div>
  );
}
