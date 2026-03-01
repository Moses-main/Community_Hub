import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { buildApiUrl } from "@/lib/api-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Eye, Building2, Users, Calendar, Loader2, Search } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  churchName: string | null;
  churchEmail: string | null;
  createdAt: string;
}

async function fetchOrganizations(): Promise<Organization[]> {
  const res = await fetch(buildApiUrl("/api/super-admin/organizations"), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch organizations");
  return res.json();
}

async function createOrganization(data: Partial<Organization>) {
  const res = await fetch(buildApiUrl("/api/super-admin/organizations"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create organization");
  return res.json();
}

async function updateOrganization(id: string, data: Partial<Organization>) {
  const res = await fetch(buildApiUrl(`/api/super-admin/organizations/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update organization");
  return res.json();
}

async function deleteOrganization(id: string) {
  const res = await fetch(buildApiUrl(`/api/super-admin/organizations/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete organization");
}

export default function SuperAdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logoUrl: "",
    churchName: "",
    churchEmail: "",
    churchPhone: "",
    churchAddress: "",
    churchCity: "",
    churchState: "",
    churchCountry: "",
    isActive: true,
  });

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
    enabled: !!user?.isSuperAdmin,
  });

  const createMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setShowCreateDialog(false);
      resetForm();
      toast({ title: "Organization created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create organization", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Organization> }) => updateOrganization(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setEditingOrg(null);
      resetForm();
      toast({ title: "Organization updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update organization", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast({ title: "Organization deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete organization", variant: "destructive" });
    },
  });

  function resetForm() {
    setFormData({
      name: "",
      slug: "",
      description: "",
      logoUrl: "",
      churchName: "",
      churchEmail: "",
      churchPhone: "",
      churchAddress: "",
      churchCity: "",
      churchState: "",
      churchCountry: "",
      isActive: true,
    });
  }

  function openEditDialog(org: Organization) {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      slug: org.slug,
      description: org.description || "",
      logoUrl: org.logoUrl || "",
      churchName: org.churchName || "",
      churchEmail: "",
      churchPhone: "",
      churchAddress: "",
      churchCity: "",
      churchState: "",
      churchCountry: "",
      isActive: org.isActive,
    });
  }

  function handleSubmit() {
    if (editingOrg) {
      updateMutation.mutate({ id: editingOrg.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  const filteredOrgs = organizations?.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.churchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.slug.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (!user?.isSuperAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600">
                You need super admin privileges to access this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-600">Manage all organizations on the platform</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., WCCRM Lagos"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug * (unique URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="e.g., wccrm-lagos"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the organization"
                />
              </div>
              <div>
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="border-t pt-4">
                <Label className="text-sm font-medium mb-2 block">Church Details</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="churchName">Church Name</Label>
                  <Input
                    id="churchName"
                    value={formData.churchName}
                    onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="churchEmail">Church Email</Label>
                  <Input
                    id="churchEmail"
                    type="email"
                    value={formData.churchEmail}
                    onChange={(e) => setFormData({ ...formData, churchEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="churchPhone">Phone</Label>
                  <Input
                    id="churchPhone"
                    value={formData.churchPhone}
                    onChange={(e) => setFormData({ ...formData, churchPhone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="churchCity">City</Label>
                  <Input
                    id="churchCity"
                    value={formData.churchCity}
                    onChange={(e) => setFormData({ ...formData, churchCity: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending || !formData.name || !formData.slug}>
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Organization
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => (
            <Card key={org.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {org.logoUrl ? (
                      <img src={org.logoUrl} alt={org.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      <CardDescription className="text-xs">{org.slug}</CardDescription>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${org.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {org.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {org.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{org.description}</p>
                )}
                {org.churchName && (
                  <p className="text-sm text-gray-500 mb-4">🏛️ {org.churchName}</p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(org)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/admin?org=${org.id}`} target="_blank">
                      <Eye className="w-4 h-4 mr-1" />
                      View Admin
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    if (confirm("Are you sure you want to delete this organization?")) {
                      deleteMutation.mutate(org.id);
                    }
                  }}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredOrgs.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No organizations found</p>
        </div>
      )}
    </div>
  );
}
