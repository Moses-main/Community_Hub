import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Calendar, Clock, MapPin, Eye, Users, ArrowLeft, StopCircle } from "lucide-react";
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
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Live Stream</h1>
        </div>
        {isAdmin && (
          <Button onClick={() => setLocation("/admin/live-stream/new")}>
            Start New Stream
          </Button>
        )}
      </div>

      {/* Current Live Stream */}
      {currentStream ? (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </span>
            <span className="text-gray-500 flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {currentStream.viewerCount} watching
            </span>
          </div>
          
          <Card className="overflow-hidden">
            {currentStream.embedUrl ? (
              <iframe
                src={currentStream.embedUrl}
                className="w-full aspect-video"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={currentStream.title}
              />
            ) : currentStream.streamUrl ? (
              <a
                href={currentStream.streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full aspect-video flex items-center justify-center bg-gray-900 text-white"
              >
                <Button size="lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Live Stream
                </Button>
              </a>
            ) : (
              <div className="w-full aspect-video flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Live stream is starting soon...</p>
                </div>
              </div>
            )}
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">{currentStream.title}</h2>
              {currentStream.description && (
                <p className="text-gray-600 mb-4">{currentStream.description}</p>
              )}
              {currentStream.startedAt && (
                <p className="text-sm text-gray-500">
                  Started {format(new Date(currentStream.startedAt), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              )}
              {isAdmin && (
                <Button
                  variant="destructive"
                  className="mt-4"
                  onClick={() => endStreamMutation.mutate(currentStream.id)}
                  disabled={endStreamMutation.isPending}
                >
                  <StopCircle className="mr-2 h-4 w-4" />
                  {endStreamMutation.isPending ? "Ending..." : "End Stream"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mb-12 text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">No Live Stream Currently</h2>
          <p className="text-gray-500">Check back later for live services and events.</p>
        </div>
      )}

      {/* Past Streams */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Past Streams</h2>
        {streams && streams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams
              .filter((s) => !s.isLive)
              .map((stream) => (
                <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-400" />
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
    </div>
  );
}
