import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Loader2, 
  Calendar, 
  ChevronRight,
  Clock,
  Target,
  Plus,
  Sparkles,
  CheckCircle2,
  ArrowLeft
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
  const [selectedDevotionalId, setSelectedDevotionalId] = useState<number | null>(null);
  
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
            setSelectedDevotionalId(devotionalData[0].id);
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

  const selectedDevotional = devotionals.find(d => d.id === selectedDevotionalId) || todayDevotional;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Daily Devotionals</h1>
              <p className="mt-2 text-slate-500 text-[15px] font-normal">
                Grow in your faith with daily reflections and Bible reading plans
              </p>
            </div>
            
            {isAdmin && (
              <div className="flex items-center gap-3">
                <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 h-10 rounded-lg border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                      <Sparkles className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-600">Generate with AI</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-xl border-0 shadow-2xl bg-white p-6">
                    <DialogHeader className="pb-4">
                      <DialogTitle className="text-xl font-semibold text-slate-900">AI Devotional Generator</DialogTitle>
                      <DialogDescription className="text-slate-500">
                        Enter a topic or theme, and AI will generate a devotional for you
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Topic or Theme</Label>
                        <Textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="e.g., God's love, faith, forgiveness, Easter, etc."
                          rows={3}
                          className="mt-1.5 rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        />
                      </div>
                      <Button
                        onClick={generateWithAI}
                        disabled={isGenerating}
                        className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 gap-2 font-medium"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Generate Devotional
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 h-10 rounded-lg bg-slate-900 hover:bg-slate-800 gap-2 font-medium">
                      <Plus className="w-4 h-4" />
                      Create
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl rounded-xl border-0 shadow-2xl bg-white p-6">
                    <DialogHeader className="pb-4">
                      <DialogTitle className="text-xl font-semibold text-slate-900">Create New Devotional</DialogTitle>
                      <DialogDescription className="text-slate-500">
                        Create a new daily devotional for the community
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Title *</Label>
                        <Input
                          value={newDevotional.title}
                          onChange={(e) => setNewDevotional({ ...newDevotional, title: e.target.value })}
                          placeholder="Enter devotional title"
                          className="mt-1.5 rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Content *</Label>
                        <Textarea
                          value={newDevotional.content}
                          onChange={(e) => setNewDevotional({ ...newDevotional, content: e.target.value })}
                          placeholder="Write your devotional content..."
                          rows={8}
                          className="mt-1.5 rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-700">Author</Label>
                          <Input
                            value={newDevotional.author}
                            onChange={(e) => setNewDevotional({ ...newDevotional, author: e.target.value })}
                            placeholder="Author name"
                            className="mt-1.5 rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700">Bible Verse</Label>
                          <Input
                            value={newDevotional.bibleVerse}
                            onChange={(e) => setNewDevotional({ ...newDevotional, bibleVerse: e.target.value })}
                            placeholder="e.g., John 3:16"
                            className="mt-1.5 rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-700">Theme</Label>
                          <Input
                            value={newDevotional.theme}
                            onChange={(e) => setNewDevotional({ ...newDevotional, theme: e.target.value })}
                            placeholder="Theme or category"
                            className="mt-1.5 rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700">Publish Date</Label>
                          <Input
                            type="date"
                            value={newDevotional.publishDate}
                            onChange={(e) => setNewDevotional({ ...newDevotional, publishDate: e.target.value })}
                            className="mt-1.5 rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={createDevotional}
                        disabled={isCreating}
                        className="w-full h-11 rounded-lg bg-slate-900 hover:bg-slate-800 font-medium"
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
        </header>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <main>
            {selectedDevotional ? (
              <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                {selectedDevotional.imageUrl && (
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={selectedDevotional.imageUrl} 
                      alt={selectedDevotional.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 text-sm text-slate-400 mb-6">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedDevotional.publishDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    {selectedDevotional.theme && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium text-xs">
                          {selectedDevotional.theme}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
                    {selectedDevotional.title}
                  </h2>
                  {selectedDevotional.author && (
                    <p className="text-slate-500 mb-8">By {selectedDevotional.author}</p>
                  )}
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="whitespace-pre-wrap leading-8 text-slate-600 text-[17px] font-normal">
                      {selectedDevotional.content}
                    </p>
                  </div>
                  
                  {selectedDevotional.bibleVerse && (
                    <div className="mt-10 p-6 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Bible Verse</p>
                      <p className="text-lg font-medium text-slate-800">{selectedDevotional.bibleVerse}</p>
                    </div>
                  )}
                </div>
              </article>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No devotional available today.</p>
              </div>
            )}

            {devotionals.length > 1 && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Past Devotionals</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {devotionals.slice(1, 5).map((devotional) => (
                    <button
                      key={devotional.id}
                      onClick={() => setSelectedDevotionalId(devotional.id)}
                      className={`text-left p-5 rounded-xl transition-all duration-200 ${
                        selectedDevotionalId === devotional.id
                          ? 'bg-white shadow-md ring-1 ring-slate-200'
                          : 'bg-white shadow-sm hover:shadow-md hover:ring-1 hover:ring-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(devotional.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h4 className="font-medium text-slate-900 mb-1.5 line-clamp-1">{devotional.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2">{devotional.content.substring(0, 100)}...</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Reading Plans</h3>
                  <p className="text-sm text-slate-500">Bible reading tracks</p>
                </div>
              </div>

              {readingPlans.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No reading plans available</p>
              ) : (
                <>
                  <div className="space-y-2 mb-6">
                    {readingPlans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedPlan?.id === plan.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {plan.title}
                      </button>
                    ))}
                  </div>

                  {selectedPlan && (
                    <div className="border-t border-slate-100 pt-5">
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-semibold text-slate-900">{progressPercentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{selectedPlan.duration} days</span>
                        <span className="text-slate-200">·</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{completedDays} completed</span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto">
                        {Array.from({ length: selectedPlan.duration }, (_, i) => {
                          const dayNumber = i + 1;
                          const isCompleted = progress.some(p => p.dayNumber === dayNumber && p.completed);
                          
                          return (
                            <button
                              key={dayNumber}
                              onClick={() => !isCompleted && markDayComplete(dayNumber)}
                              disabled={!user || isCompleted}
                              className={`h-9 rounded-lg text-xs font-medium transition-all duration-200 ${
                                isCompleted
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : user
                                  ? 'bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                                  : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                              }`}
                            >
                              {dayNumber}
                            </button>
                          );
                        })}
                      </div>

                      {!user && (
                        <p className="text-xs text-slate-400 text-center mt-4">
                          Sign in to track progress
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
