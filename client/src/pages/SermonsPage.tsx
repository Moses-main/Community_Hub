import ReactPlayer from "react-player";
import { useSermons } from "@/hooks/use-sermons";
import { SermonCard } from "@/components/SermonCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function SermonsPage() {
  const { data: sermons, isLoading } = useSermons();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary/30 py-16 border-b border-border">
        <div className="container px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Sermon Library</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore our collection of messages to help you grow in your faith journey.
          </p>
        </div>
      </div>

      <div className="container px-4 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search sermons..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-full md:w-[200px] bg-white">
              <SelectValue placeholder="Series" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-xl">
              <SelectItem value="all">All Series</SelectItem>
              <SelectItem value="faith">Faith & Works</SelectItem>
              <SelectItem value="gospel">The Gospel</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-[200px] bg-white">
              <SelectValue placeholder="Speaker" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-xl">
              <SelectItem value="all">All Speakers</SelectItem>
              <SelectItem value="pastor">Pastor John</SelectItem>
              <SelectItem value="guest">Guest Speakers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            sermons?.map(sermon => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
