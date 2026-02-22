import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Video, Film, Download, Trash2, Play, Square, Instagram, Smartphone, Monitor, Scissors, Plus, Clock, Loader2, Upload, Link as LinkIcon, X } from "lucide-react";

interface SermonClip {
  id: number;
  title: string;
  sourceVideoUrl: string | null;
  sourceVideoPath: string | null;
  clipStartTime: number;
  clipEndTime: number;
  format: string;
  overlayText: string | null;
  verseReference: string | null;
  outputUrl: string | null;
  status: string;
  createdAt: string;
}

interface VideoPreview {
  duration: number;
  currentTime: number;
}

async function fetchClips(): Promise<SermonClip[]> {
  const res = await fetch("/api/sermon-clips", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch clips");
  return res.json();
}

async function createClip(data: {
  title: string;
  sourceVideoUrl?: string;
  sourceVideoPath?: string;
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

async function uploadVideo(file: File): Promise<{ path: string; url: string }> {
  const formData = new FormData();
  formData.append("video", file);
  
  const res = await fetch("/api/sermon-clips/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  
  if (!res.ok) throw new Error("Failed to upload video");
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
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function SermonClipGeneratorPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clips, setClips] = useState<SermonClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [videoSourceType, setVideoSourceType] = useState<"url" | "upload">("url");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<VideoPreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    sourceVideoUrl: "",
    sourceVideoPath: "",
    startTime: 0,
    endTime: 60,
    duration: 60,
    format: "landscape",
    overlayText: "",
    verseReference: "",
  });

  const isAdmin = user?.isAdmin;

  useEffect(() => {
    if (isAdmin) {
      loadClips();
    }
  }, [isAdmin]);

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

  function handleVideoLoaded() {
    if (videoRef.current) {
      const duration = Math.floor(videoRef.current.duration);
      setFormData(prev => ({
        ...prev,
        duration,
        endTime: Math.min(60, duration),
        startTime: 0
      }));
      setVideoPreview({
        duration,
        currentTime: 0
      });
    }
  }

  function handleTimeUpdate() {
    if (videoRef.current) {
      setVideoPreview(prev => prev ? {
        ...prev,
        currentTime: videoRef.current!.currentTime
      } : null);
    }
  }

  function handleSeek(time: number) {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }

  function handleStartTimeChange(value: number[]) {
    const newStart = value[0];
    const newEnd = Math.max(newStart + 5, formData.endTime);
    setFormData(prev => ({
      ...prev,
      startTime: newStart,
      endTime: Math.min(newEnd, prev.duration)
    }));
  }

  function handleEndTimeChange(value: number[]) {
    const newEnd = value[0];
    const newStart = Math.min(newEnd - 5, formData.startTime);
    setFormData(prev => ({
      ...prev,
      startTime: Math.max(0, newStart),
      endTime: newEnd
    }));
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast({ title: "Error", description: "Please select a video file", variant: "destructive" });
        return;
      }
      setUploadedFile(file);
      setFormData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
      
      const objectUrl = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = objectUrl;
      }
    }
  }

  async function handleProcessClip(id: number) {
    try {
      const res = await fetch(`/api/sermon-clips/${id}/process-now`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Processing complete!", description: "Your clip is ready for download" });
      } else {
        toast({ title: "Processing failed", description: data.message, variant: "destructive" });
      }
      loadClips();
    } catch (err) {
      console.error("Error processing clip:", err);
      toast({ title: "Error", description: "Failed to process clip", variant: "destructive" });
    }
  }

  async function handleCreateClip() {
    if (!formData.title) {
      toast({ title: "Error", description: "Please enter a title", variant: "destructive" });
      return;
    }

    if (videoSourceType === "url" && !formData.sourceVideoUrl) {
      toast({ title: "Error", description: "Please enter a video URL", variant: "destructive" });
      return;
    }

    if (videoSourceType === "upload" && !uploadedFile) {
      toast({ title: "Error", description: "Please select a video file", variant: "destructive" });
      return;
    }

    try {
      let sourceUrl = formData.sourceVideoUrl;
      let sourcePath = formData.sourceVideoPath;

      if (videoSourceType === "upload" && uploadedFile) {
        setIsUploading(true);
        const uploadResult = await uploadVideo(uploadedFile);
        sourcePath = uploadResult.path;
        sourceUrl = uploadResult.url;
        setIsUploading(false);
      }

      await createClip({
        title: formData.title,
        sourceVideoUrl: sourceUrl || undefined,
        sourceVideoPath: sourcePath || undefined,
        clipStartTime: formData.startTime,
        clipEndTime: formData.endTime,
        format: formData.format,
        overlayText: formData.overlayText || undefined,
        verseReference: formData.verseReference || undefined,
      });
      
      toast({ title: "Clip created!", description: "Your clip has been created and is ready for processing." });
      setShowCreateDialog(false);
      resetForm();
      loadClips();
    } catch (err) {
      console.error("Error creating clip:", err);
      toast({ title: "Error", description: "Failed to create clip", variant: "destructive" });
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      sourceVideoUrl: "",
      sourceVideoPath: "",
      startTime: 0,
      endTime: 60,
      duration: 60,
      format: "landscape",
      overlayText: "",
      verseReference: "",
    });
    setUploadedFile(null);
    setVideoPreview(null);
    if (videoRef.current) {
      videoRef.current.src = "";
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
        <Dialog open={showCreateDialog} onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Clip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                <Label>Video Source</Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoSourceType("url");
                      setUploadedFile(null);
                      if (videoRef.current) videoRef.current.src = "";
                    }}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      videoSourceType === "url" ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <LinkIcon className="w-5 h-5" />
                    <span className="font-medium">Video URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoSourceType("upload");
                      setFormData(prev => ({ ...prev, sourceVideoUrl: "" }));
                    }}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      videoSourceType === "upload" ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Upload File</span>
                  </button>
                </div>
              </div>

              {videoSourceType === "url" ? (
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
              ) : (
                <div className="space-y-2">
                  <Label>Upload Video *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    {uploadedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <Video className="w-8 h-8 text-primary" />
                        <span className="font-medium">{uploadedFile.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setUploadedFile(null);
                          if (videoRef.current) videoRef.current.src = "";
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600 mb-2">Drag and drop a video file or click to browse</p>
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={handleFileSelect}
                          className="max-w-xs mx-auto"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

              {(formData.sourceVideoUrl || uploadedFile) && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Timeline - Select Clip Range</Label>
                      <span className="text-sm text-gray-500">
                        Clip Duration: {formatDuration(formData.endTime - formData.startTime)}
                      </span>
                    </div>
                    
                    <video
                      ref={videoRef}
                      className="w-full max-h-64 rounded-lg bg-black"
                      controls
                      onLoadedMetadata={handleVideoLoaded}
                      onTimeUpdate={handleTimeUpdate}
                    >
                      Your browser does not support video playback.
                    </video>
                  </div>

                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Start: {formatTime(formData.startTime)}</span>
                        <span>End: {formatTime(formData.endTime)}</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Start Point</Label>
                          <Slider
                            value={[formData.startTime]}
                            onValueChange={handleStartTimeChange}
                            max={formData.duration}
                            step={1}
                            className="cursor-pointer"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">End Point</Label>
                          <Slider
                            value={[formData.endTime]}
                            onValueChange={handleEndTimeChange}
                            max={formData.duration}
                            step={1}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm" onClick={() => handleSeek(formData.startTime)}>
                        <Play className="w-4 h-4 mr-1" /> Preview Start
                      </Button>
                    </div>
                  </div>
                </div>
              )}

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
                <Button variant="outline" onClick={() => {
                  setShowCreateDialog(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleCreateClip} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4 h-4 mr-2" />
                      Create Clip
                    </>
                  )}
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
                    {(clip.status === "pending" || clip.status === "failed") && (
                      <Button
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => handleProcessClip(clip.id)}
                      >
                        <Play className="w-4 h-4" />
                        Process
                      </Button>
                    )}
                    {clip.status === "processing" && (
                      <Button size="sm" className="flex-1 gap-1" disabled>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClip(clip.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {clip.outputUrl && clip.status === "completed" && (
                      <Button size="sm" className="flex-1 gap-1" asChild>
                        <a href={clip.outputUrl} download target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" />
                          Download
                        </a>
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
