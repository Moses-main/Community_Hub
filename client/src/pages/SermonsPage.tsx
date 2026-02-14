import React, { useState } from "react";
import ReactPlayer from "react-player";
import { useSermons, type SermonFilters } from "@/hooks/use-sermons";
import { SermonCard } from "@/components/SermonCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function SermonsPage() {
  const [filters, setFilters] = useState<SermonFilters>({});
  const { data: sermons, isLoading } = useSermons(filters);

  const handleFilterChange = (key: keyof SermonFilters, value: string) => {
    if (value === "all" || !value) {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12 md:pb-20">
      {/* Header */}
      <div className="bg-secondary/30 py-10 md:py-16 border-b border-border">
        <div className="container px-3 md:px-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-2 md:mb-4">Sermon Library</h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl">
            Explore our collection of messages to help you grow in your faith journey.
          </p>
        </div>
      </div>

      <div className="container px-3 md:px-4 py-6 md:py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search sermons..." 
              className="pl-10"
              value={filters.speaker || ""}
              onChange={(e) => handleFilterChange("speaker", e.target.value)}
            />
          </div>
          <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-full md:w-[180px] lg:w-[200px] bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-xl">
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="past">Past Messages</SelectItem>
              <SelectItem value="upcoming">Upcoming Messages</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.series || "all"} onValueChange={(value) => handleFilterChange("series", value)}>
            <SelectTrigger className="w-full md:w-[180px] lg:w-[200px] bg-white">
              <SelectValue placeholder="Series" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-xl">
              <SelectItem value="all">All Series</SelectItem>
              <SelectItem value="Faith">Faith & Works</SelectItem>
              <SelectItem value="Gospel">The Gospel</SelectItem>
              <SelectItem value="Peace">Peace</SelectItem>
              <SelectItem value="Community">Community</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.speaker || "all"} onValueChange={(value) => handleFilterChange("speaker", value)}>
            <SelectTrigger className="w-full md:w-[180px] lg:w-[200px] bg-white">
              <SelectValue placeholder="Speaker" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-xl">
              <SelectItem value="all">All Speakers</SelectItem>
              <SelectItem value="John">Pastor John</SelectItem>
              <SelectItem value="Jane">Pastor Jane</SelectItem>
              <SelectItem value="Emmanuel">Pastor Emmanuel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-3 md:space-y-4">
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="h-5 md:h-6 w-3/4" />
                <Skeleton className="h-3 md:h-4 w-1/2" />
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
