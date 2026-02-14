import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAbsentMembers, type AbsentMember } from "@/hooks/use-attendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserX, 
  Mail, 
  Calendar, 
  AlertTriangle, 
  Loader2,
  RefreshCw,
  MessageSquare
} from "lucide-react";

export default function AbsentMembersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [consecutiveMissed, setConsecutiveMissed] = useState(3);
  const { data: absentMembers, isLoading, error, refetch } = useAbsentMembers(consecutiveMissed);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              You don&apos;t have permission to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Absence Detection</h1>
          <p className="text-muted-foreground mt-1">
            Members who have missed recent services
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detection Settings</CardTitle>
          <CardDescription>
            Configure how many consecutive missed services trigger an alert
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Consecutive missed services:</label>
            <Input
              type="number"
              min={1}
              max={12}
              value={consecutiveMissed}
              onChange={(e) => setConsecutiveMissed(parseInt(e.target.value) || 3)}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">
              (1-12 weeks)
            </span>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">Failed to load absent members</p>
            <Button variant="outline" onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : absentMembers && absentMembers.length > 0 ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span className="text-lg font-medium">
              {absentMembers.length} member{absentMembers.length !== 1 ? "s" : ""} flagged for follow-up
            </span>
          </div>
          
          <div className="space-y-4">
            {absentMembers.map((member) => (
              <AbsentMemberCard key={member.userId} member={member} />
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Users className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">All Members Active!</h3>
            <p className="text-muted-foreground">
              No members have been flagged for absence in this period.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AbsentMemberCard({ member }: { member: AbsentMember }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-amber-100">
              <UserX className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium">
                {member.firstName || "Member"} {member.lastName || ""}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {member.email}
                </span>
                {member.lastAttendance && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Last attended: {new Date(member.lastAttendance).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                  Missed {member.missedCount} service{member.missedCount !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowActions(!showActions)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showActions && (
          <div className="mt-4 pt-4 border-t border-amber-200 flex gap-2">
            <Button size="sm" variant="outline">
              Send "We Missed You" Message
            </Button>
            <Button size="sm" variant="outline">
              Create Follow-up Task
            </Button>
            <Button size="sm" variant="outline">
              Notify Pastoral Team
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
