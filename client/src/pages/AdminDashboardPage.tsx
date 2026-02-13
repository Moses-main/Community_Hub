import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Users, Shield, Calendar, FileText, Plus, Trash2, Edit, Palette, Heart } from "lucide-react";
import { apiRoutes } from "@/lib/api-routes";
import { buildApiUrl } from "@/lib/api-config";
import type { Event, Sermon, InsertEvent, InsertSermon } from "@/types/api";

interface AdminUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  isAdmin: boolean;
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
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Admin Dashboard | WCCRM Lagos</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your church platform</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="sermons" className="gap-2">
              <FileText className="h-4 w-4" /> Sermons
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-2">
              <Shield className="h-4 w-4" /> Overview
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
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
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">ID</th>
                          <th className="text-left py-3 px-4 font-medium">Name</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium">Joined</th>
                          <th className="text-left py-3 px-4 font-medium">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users?.map((u) => (
                          <tr key={u.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 text-muted-foreground">#{u.id}</td>
                            <td className="py-3 px-4 font-medium">
                              {u.firstName ? `${u.firstName} ${u.lastName || ''}` : '-'}
                            </td>
                            <td className="py-3 px-4">{u.email}</td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="py-3 px-4">
                              {u.isAdmin ? (
                                <Badge className="bg-primary">Admin</Badge>
                              ) : (
                                <Badge variant="secondary">Member</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users?.length === 0 && (
                      <p className="text-center py-8 text-muted-foreground">No users found</p>
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
