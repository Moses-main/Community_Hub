import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useBranding, type Branding } from "@/hooks/use-branding";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Users, Shield, Calendar, FileText, Plus, Trash2, Edit, Palette, Heart } from "lucide-react";
import { apiRoutes } from "@/lib/api-routes";
import { buildApiUrl } from "@/lib/api-config";
import type { Event, Sermon, InsertEvent, InsertSermon, UserRole } from "@/types/api";
import { USER_ROLES } from "@/types/api";

interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  houseFellowship?: string;
  parish?: string;
  role?: UserRole;
  isVerified?: boolean;
  createdAt: string;
  isAdmin: boolean;
}

function BrandingForm({ branding, onSubmit, isLoading }: { branding: Branding | undefined; onSubmit: (data: Partial<Branding>) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    primary: branding?.colors?.primary || "#3b82f6",
    secondary: branding?.colors?.secondary || "#f8fafc",
    accent: branding?.colors?.accent || "#10b981",
    headingFont: branding?.fonts?.heading || "Inter",
    bodyFont: branding?.fonts?.body || "Inter",
    logoUrl: branding?.logoUrl || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      colors: {
        primary: formData.primary,
        secondary: formData.secondary,
        accent: formData.accent,
      },
      fonts: {
        heading: formData.headingFont,
        body: formData.bodyFont,
      },
      logoUrl: formData.logoUrl || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="primary">Primary Color</Label>
          <div className="flex gap-2 mt-1">
            <Input type="color" value={formData.primary} onChange={e => setFormData({...formData, primary: e.target.value})} className="w-12 h-10 p-1" />
            <Input value={formData.primary} onChange={e => setFormData({...formData, primary: e.target.value})} className="flex-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="secondary">Secondary Color</Label>
          <div className="flex gap-2 mt-1">
            <Input type="color" value={formData.secondary} onChange={e => setFormData({...formData, secondary: e.target.value})} className="w-12 h-10 p-1" />
            <Input value={formData.secondary} onChange={e => setFormData({...formData, secondary: e.target.value})} className="flex-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="accent">Accent Color</Label>
          <div className="flex gap-2 mt-1">
            <Input type="color" value={formData.accent} onChange={e => setFormData({...formData, accent: e.target.value})} className="w-12 h-10 p-1" />
            <Input value={formData.accent} onChange={e => setFormData({...formData, accent: e.target.value})} className="flex-1" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="headingFont">Heading Font</Label>
          <Input id="headingFont" value={formData.headingFont} onChange={e => setFormData({...formData, headingFont: e.target.value})} placeholder="e.g., Inter, Poppins" />
        </div>
        <div>
          <Label htmlFor="bodyFont">Body Font</Label>
          <Input id="bodyFont" value={formData.bodyFont} onChange={e => setFormData({...formData, bodyFont: e.target.value})} placeholder="e.g., Inter, Open Sans" />
        </div>
      </div>

      <div>
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input id="logoUrl" value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} placeholder="https://..." />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Branding
        </Button>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: formData.primary }} />
            <span className="text-sm">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: formData.secondary }} />
            <span className="text-sm">Secondary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: formData.accent }} />
            <span className="text-sm">Accent</span>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function AdminDashboardPage() {
  const { user, isLoading: isUserLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading: isUsersLoading, refetch: refetchUsers } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const response = await fetch(buildApiUrl(apiRoutes.admin.users), {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
    enabled: user?.isAdmin === true,
  });

  const { data: events, isLoading: isEventsLoading, refetch: refetchEvents } = useQuery<Event[]>({
    queryKey: [apiRoutes.events.list],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(apiRoutes.events.list));
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const { data: sermons, isLoading: isSermonsLoading, refetch: refetchSermons } = useQuery<Sermon[]>({
    queryKey: [apiRoutes.sermons.list],
    queryFn: async () => {
      const res = await fetch(buildApiUrl(apiRoutes.sermons.list));
      if (!res.ok) throw new Error("Failed to fetch sermons");
      return res.json();
    },
  });

  const createEvent = useMutation({
    mutationFn: async (data: InsertEvent) => {
      const res = await fetch(buildApiUrl(apiRoutes.events.create), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.events.list] });
      toast({ title: "Event created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create event", variant: "destructive" });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(buildApiUrl(`/api/events/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete event");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.events.list] });
      toast({ title: "Event deleted" });
    },
  });

  const createSermon = useMutation({
    mutationFn: async (data: InsertSermon) => {
      const res = await fetch(buildApiUrl(apiRoutes.sermons.create), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create sermon");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.sermons.list] });
      toast({ title: "Sermon created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create sermon", variant: "destructive" });
    },
  });

  const deleteSermon = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(buildApiUrl(`/api/sermons/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete sermon");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.sermons.list] });
      toast({ title: "Sermon deleted" });
    },
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const res = await fetch(buildApiUrl(`/api/admin/users/${userId}/role`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update user role");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Role updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update role", variant: "destructive" });
    },
  });

  const { data: branding, isLoading: isBrandingLoading } = useBranding();
  const updateBranding = useMutation({
    mutationFn: async (data: Partial<Branding>) => {
      const res = await fetch(buildApiUrl("/api/branding"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update branding");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/branding"] });
      toast({ title: "Branding updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update branding", variant: "destructive" });
    },
  });

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Admin access required.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <Helmet>
        <title>Admin Dashboard | WCCRM Lagos</title>
      </Helmet>

      <div className="container px-4 md:px-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your church platform</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="users" className="gap-2 rounded-md">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2 rounded-md">
              <Calendar className="h-4 w-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="sermons" className="gap-2 rounded-md">
              <FileText className="h-4 w-4" /> Sermons
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2 rounded-md">
              <Palette className="h-4 w-4" /> Branding
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-2 rounded-md">
              <Shield className="h-4 w-4" /> Overview
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">User Management</CardTitle>
                <CardDescription className="text-gray-500">View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                {isUsersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Parish</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">House Fellowship</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Verified</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users?.map((u) => (
                          <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-900">
                              {u.firstName ? `${u.firstName} ${u.lastName || ''}` : '-'}
                            </td>
                            <td className="py-3 px-4 text-gray-600">{u.email}</td>
                            <td className="py-3 px-4 text-gray-500">{u.phone || '-'}</td>
                            <td className="py-3 px-4 text-gray-500">{u.parish || '-'}</td>
                            <td className="py-3 px-4 text-gray-500">{u.houseFellowship || '-'}</td>
                            <td className="py-3 px-4">
                              {u.isVerified ? (
                                <Badge className="bg-green-500 text-white">Verified</Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600">Pending</Badge>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-500">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="py-3 px-4">
                              <Select
                                value={u.role || 'MEMBER'}
                                onValueChange={(value) => {
                                  if (value !== u.role) {
                                    updateUserRole.mutate({ userId: u.id, role: value as UserRole });
                                  }
                                }}
                                disabled={updateUserRole.isPending}
                              >
                                <SelectTrigger className="w-[160px] bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200 shadow-xl">
                                  {USER_ROLES.map((role) => (
                                    <SelectItem key={role.value} value={role.value} className="cursor-pointer">
                                      {role.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users?.length === 0 && (
                      <p className="text-center py-8 text-gray-500">No users found</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Event Management</CardTitle>
                  <CardDescription>Create and manage church events</CardDescription>
                </div>
                <CreateEventDialog onSubmit={(data) => createEvent.mutate(data)} isLoading={createEvent.isPending} />
              </CardHeader>
              <CardContent>
                {isEventsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events?.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()} • {event.location}
                          </p>
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => deleteEvent.mutate(event.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {events?.length === 0 && (
                      <p className="text-center py-8 text-muted-foreground">No events yet</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sermons Tab */}
          <TabsContent value="sermons">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sermon Management</CardTitle>
                  <CardDescription>Create and manage sermons</CardDescription>
                </div>
                <CreateSermonDialog onSubmit={(data) => createSermon.mutate(data)} isLoading={createSermon.isPending} />
              </CardHeader>
              <CardContent>
                {isSermonsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sermons?.map((sermon) => (
                      <div key={sermon.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{sermon.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {sermon.speaker} • {new Date(sermon.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => deleteSermon.mutate(sermon.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {sermons?.length === 0 && (
                      <p className="text-center py-8 text-muted-foreground">No sermons yet</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>Customize the appearance of your church website</CardDescription>
              </CardHeader>
              <CardContent>
                {isBrandingLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <BrandingForm 
                    branding={branding} 
                    onSubmit={(data) => updateBranding.mutate(data)}
                    isLoading={updateBranding.isPending}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Registered members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {users?.filter(u => u.isAdmin).length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Admin accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{events?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Total events</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Sermons</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sermons?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Total sermons</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CreateEventDialog({ onSubmit, isLoading }: { onSubmit: (data: InsertEvent) => void; isLoading: boolean }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", date: "", location: "", imageUrl: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
      location: formData.location,
      imageUrl: formData.imageUrl || undefined,
    });
    setOpen(false);
    setFormData({ title: "", description: "", date: "", location: "", imageUrl: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateSermonDialog({ onSubmit, isLoading }: { onSubmit: (data: InsertSermon) => void; isLoading: boolean }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", speaker: "", date: "", series: "", description: "", videoUrl: "", audioUrl: "", thumbnailUrl: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      speaker: formData.speaker,
      date: new Date(formData.date).toISOString(),
      series: formData.series || undefined,
      description: formData.description || undefined,
      videoUrl: formData.videoUrl || undefined,
      audioUrl: formData.audioUrl || undefined,
      thumbnailUrl: formData.thumbnailUrl || undefined,
    });
    setOpen(false);
    setFormData({ title: "", speaker: "", date: "", series: "", description: "", videoUrl: "", audioUrl: "", thumbnailUrl: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Sermon</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Sermon</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="speaker">Speaker</Label>
              <Input id="speaker" value={formData.speaker} onChange={e => setFormData({...formData, speaker: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="sermonDate">Date</Label>
              <Input id="sermonDate" type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="series">Series</Label>
              <Input id="series" value={formData.series} onChange={e => setFormData({...formData, series: e.target.value})} placeholder="Optional" />
            </div>
          </div>
          <div>
            <Label htmlFor="sermonDescription">Description</Label>
            <Textarea id="sermonDescription" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input id="videoUrl" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} placeholder="https://youtube.com/..." />
            </div>
            <div>
              <Label htmlFor="audioUrl">Audio URL</Label>
              <Input id="audioUrl" value={formData.audioUrl} onChange={e => setFormData({...formData, audioUrl: e.target.value})} placeholder="https://..." />
            </div>
          </div>
          <div>
            <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
            <Input id="thumbnailUrl" value={formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} placeholder="https://..." />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Sermon
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
