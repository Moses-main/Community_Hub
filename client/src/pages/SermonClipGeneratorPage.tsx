import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Video, Film, Download, Trash2, Play, Square, Instagram, Smartphone, Monitor, Scissors, Plus, Clock, Type } from "lucide-react";

interface SermonClip {
  id: number;
  title: string;
  sourceVideoUrl: string | null;
  clipStartTime: number;
  clipEndTime: number;
  format: string;
  overlayText: string | null;
  verseReference: string | null;
  outputUrl: string | null;
  status: string;
  createdAt: string;
}

async function fetchClips(): Promise<SermonClip[]> {
  const res = await fetch("/api/sermon-clips", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch clips");
  return res.json();
}

async function createClip(data: {
  title: string;
  sourceVideoUrl: string;
  clipStartTime: number;
  clipEndTime: number;
  format: string;
  overlayText?: string;
  verseReference?: string;
}) {
  const res = await fetch("/api/sermon-clips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create clip");
  return res.json();
}

async function deleteClip(id: number) {
  const res = await fetch(`/api/sermon-clips/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete clip");
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function parseTime(timeStr: string): number {
  const parts = timeStr.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return parseInt(parts[0]) * 60;
}

export default function SermonClipGeneratorPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clips, setClips] = useState<SermonClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    sourceVideoUrl: "",
    startTime: "0:00",
    endTime: "1:00",
    format: "landscape",
    overlayText: "",
    verseReference: "",
  });

  const isAdmin = user?.isAdmin;

  useState(() => {
    if (isAdmin) {
      loadClips();
    }
  });

  async function loadClips() {
    try {
      const data = await fetchClips();
      setClips(data);
    } catch (err) {
      console.error("Error loading clips:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateClip() {
    if (!formData.title || !formData.sourceVideoUrl) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      await createClip({
        title: formData.title,
        sourceVideoUrl: formData.sourceVideoUrl,
        clipStartTime: parseTime(formData.startTime),
        clipEndTime: parseTime(formData.endTime),
        format: formData.format,
        overlayText: formData.overlayText || undefined,
        verseReference: formData.verseReference || undefined,
      });
      toast({ title: "Clip created!", description: "Your clip has been created and is ready for processing." });
      setShowCreateDialog(false);
      setFormData({
        title: "",
        sourceVideoUrl: "",
        startTime: "0:00",
        endTime: "1:00",
        format: "landscape",
        overlayText: "",
        verseReference: "",
      });
      loadClips();
    } catch (err) {
      console.error("Error creating clip:", err);
      toast({ title: "Error", description: "Failed to create clip", variant: "destructive" });
    }
  }

  async function handleDeleteClip(id: number) {
    try {
      await deleteClip(id);
      toast({ title: "Clip deleted" });
      loadClips();
    } catch (err) {
      console.error("Error deleting clip:", err);
      toast({ title: "Error", description: "Failed to delete clip", variant: "destructive" });
    }
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Admin Access Only</h2>
              <p className="text-gray-600">
                The Sermon Clip Generator is available for church administrators only.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Sermon Clip Generator</h1>
          <p className="text-gray-600 text-lg">Create short video clips from sermons for social media</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Clip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Sermon Clip</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Clip Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Key Message - John 3:16"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL *</Label>
                <Input
                  id="videoUrl"
                  value={formData.sourceVideoUrl}
                  onChange={(e) => setFormData({ ...formData, sourceVideoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-sm text-gray-500">Paste a YouTube or direct video URL</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="0:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="1:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Output Format</Label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, format: "square" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.format === "square" ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <Instagram className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Square</p>
                    <p className="text-xs text-gray-500">1:1 (1080x1080)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, format: "vertical" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.format === "vertical" ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <Smartphone className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Vertical</p>
                    <p className="text-xs text-gray-500">9:16 (1080x1920)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, format: "landscape" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.format === "landscape" ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <Monitor className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Landscape</p>
                    <p className="text-xs text-gray-500">16:9 (1920x1080)</p>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overlayText">Overlay Text (Optional)</Label>
                <Textarea
                  id="overlayText"
                  value={formData.overlayText}
                  onChange={(e) => setFormData({ ...formData, overlayText: e.target.value })}
                  placeholder="Enter text to overlay on the video..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="verseReference">Bible Verse Reference (Optional)</Label>
                <Input
                  id="verseReference"
                  value={formData.verseReference}
                  onChange={(e) => setFormData({ ...formData, verseReference: e.target.value })}
                  placeholder="e.g., John 3:16"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateClip}>
                  <Scissors className="w-4 h-4 mr-2" />
                  Create Clip
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {clips.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <Film className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No clips yet</h3>
              <p className="text-gray-600 mb-4">Create your first sermon clip to get started</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Clip
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map((clip) => (
            <Card key={clip.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{clip.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    {clip.format === "square" && <Instagram className="w-4 h-4 text-gray-400" />}
                    {clip.format === "vertical" && <Smartphone className="w-4 h-4 text-gray-400" />}
                    {clip.format === "landscape" && <Monitor className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatTime(clip.clipStartTime)} - {formatTime(clip.clipEndTime)}
                    </span>
                    <span className="text-gray-400">
                      ({formatTime(clip.clipEndTime - clip.clipStartTime)})
                    </span>
                  </div>
                  
                  {clip.verseReference && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      📖 {clip.verseReference}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        clip.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : clip.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {clip.status}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteClip(clip.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {clip.outputUrl && (
                      <Button size="sm" className="flex-1 gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
