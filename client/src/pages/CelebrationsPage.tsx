import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Cake, Heart, PartyPopper, Plus, Send, Gift, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  useUpcomingBirthdays,
  useUpcomingAnniversaries,
  useTodaysCelebrations,
  useAddCelebration,
  useSendGreeting,
  getDaysUntil,
  getAge,
} from "@/hooks/use-celebrations";

const GREETING_TEMPLATES = {
  birthday: [
    "🎂 Happy Birthday, {name}! May God bless you abundantly on your special day!",
    "🎉 Wishing you a wonderful birthday, {name}! May this new year bring you closer to God's purpose for your life!",
    "🎈 Happy Birthday, {name}! You are a blessing to our church family. Enjoy your day!",
  ],
  anniversary: [
    "💍 Happy Anniversary, {name}! May God continue to strengthen your union and fill your home with love!",
    "❤️ Congratulations on your anniversary, {name}! What a beautiful testimony of God's faithfulness!",
    "🥂 Happy Anniversary, {name}! Wishing you many more years of love and happiness together!",
  ],
};

export default function CelebrationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: upcomingBirthdays, isLoading: loadingBirthdays } = useUpcomingBirthdays(30);
  const { data: upcomingAnniversaries, isLoading: loadingAnniversaries } = useUpcomingAnniversaries(30);
  const { data: todaysCelebrations } = useTodaysCelebrations();
  const addCelebration = useAddCelebration();
  const sendGreeting = useSendGreeting();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [greetDialogOpen, setGreetDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [greetingType, setGreetingType] = useState<"birthday" | "anniversary">("birthday");
  const [customMessage, setCustomMessage] = useState("");

  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    weddingAnniversary: "",
  });

  // Helper to get member name consistently
  const getMemberFirstName = (member: any) => member.firstName || member.first_name || "";
  const getMemberLastName = (member: any) => member.lastName || member.last_name || "";

  const handleAddMember = async () => {
    if (!newMember.firstName || !user) return;
    try {
      await addCelebration.mutateAsync({
        user_id: user.id,
        first_name: newMember.firstName,
        last_name: newMember.lastName || null,
        email: newMember.email || null,
        phone: newMember.phone || null,
        birthday: newMember.birthday || null,
        wedding_anniversary: newMember.weddingAnniversary || null,
      });
      toast({ title: "Member added!", description: `${newMember.firstName} has been added to celebrations.` });
      setAddDialogOpen(false);
      setNewMember({ firstName: "", lastName: "", email: "", phone: "", birthday: "", weddingAnniversary: "" });
    } catch {
      toast({ title: "Error", description: "Failed to add member.", variant: "destructive" });
    }
  };

  const handleSendGreeting = async () => {
    if (!selectedMember || !customMessage || !user) return;
    try {
      await sendGreeting.mutateAsync({
        celebration_id: selectedMember.id,
        type: greetingType,
        message: customMessage,
        sent_by: user.id,
      });
      toast({ title: "Greeting sent! 🎉", description: `Your message to ${getMemberFirstName(selectedMember)} has been sent.` });
      setGreetDialogOpen(false);
      setCustomMessage("");
      setSelectedMember(null);
    } catch {
      toast({ title: "Error", description: "Failed to send greeting.", variant: "destructive" });
    }
  };

  const openGreetDialog = (member: any, type: "birthday" | "anniversary") => {
    setSelectedMember(member);
    setGreetingType(type);
    const template = GREETING_TEMPLATES[type][Math.floor(Math.random() * GREETING_TEMPLATES[type].length)];
    setCustomMessage(template.replace("{name}", getMemberFirstName(member)));
    setGreetDialogOpen(true);
  };

  const todayBirthdays = todaysCelebrations?.birthdays || [];
  const todayAnniversaries = todaysCelebrations?.anniversaries || [];
  const hasTodayCelebrations = todayBirthdays.length > 0 || todayAnniversaries.length > 0;

  return (
    <>
      <Helmet>
        <title>Celebrations | Church Hub</title>
        <meta name="description" content="Celebrate birthdays and anniversaries with your church family" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-[--font-display] text-foreground flex items-center gap-3">
                <PartyPopper className="w-8 h-8 text-primary" />
                Celebrations
              </h1>
              <p className="text-muted-foreground mt-1">
                Celebrate birthdays & anniversaries with your church family
              </p>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-accent text-primary-foreground font-semibold rounded-2xl shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Add Celebration Details
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>First Name *</Label>
                      <Input value={newMember.firstName} onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })} placeholder="John" />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input value={newMember.lastName} onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })} placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} placeholder="john@example.com" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} placeholder="+1 234 567 8900" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2"><Cake className="w-4 h-4 text-primary" /> Birthday</Label>
                    <Input type="date" value={newMember.birthday} onChange={(e) => setNewMember({ ...newMember, birthday: e.target.value })} />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2"><Heart className="w-4 h-4 text-accent" /> Wedding Anniversary</Label>
                    <Input type="date" value={newMember.weddingAnniversary} onChange={(e) => setNewMember({ ...newMember, weddingAnniversary: e.target.value })} />
                  </div>
                  <Button onClick={handleAddMember} disabled={!newMember.firstName || addCelebration.isPending} className="w-full gradient-accent text-primary-foreground rounded-2xl">
                    {addCelebration.isPending ? "Adding..." : "Add Member"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Today's celebrations banner */}
          {hasTodayCelebrations && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20"
            >
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
                🎉 Today's Celebrations
              </h2>
              <div className="flex flex-wrap gap-3">
                {todayBirthdays.map((m) => (
                  <motion.div key={m.id} whileHover={{ scale: 1.05 }} className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-md cursor-pointer" onClick={() => openGreetDialog(m, "birthday")}>
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                      <Cake className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{getMemberFirstName(m)} {getMemberLastName(m)}</p>
                      <p className="text-xs text-muted-foreground">🎂 Birthday today! {m.birthday && `Turns ${getAge(m.birthday) + 1}`}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="ml-auto text-primary"><Send className="w-4 h-4" /></Button>
                  </motion.div>
                ))}
                {todayAnniversaries.map((m) => (
                  <motion.div key={m.id} whileHover={{ scale: 1.05 }} className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-md cursor-pointer" onClick={() => openGreetDialog(m, "anniversary")}>
                    <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{getMemberFirstName(m)} {getMemberLastName(m)}</p>
                      <p className="text-xs text-muted-foreground">💍 Anniversary today! {m.weddingAnniversary && `${getAge(m.weddingAnniversary)} years`}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="ml-auto text-accent"><Send className="w-4 h-4" /></Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="birthdays" className="space-y-6">
            <TabsList className="bg-muted/50 rounded-2xl p-1">
              <TabsTrigger value="birthdays" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Cake className="w-4 h-4" />
                Birthdays
              </TabsTrigger>
              <TabsTrigger value="anniversaries" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Heart className="w-4 h-4" />
                Anniversaries
              </TabsTrigger>
            </TabsList>

            <TabsContent value="birthdays">
              {loadingBirthdays ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse rounded-2xl border-border/30">
                      <CardContent className="p-6"><div className="h-20 bg-muted rounded-xl" /></CardContent>
                    </Card>
                  ))}
                </div>
              ) : upcomingBirthdays?.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingBirthdays.map((member, index) => {
                    const daysUntil = getDaysUntil(member.birthday!);
                    const isToday = daysUntil === 0;
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`rounded-2xl border-border/30 hover:shadow-lg transition-all ${isToday ? "ring-2 ring-primary/30 bg-primary/5" : ""}`}>
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-md ${isToday ? "gradient-accent text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                                {getMemberFirstName(member).charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-foreground truncate">
                                  {getMemberFirstName(member)} {getMemberLastName(member)}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {format(new Date(member.birthday!), "MMMM d")}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant={isToday ? "default" : "secondary"} className="text-xs rounded-lg">
                                    {isToday ? "🎂 Today!" : `In ${daysUntil} day${daysUntil > 1 ? "s" : ""}`}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs rounded-lg">
                                    Turns {getAge(member.birthday!) + 1}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => openGreetDialog(member, "birthday")}
                              className="w-full mt-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                              variant="ghost"
                            >
                              <Gift className="w-4 h-4 mr-2" />
                              Send Greeting
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <Card className="rounded-2xl border-border/30">
                  <CardContent className="p-12 text-center">
                    <Cake className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground">No upcoming birthdays</h3>
                    <p className="text-sm text-muted-foreground mt-1">Add members to see their upcoming birthdays</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="anniversaries">
              {loadingAnniversaries ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse rounded-2xl border-border/30">
                      <CardContent className="p-6"><div className="h-20 bg-muted rounded-xl" /></CardContent>
                    </Card>
                  ))}
                </div>
              ) : upcomingAnniversaries?.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingAnniversaries.map((member, index) => {
                    const daysUntil = getDaysUntil(member.weddingAnniversary!);
                    const isToday = daysUntil === 0;
                    const years = getAge(member.weddingAnniversary!);
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`rounded-2xl border-border/30 hover:shadow-lg transition-all ${isToday ? "ring-2 ring-accent/30 bg-accent/5" : ""}`}>
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-md ${isToday ? "bg-accent text-accent-foreground" : "bg-accent/10 text-accent"}`}>
                                {getMemberFirstName(member).charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-foreground truncate">
                                  {getMemberFirstName(member)} {getMemberLastName(member)}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {format(new Date(member.weddingAnniversary!), "MMMM d")}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant={isToday ? "default" : "secondary"} className="text-xs rounded-lg">
                                    {isToday ? "💍 Today!" : `In ${daysUntil} day${daysUntil > 1 ? "s" : ""}`}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs rounded-lg">
                                    {years + 1} years
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => openGreetDialog(member, "anniversary")}
                              className="w-full mt-4 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 font-medium"
                              variant="ghost"
                            >
                              <Gift className="w-4 h-4 mr-2" />
                              Send Greeting
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <Card className="rounded-2xl border-border/30">
                  <CardContent className="p-12 text-center">
                    <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground">No upcoming anniversaries</h3>
                    <p className="text-sm text-muted-foreground mt-1">Add members to see their upcoming anniversaries</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Send Greeting Dialog */}
      <Dialog open={greetDialogOpen} onOpenChange={setGreetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Send {greetingType === "birthday" ? "Birthday" : "Anniversary"} Greeting
            </DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-2xl">
                <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-primary-foreground font-bold">
                  {getMemberFirstName(selectedMember).charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{getMemberFirstName(selectedMember)} {getMemberLastName(selectedMember)}</p>
                  <p className="text-xs text-muted-foreground">
                    {greetingType === "birthday" ? "🎂 Birthday" : "💍 Anniversary"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quick Templates</Label>
                <div className="flex flex-wrap gap-2">
                  {GREETING_TEMPLATES[greetingType].map((template, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-xl"
                      onClick={() => setCustomMessage(template.replace("{name}", getMemberFirstName(selectedMember)))}
                    >
                      Template {i + 1}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Message</Label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  className="rounded-xl mt-1"
                  placeholder="Write your greeting message..."
                />
              </div>

              <Button
                onClick={handleSendGreeting}
                disabled={!customMessage || sendGreeting.isPending}
                className="w-full gradient-accent text-primary-foreground rounded-2xl"
              >
                <Send className="w-4 h-4 mr-2" />
                {sendGreeting.isPending ? "Sending..." : "Send Greeting"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
