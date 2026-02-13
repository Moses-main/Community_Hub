import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMyPrayerRequests } from "@/hooks/use-prayer";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { buildApiUrl } from "@/lib/api-config";
import { User, Mail, Calendar, Shield, Heart, Loader2, Phone, MapPin, Home, Building, Edit } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { user, isLoading, refetch } = useAuth();
  const { data: myPrayers, isLoading: isPrayersLoading } = useMyPrayerRequests();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    houseFellowship: user?.houseFellowship || "",
    parish: (user as any)?.parish || "",
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
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <Helmet>
        <title>Dashboard | WCCRM Lagos</title>
      </Helmet>

      <div className="container px-4 md:px-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">My Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user.firstName || user.email}!</p>
          </div>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
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
                    const res = await fetch(buildApiUrl("/api/auth/profile"), {
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
                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </form>
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
                <Building className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Parish</p>
                  <p className="font-medium text-gray-900">{(user as any).parish || "Not set"}</p>
                </div>
              </div>
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
        </div>
      </div>
    </div>
  );
}
