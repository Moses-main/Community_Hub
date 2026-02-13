import { useRoute } from "wouter";
import { useSermon } from "@/hooks/use-sermons";
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
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-2/3 mb-2" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-32 w-full mt-6 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sermon not found</h1>
          <Button asChild>
            <Link href="/sermons">Back to Sermons</Link>
          </Button>
        </div>
      </div>
    );
  }

  const sermonDate = new Date(sermon.date);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/sermons" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Sermons
        </Link>

        {/* Header */}
        <div className="mb-8">
          {sermon.series && (
            <Badge variant="secondary" className="mb-4 bg-purple-50 text-purple-700">
              {sermon.series}
            </Badge>
          )}
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {sermon.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium text-gray-900">{sermon.speaker}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{format(sermonDate, "MMMM d, yyyy")}</span>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <Card className="border border-gray-100 overflow-hidden mb-8">
          <div className="aspect-video bg-gray-50 relative">
            {sermon.videoUrl ? (
              <iframe
                src={sermon.videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : sermon.thumbnailUrl ? (
              <div className="relative w-full h-full">
                <img src={sermon.thumbnailUrl} alt={sermon.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-8 w-8 text-purple-600 ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="h-16 w-16 text-gray-200" />
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this message</h2>
                <p className="text-gray-600 leading-relaxed">
                  {sermon.description || "No description available."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="border border-gray-100 sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Sermon Details</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <User className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Speaker</p>
                      <p className="font-medium text-gray-900">{sermon.speaker}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">{format(sermonDate, "MMMM d, yyyy")}</p>
                    </div>
                  </div>
                  {sermon.series && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Play className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Series</p>
                        <p className="font-medium text-gray-900">{sermon.series}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  {sermon.audioUrl && (
                    <>
                      <Button variant="outline" className="w-full" size="sm">
                        <Headphones className="w-4 h-4 mr-2" />
                        Listen Audio
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Audio
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
