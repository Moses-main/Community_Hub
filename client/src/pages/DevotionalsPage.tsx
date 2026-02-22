import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Loader2, 
  Calendar, 
  CheckCircle,
  ChevronRight,
  Clock,
  Target,
  Plus,
  Sparkles
} from "lucide-react";
import { buildApiUrl } from "@/lib/api-config";

interface DailyDevotional {
  id: number;
  title: string;
  content: string;
  author: string | null;
  bibleVerse: string | null;
  theme: string | null;
  imageUrl: string | null;
  publishDate: string;
}

interface BibleReadingPlan {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  imageUrl: string | null;
  isActive: boolean;
}

interface ReadingProgress {
  id: number;
  dayNumber: number;
  completed: boolean;
  completedAt: string | null;
}

export default function DevotionalsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [todayDevotional, setTodayDevotional] = useState<DailyDevotional | null>(null);
  const [devotionals, setDevotionals] = useState<DailyDevotional[]>([]);
  const [readingPlans, setReadingPlans] = useState<BibleReadingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<BibleReadingPlan | null>(null);
  const [progress, setProgress] = useState<ReadingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Admin states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [newDevotional, setNewDevotional] = useState({
    title: "",
    content: "",
    author: "",
    bibleVerse: "",
    theme: "",
    publishDate: "",
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const isAdmin = user?.isAdmin;

  useEffect(() => {
    async function fetchData() {
      try {
        const [devotionalRes, plansRes] = await Promise.all([
          fetch(buildApiUrl("/api/devotionals?published=true"), { credentials: "include" }),
          fetch(buildApiUrl("/api/reading-plans?active=true"), { credentials: "include" }),
        ]);

        if (devotionalRes.ok) {
          const devotionalData = await devotionalRes.json();
          setDevotionals(devotionalData);
          if (devotionalData.length > 0) {
            setTodayDevotional(devotionalData[0]);
          }
        }

        if (plansRes.ok) {
          const plansData = await plansRes.json();
          setReadingPlans(plansData);
          if (plansData.length > 0) {
            setSelectedPlan(plansData[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!user || !selectedPlan) return;

    async function fetchProgress() {
      if (!selectedPlan) return;
      try {
        const res = await fetch(buildApiUrl(`/api/reading-plans/${selectedPlan.id}/progress`), {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setProgress(data);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    }
    fetchProgress();
  }, [user, selectedPlan]);

  const markDayComplete = async (dayNumber: number) => {
    if (!user || !selectedPlan) return;

    try {
      const res = await fetch(buildApiUrl(`/api/reading-plans/${selectedPlan.id}/progress`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dayNumber }),
      });

      if (res.ok) {
        const newProgress = await res.json();
        setProgress([...progress.filter(p => p.dayNumber !== dayNumber), newProgress]);
      }
    } catch (err) {
      console.error("Error marking day complete:", err);
    }
  };

  const completedDays = progress.filter(p => p.completed).length;
  const progressPercentage = selectedPlan ? Math.round((completedDays / selectedPlan.duration) * 100) : 0;

  const createDevotional = async () => {
    if (!newDevotional.title || !newDevotional.content) {
      toast({ title: "Error", description: "Title and content are required", variant: "destructive" });
      return;
    }
    setIsCreating(true);
    try {
      const res = await fetch(buildApiUrl("/api/devotionals"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newDevotional),
      });
      if (res.ok) {
        toast({ title: "Success", description: "Devotional created successfully!" });
        setShowCreateDialog(false);
        setNewDevotional({ title: "", content: "", author: "", bibleVerse: "", theme: "", publishDate: "" });
        // Refresh devotionals
        const devotionalRes = await fetch(buildApiUrl("/api/devotionals?published=true"));
        if (devotionalRes.ok) {
          const data = await devotionalRes.json();
          setDevotionals(data);
        }
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to create devotional", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const generateWithAI = async () => {
    if (!aiPrompt) {
      toast({ title: "Error", description: "Please enter a topic or theme", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch(buildApiUrl("/api/devotionals/ai-generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewDevotional({
          title: data.title || "",
          content: data.content || "",
          author: data.author || "",
          bibleVerse: data.bibleVerse || "",
          theme: data.theme || "",
          publishDate: data.publishDate || "",
        });
        toast({ title: "Success", description: "Devotional generated! You can edit before saving." });
        setShowAIDialog(false);
        setShowCreateDialog(true);
      } else {
        toast({ title: "Error", description: "Failed to generate devotional", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to generate devotional", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Devotionals</h1>
          <p className="text-muted-foreground mt-1">
            Grow in your faith with daily devotionals and Bible reading plans
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex gap-2">
            <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI Devotional Generator</DialogTitle>
                  <DialogDescription>
                    Enter a topic or theme, and AI will generate a devotional for you
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Topic or Theme</Label>
                    <Textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g., God's love, faith, forgiveness, Easter, etc."
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={generateWithAI}
                    disabled={isGenerating}
                    className="w-full gap-2"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate Devotional
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Devotional
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Devotional</DialogTitle>
                  <DialogDescription>
                    Create a new daily devotional for the community
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={newDevotional.title}
                      onChange={(e) => setNewDevotional({ ...newDevotional, title: e.target.value })}
                      placeholder="Enter devotional title"
                    />
                  </div>
                  <div>
                    <Label>Content *</Label>
                    <Textarea
                      value={newDevotional.content}
                      onChange={(e) => setNewDevotional({ ...newDevotional, content: e.target.value })}
                      placeholder="Write your devotional content..."
                      rows={8}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Author</Label>
                      <Input
                        value={newDevotional.author}
                        onChange={(e) => setNewDevotional({ ...newDevotional, author: e.target.value })}
                        placeholder="Author name"
                      />
                    </div>
                    <div>
                      <Label>Bible Verse</Label>
                      <Input
                        value={newDevotional.bibleVerse}
                        onChange={(e) => setNewDevotional({ ...newDevotional, bibleVerse: e.target.value })}
                        placeholder="e.g., John 3:16"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Theme</Label>
                      <Input
                        value={newDevotional.theme}
                        onChange={(e) => setNewDevotional({ ...newDevotional, theme: e.target.value })}
                        placeholder="Theme or category"
                      />
                    </div>
                    <div>
                      <Label>Publish Date</Label>
                      <Input
                        type="date"
                        value={newDevotional.publishDate}
                        onChange={(e) => setNewDevotional({ ...newDevotional, publishDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={createDevotional}
                    disabled={isCreating}
                    className="w-full"
                  >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isCreating ? "Creating..." : "Create Devotional"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Tabs defaultValue="devotional" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="devotional">
            <BookOpen className="w-4 h-4 mr-2" />
            Today's Devotional
          </TabsTrigger>
          <TabsTrigger value="plans">
            <Target className="w-4 h-4 mr-2" />
            Reading Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devotional" className="space-y-6">
          {todayDevotional ? (
            <Card className="overflow-hidden">
              {todayDevotional.imageUrl && (
                <div className="h-64 overflow-hidden">
                  <img 
                    src={todayDevotional.imageUrl} 
                    alt={todayDevotional.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(todayDevotional.publishDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  {todayDevotional.theme && (
                    <>
                      <span>•</span>
                      <span className="bg-primary/10 px-2 py-0.5 rounded-full text-primary">{todayDevotional.theme}</span>
                    </>
                  )}
                </div>
                <CardTitle className="text-2xl">{todayDevotional.title}</CardTitle>
                {todayDevotional.author && (
                  <CardDescription className="text-base">By {todayDevotional.author}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed">{todayDevotional.content}</p>
                </div>
                {todayDevotional.bibleVerse && (
                  <div className="bg-secondary/50 p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">Bible Verse</p>
                    <p className="font-medium text-lg">{todayDevotional.bibleVerse}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No devotional available today.</p>
              </CardContent>
            </Card>
          )}

          {devotionals.length > 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Past Devotionals</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {devotionals.slice(1, 5).map((devotional) => (
                  <Card key={devotional.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{devotional.title}</CardTitle>
                      <CardDescription>
                        {new Date(devotional.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{devotional.content.substring(0, 150)}...</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          {readingPlans.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reading plans available at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {readingPlans.map((plan) => (
                  <Button
                    key={plan.id}
                    variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                    onClick={() => setSelectedPlan(plan)}
                    className="whitespace-nowrap"
                  >
                    {plan.title}
                  </Button>
                ))}
              </div>

              {selectedPlan && (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedPlan.title}</CardTitle>
                    {selectedPlan.description && (
                      <CardDescription>{selectedPlan.description}</CardDescription>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{selectedPlan.duration} days</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4" />
                        <span>{completedDays} days completed</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{progressPercentage}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {Array.from({ length: selectedPlan.duration }, (_, i) => {
                        const dayNumber = i + 1;
                        const isCompleted = progress.some(p => p.dayNumber === dayNumber && p.completed);
                        
                        return (
                          <Button
                            key={dayNumber}
                            variant={isCompleted ? "secondary" : "outline"}
                            className="relative"
                            disabled={!user}
                            onClick={() => !isCompleted && markDayComplete(dayNumber)}
                          >
                            Day {dayNumber}
                            {isCompleted && (
                              <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-green-500 bg-white rounded-full" />
                            )}
                          </Button>
                        );
                      })}
                    </div>

                    {!user && (
                      <p className="text-sm text-muted-foreground text-center">
                        Log in to track your reading progress
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
