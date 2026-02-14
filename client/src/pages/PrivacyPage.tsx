import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, 
  Download, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  EyeOff,
  Info
} from "lucide-react";
import { buildApiUrl } from "@/lib/api-config";

export default function PrivacyPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [attendanceVisible, setAttendanceVisible] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    setExportSuccess(false);
    
    try {
      const res = await fetch(buildApiUrl("/api/gdpr/export"), {
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setExportSuccess(true);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== "DELETE_MY_DATA") {
      setDeleteError("Please type 'DELETE_MY_DATA' to confirm");
      return;
    }
    
    setDeleting(true);
    setDeleteError("");
    
    try {
      const res = await fetch(buildApiUrl("/api/gdpr/delete"), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: deleteConfirm }),
        credentials: "include",
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      
      alert("Your data deletion request has been submitted.");
      setDeleteConfirm("");
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handlePrivacySave = async () => {
    try {
      await fetch(buildApiUrl("/api/gdpr/privacy"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          marketingConsent,
          attendanceVisibility: attendanceVisible ? "public" : "private",
        }),
        credentials: "include",
      });
      alert("Privacy settings saved!");
    } catch (err) {
      console.error("Failed to save privacy settings:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Please log in to manage your privacy settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Privacy & Data</h1>
        <p className="text-muted-foreground mt-2">
          Manage your data and privacy settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Your Data
            </CardTitle>
            <CardDescription>
              Download a copy of all your data including profile, attendance, and event RSVPs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exportSuccess ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span>Data exported successfully!</span>
              </div>
            ) : (
              <Button onClick={handleExport} disabled={exporting} className="gap-2">
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export My Data
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>
              Control who can see your information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show attendance to group</Label>
                <p className="text-sm text-muted-foreground">
                  Allow group leaders to see your attendance
                </p>
              </div>
              <button
                onClick={() => setAttendanceVisible(!attendanceVisible)}
                className={`p-2 rounded-full transition-colors ${
                  attendanceVisible ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                {attendanceVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="marketing" 
                checked={marketingConsent}
                onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
              />
              <label
                htmlFor="marketing"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Receive updates about church events and activities
              </label>
            </div>

            <Button onClick={handlePrivacySave} className="mt-2">
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Data Deletion */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Your Data
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Warning: This action cannot be undone</p>
                  <p className="mt-1">Your personal data will be permanently removed within 30 days.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Type DELETE_MY_DATA to confirm</Label>
              <Input
                id="confirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE_MY_DATA"
              />
              {deleteError && (
                <p className="text-sm text-red-600">{deleteError}</p>
              )}
            </div>

            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={deleteConfirm !== "DELETE_MY_DATA" || deleting}
              className="gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete My Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Your Rights Under GDPR</p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Right to access your personal data</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to data portability</li>
                  <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
                  <li>Right to object to processing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
