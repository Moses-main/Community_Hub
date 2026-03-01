import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMyPrayerRequests } from "@/hooks/use-prayer";
import { useUserRsvps } from "@/hooks/use-events";
import { useMyMessages, useUnreadCount, useMarkAsRead, useSendMessage, useReplyToMessage } from "@/hooks/use-messages";
import { usePermissions } from "@/hooks/use-permissions";
import { useAbsentMembers } from "@/hooks/use-attendance";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { buildApiUrl } from "@/lib/api-config";
import { User, Mail, Calendar, Shield, Heart, Loader2, Phone, MapPin, Home, Building, Edit, MessageSquare, Bell, Check, Users, UserX, Send, Reply } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow, format } from "date-fns";

export default function DashboardPage() {
  const { user, isLoading, refetch } = useAuth();
  const { data: myPrayers, isLoading: isPrayersLoading } = useMyPrayerRequests();
  const { data: userRsvps, isLoading: isRsvpsLoading } = useUserRsvps();
  const { data: myMessages, isLoading: isMessagesLoading } = useMyMessages();
  const { data: unreadCount } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const sendMessage = useSendMessage();
  const replyToMessage = useReplyToMessage();
  const { canViewAbsentMembers, canFollowUpAbsent, canSendMessages } = usePermissions();
  const { data: absentMembers, isLoading: isAbsentLoading, error: absentError } = useAbsentMembers(3);
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showAbsentActions, setShowAbsentActions] = useState<string | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    houseFellowship: user?.houseFellowship || "",
    parish: (user as any)?.parish || "",
    houseCellLocation: user?.houseCellLocation || "",
    career: (user as any)?.career || "",
    stateOfOrigin: (user as any)?.stateOfOrigin || "",
    birthday: (user as any)?.birthday ? new Date((user as any).birthday).toISOString().split('T')[0] : "",
    twitterHandle: (user as any)?.twitterHandle || "",
    instagramHandle: (user as any)?.instagramHandle || "",
    facebookHandle: (user as any)?.facebookHandle || "",
    linkedinHandle: (user as any)?.linkedinHandle || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: user.address || "",
        houseFellowship: user.houseFellowship || "",
        parish: (user as any)?.parish || "",
        houseCellLocation: user.houseCellLocation || "",
        career: (user as any)?.career || "",
        stateOfOrigin: (user as any)?.stateOfOrigin || "",
        birthday: (user as any)?.birthday ? new Date((user as any).birthday).toISOString().split('T')[0] : "",
        twitterHandle: (user as any)?.twitterHandle || "",
        instagramHandle: (user as any)?.instagramHandle || "",
        facebookHandle: (user as any)?.facebookHandle || "",
        linkedinHandle: (user as any)?.linkedinHandle || "",
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 py-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-3 py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-6">
      <Helmet>
        <title>Dashboard | CHub</title>
      </Helmet>

      <div className="container px-3 md:px-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-display font-bold text-gray-900 mb-1 md:mb-2">My Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user.firstName || user.email}!</p>
          </div>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Edit className="mr-1.5 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Edit Profile</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Update your personal information</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsUpdating(true);
                  try {
                    const res = await fetch(buildApiUrl("/api/members/me"), {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify(formData),
                    });
                    if (res.ok) {
                      await refetch();
                      setIsEditOpen(false);
                      toast({ title: "Profile updated successfully" });
                    } else {
                      toast({ title: "Failed to update profile", variant: "destructive" });
                    }
                  } catch {
                    toast({ title: "Error updating profile", variant: "destructive" });
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your address"
                  />
                </div>
                <div>
                  <Label htmlFor="parish">Parish</Label>
                  <Input
                    id="parish"
                    value={formData.parish}
                    onChange={(e) => setFormData({ ...formData, parish: e.target.value })}
                    placeholder="Enter your parish"
                  />
                </div>
                <div>
                  <Label htmlFor="houseFellowship">House Fellowship</Label>
                  <Input
                    id="houseFellowship"
                    value={formData.houseFellowship}
                    onChange={(e) => setFormData({ ...formData, houseFellowship: e.target.value })}
                    placeholder="Enter your house fellowship"
                  />
                </div>
                <div>
                  <Label htmlFor="houseCellLocation">House Cell Location</Label>
                  <Input
                    id="houseCellLocation"
                    value={formData.houseCellLocation}
                    onChange={(e) => setFormData({ ...formData, houseCellLocation: e.target.value })}
                    placeholder="Enter your house cell location"
                  />
                </div>
                <div>
                  <Label htmlFor="career">Career / Profession</Label>
                  <Input
                    id="career"
                    value={formData.career}
                    onChange={(e) => setFormData({ ...formData, career: e.target.value })}
                    placeholder="e.g., Software Engineer, Teacher"
                  />
                </div>
                <div>
                  <Label htmlFor="stateOfOrigin">State of Origin</Label>
                  <Input
                    id="stateOfOrigin"
                    value={formData.stateOfOrigin}
                    onChange={(e) => setFormData({ ...formData, stateOfOrigin: e.target.value })}
                    placeholder="Enter your state of origin"
                  />
                </div>
                <div>
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  />
                </div>
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium mb-2 block">Social Media Handles</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="twitterHandle">Twitter</Label>
                    <Input
                      id="twitterHandle"
                      value={formData.twitterHandle}
                      onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagramHandle">Instagram</Label>
                    <Input
                      id="instagramHandle"
                      value={formData.instagramHandle}
                      onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebookHandle">Facebook</Label>
                    <Input
                      id="facebookHandle"
                      value={formData.facebookHandle}
                      onChange={(e) => setFormData({ ...formData, facebookHandle: e.target.value })}
                      placeholder="Facebook profile"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedinHandle">LinkedIn</Label>
                    <Input
                      id="linkedinHandle"
                      value={formData.linkedinHandle}
                      onChange={(e) => setFormData({ ...formData, linkedinHandle: e.target.value })}
                      placeholder="LinkedIn profile"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedMessage?.priority === 'high' && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Urgent</span>
                  )}
                  {selectedMessage?.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedMessage && format(new Date(selectedMessage.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage?.content}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">Profile Information</CardTitle>
                <CardDescription className="text-gray-500">Your account details</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}` : "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{user.address || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">House Fellowship</p>
                  <p className="font-medium text-gray-900">{user.houseFellowship || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">House Cell Location</p>
                  <p className="font-medium text-gray-900">{user.houseCellLocation || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Parish</p>
                  <p className="font-medium text-gray-900">{(user as any).parish || "Not set"}</p>
                </div>
              </div>
              {(user as any).career && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Career</p>
                    <p className="font-medium text-gray-900">{(user as any).career}</p>
                  </div>
                </div>
              )}
              {(user as any).stateOfOrigin && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">State of Origin</p>
                    <p className="font-medium text-gray-900">{(user as any).stateOfOrigin}</p>
                  </div>
                </div>
              )}
              {(user as any).birthday && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Birthday</p>
                    <p className="font-medium text-gray-900">{new Date((user as any).birthday).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">Account Status</CardTitle>
                <CardDescription className="text-gray-500">Your membership details</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                My Messages
                {unreadCount?.count ? (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount.count} new
                  </span>
                ) : null}
              </CardTitle>
              <CardDescription className="text-gray-500">Updates from your pastors and church leaders</CardDescription>
            </CardHeader>
            <CardContent>
              {isMessagesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : myMessages && myMessages.length > 0 ? (
                <div className="space-y-3">
                  {myMessages.slice(0, 5).map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 rounded-lg transition-colors ${
                        message.isRead ? 'bg-gray-50' : 'bg-primary/5 border-l-4 border-primary'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            if (!message.isRead) {
                              markAsRead.mutate(message.id);
                            }
                            setSelectedMessage(message);
                            setIsReplying(false);
                            setReplyContent("");
                          }}
                        >
                          <p className="font-medium text-gray-900 truncate">{message.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{message.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {message.priority === 'high' && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Urgent</span>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessage(message);
                              setIsReplying(true);
                            }}
                          >
                            <Reply className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {selectedMessage?.id === message.id && isReplying && (
                        <div className="mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                          <Textarea
                            placeholder="Type your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                            className="mb-2"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => { setIsReplying(false); setReplyContent(""); }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm"
                              disabled={!replyContent.trim() || replyToMessage.isPending}
                              onClick={async () => {
                                try {
                                  await replyToMessage.mutateAsync({
                                    messageId: message.id,
                                    content: replyContent
                                  });
                                  toast({ title: "Reply sent", description: "Your response has been sent." });
                                  setReplyContent("");
                                  setIsReplying(false);
                                } catch {
                                  toast({ title: "Failed to send reply", variant: "destructive" });
                                }
                              }}
                            >
                              {replyToMessage.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <Send className="h-3 w-3 mr-1" />
                                  Send
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {myMessages.length > 5 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/messages"><span>View All Messages ({myMessages.length})</span></Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No messages yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                My Prayer Requests
              </CardTitle>
              <CardDescription className="text-gray-500">Your prayer requests and how many are praying</CardDescription>
            </CardHeader>
            <CardContent>
              {isPrayersLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : myPrayers && myPrayers.length > 0 ? (
                <div className="space-y-3">
                  {myPrayers.slice(0, 5).map((prayer) => (
                    <div key={prayer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{prayer.content}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(prayer.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-4 text-primary">
                        <Heart className="h-4 w-4 fill-current" />
                        <span className="font-semibold">{prayer.prayCount || 0}</span>
                      </div>
                    </div>
                  ))}
                  {myPrayers.length > 5 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/prayer"><span>View All ({myPrayers.length})</span></Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>You haven't submitted any prayer requests yet.</p>
                  <Button variant="ghost" asChild className="mt-2">
                    <Link href="/prayer">Share a Prayer Request</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                My Interested Events
              </CardTitle>
              <CardDescription className="text-gray-500">Events you've RSVP'd to</CardDescription>
            </CardHeader>
            <CardContent>
              {isRsvpsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : userRsvps && userRsvps.length > 0 ? (
                <div className="space-y-3">
                  {userRsvps.slice(0, 5).map((rsvp: any) => (
                    rsvp.event && (
                      <Link key={rsvp.id} href={`/events/${rsvp.event.id}`}>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{rsvp.event.title}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(rsvp.event.date), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          {rsvp.addedToCalendar && (
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Added to Calendar
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                  ))}
                  {userRsvps.length > 5 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/events"><span>View All Events</span></Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>You haven't RSVP'd to any events yet.</p>
                  <Button variant="ghost" asChild className="mt-2">
                    <Link href="/events">Browse Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-gray-500">Common tasks and links</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button variant="outline" asChild>
                  <Link href="/prayer">Submit Prayer Request</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/events">View Events</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/sermons">Watch Sermons</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/give">Give</Link>
                </Button>
              </CardContent>
            </Card>

            {canViewAbsentMembers() && (
              <Card className="md:col-span-2 border border-amber-200 shadow-sm bg-amber-50/50">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <UserX className="h-5 w-5 text-amber-600" />
                    Members Needing Follow-up
                    {absentMembers && absentMembers.length > 0 && (
                      <span className="ml-auto text-sm font-normal text-amber-700">
                        {absentMembers.length} absent
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Members who have missed recent services - reach out to them!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAbsentLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : absentError ? (
                    <div className="text-center py-4 text-red-500">
                      <p>Failed to load absent members</p>
                      <p className="text-xs text-gray-500">{(absentError as Error).message}</p>
                    </div>
                  ) : absentMembers && absentMembers.length > 0 ? (
                    <div className="space-y-3">
                      {absentMembers.slice(0, 5).map((member) => (
                        <div key={member.userId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-amber-100">
                              <UserX className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {member.firstName || "Member"} {member.lastName || ""}
                              </p>
                              <p className="text-xs text-gray-500">
                                Missed {member.missedCount} services
                              </p>
                            </div>
                          </div>
                          {canFollowUpAbsent() && canSendMessages() && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  console.log('Button clicked, sending to:', member.userId);
                                  alert('Sending message to ' + (member.firstName || member.email));
                                  try {
                                    const result = await sendMessage.mutateAsync({
                                      userId: member.userId,
                                      type: 'GENERAL',
                                      title: 'We Miss You!',
                                      content: `Dear ${member.firstName || 'Brother/Sister'},\n\nWe noticed you haven't been with us for the past ${member.missedCount} services. We truly miss seeing you!\n\nPlease know that you are always welcome. Let us know if there's anything we can do to support you.\n\nLooking forward to seeing you soon!\n\nGrace and Peace,\nCHub`,
                                      priority: 'normal'
                                    });
                                    console.log('Message sent successfully:', result);
                                    toast({ 
                                      title: "Message sent! ✅", 
                                      description: `${member.firstName || 'Member'} will be removed from the absent list for 7 days.` 
                                    });
                                  } catch (err: any) {
                                    console.error('Error sending message:', err);
                                    toast({ 
                                      title: "Failed to send message", 
                                      description: err.message || "You may not have permission.", 
                                      variant: "destructive" 
                                    });
                                  }
                                }}
                                disabled={sendMessage.isPending}
                              >
                                {sendMessage.isPending ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <Send className="h-3 w-3 mr-1" />
                                )}
                                Send Message
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      {absentMembers.length > 5 && (
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/attendance/absent">
                            <Users className="h-4 w-4 mr-2" />
                            View All {absentMembers.length} Members
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p>All members are active!</p>
                      <p className="text-sm">No absent members detected at this time.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
