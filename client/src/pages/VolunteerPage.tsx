import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { buildApiUrl } from "@/lib/api-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Users, Plus, CheckCircle, Star, Award } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";

interface VolunteerOpportunity {
  id: number;
  title: string;
  description: string | null;
  requiredSkills: number[];
  date: string;
  duration: number | null;
  location: string | null;
  spotsAvailable: number | null;
  spotsFilled: number;
  createdBy: string | null;
  createdAt: string;
  isActive: boolean;
}

interface VolunteerAssignment {
  id: number;
  volunteerId: string;
  opportunityId: number;
  status: string;
  checkInAt: string | null;
  checkOutAt: string | null;
  hoursWorked: number;
}

async function fetchOpportunities(): Promise<VolunteerOpportunity[]> {
  const response = await fetch(buildApiUrl("/api/volunteer/opportunities"));
  if (!response.ok) throw new Error("Failed to fetch opportunities");
  return response.json();
}

async function fetchMyAssignments(): Promise<VolunteerAssignment[]> {
  const response = await fetch(buildApiUrl("/api/volunteer/assignments"));
  if (!response.ok) throw new Error("Failed to fetch assignments");
  return response.json();
}

async function fetchSkills() {
  const response = await fetch(buildApiUrl("/api/volunteer/skills"));
  if (!response.ok) throw new Error("Failed to fetch skills");
  return response.json();
}

async function createOpportunity(data: Partial<VolunteerOpportunity>) {
  const response = await fetch(buildApiUrl("/api/volunteer/opportunities"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create opportunity");
  return response.json();
}

async function signUp(opportunityId: number) {
  const response = await fetch(buildApiUrl("/api/volunteer/assignments"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ opportunityId }),
  });
  if (!response.ok) throw new Error("Failed to sign up");
  return response.json();
}

export default function VolunteerPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    description: "",
    date: "",
    duration: 60,
    location: "",
    spotsAvailable: 5,
  });

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["volunteer-opportunities"],
    queryFn: fetchOpportunities,
  });

  const { data: assignments } = useQuery({
    queryKey: ["volunteer-assignments"],
    queryFn: fetchMyAssignments,
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: createOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer-opportunities"] });
      setShowCreateDialog(false);
      setNewOpportunity({ title: "", description: "", date: "", duration: 60, location: "", spotsAvailable: 5 });
      toast({ title: "Success", description: "Opportunity created successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create opportunity", variant: "destructive" });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer-assignments"] });
      toast({ title: "Success", description: "You've signed up to volunteer!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to sign up", variant: "destructive" });
    },
  });

  const isAdmin = user?.isAdmin;
  const activeOpportunities = opportunities?.filter(o => o.isActive && isAfter(parseISO(o.date), new Date())) || [];
  const myOpportunityIds = assignments?.map(a => a.opportunityId) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Only show page if there are active opportunities OR user is admin
  if (activeOpportunities.length === 0 && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">No Volunteer Opportunities</h2>
          <p className="text-gray-500">Check back later for volunteer opportunities in our community.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Volunteer</h1>
          <p className="text-gray-600 mt-1">Serve our community and grow in faith together</p>
        </div>
        
        {isAdmin && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Volunteer Opportunity</DialogTitle>
                <DialogDescription>
                  Create a new volunteer opportunity for the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newOpportunity.title}
                    onChange={e => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                    placeholder="e.g., Welcome Team Volunteer"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOpportunity.description}
                    onChange={e => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
                    placeholder="Describe the volunteer role..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date & Time</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={newOpportunity.date}
                      onChange={e => setNewOpportunity({ ...newOpportunity, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newOpportunity.duration}
                      onChange={e => setNewOpportunity({ ...newOpportunity, duration: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newOpportunity.location}
                    onChange={e => setNewOpportunity({ ...newOpportunity, location: e.target.value })}
                    placeholder="e.g., Main Sanctuary"
                  />
                </div>
                <div>
                  <Label htmlFor="spots">Available Spots</Label>
                  <Input
                    id="spots"
                    type="number"
                    value={newOpportunity.spotsAvailable}
                    onChange={e => setNewOpportunity({ ...newOpportunity, spotsAvailable: parseInt(e.target.value) })}
                  />
                </div>
                <Button
                  onClick={() => createMutation.mutate({
                    ...newOpportunity,
                    date: new Date(newOpportunity.date).toISOString(),
                  })}
                  disabled={createMutation.isPending || !newOpportunity.title || !newOpportunity.date}
                  className="w-full"
                >
                  {createMutation.isPending ? "Creating..." : "Create Opportunity"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* User's Assignments */}
      {assignments && assignments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            My Volunteer Assignments
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map(assignment => {
              const opp = opportunities?.find(o => o.id === assignment.opportunityId);
              if (!opp) return null;
              return (
                <Card key={assignment.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{opp.title}</CardTitle>
                    <Badge variant={assignment.status === "confirmed" ? "default" : "secondary"}>
                      {assignment.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(parseISO(opp.date), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                      {opp.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {opp.location}
                        </div>
                      )}
                      {assignment.hoursWorked > 0 && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {assignment.hoursWorked} hours logged
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Opportunities */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Available Opportunities
        </h2>
        
        {activeOpportunities.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No volunteer opportunities available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeOpportunities.map(opportunity => {
              const spotsLeft = opportunity.spotsAvailable ? opportunity.spotsAvailable - opportunity.spotsFilled : null;
              const isSignedUp = myOpportunityIds.includes(opportunity.id);
              
              return (
                <Card key={opportunity.id} className={isSignedUp ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      {spotsLeft !== null && (
                        <Badge variant={spotsLeft > 0 ? "default" : "destructive"}>
                          {spotsLeft} spots left
                        </Badge>
                      )}
                    </div>
                    {opportunity.description && (
                      <CardDescription>{opportunity.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(parseISO(opportunity.date), "EEEE, MMM d 'at' h:mm a")}
                      </div>
                      {opportunity.duration && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {opportunity.duration} minutes
                        </div>
                      )}
                      {opportunity.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {opportunity.location}
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {opportunity.spotsFilled} / {opportunity.spotsAvailable || "∞"} volunteers
                      </div>
                    </div>
                    
                    {user ? (
                      isSignedUp ? (
                        <Button disabled className="w-full bg-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Signed Up
                        </Button>
                      ) : spotsLeft !== null && spotsLeft <= 0 ? (
                        <Button disabled className="w-full">
                          No Spots Available
                        </Button>
                      ) : (
                        <Button
                          onClick={() => signUpMutation.mutate(opportunity.id)}
                          disabled={signUpMutation.isPending}
                          className="w-full"
                        >
                          {signUpMutation.isPending ? "Signing up..." : "Sign Up to Volunteer"}
                        </Button>
                      )
                    ) : (
                      <Button asChild className="w-full">
                        <a href="/login">Login to Volunteer</a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Volunteer Stats for logged in users */}
      {user && assignments && assignments.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <Award className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hours Served</CardTitle>
              <Clock className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignments.reduce((acc, a) => acc + a.hoursWorked, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Star className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {assignments.some(a => a.status === "confirmed") ? "Active" : "Pending"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
