import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Star,
} from "lucide-react";

interface Session {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  date: string;
  duration: number;
  status: string;
  price: number;
  notes?: string;
}

interface TrainerStats {
  totalSessions: number;
  completedSessions: number;
  totalEarnings: number;
  averageRating: number;
}

const TrainerDashboard = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<TrainerStats>({
    totalSessions: 0,
    completedSessions: 0,
    totalEarnings: 0,
    averageRating: 0,
  });
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchSessions();
    fetchStats();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/training/trainer/sessions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      toast.error("Failed to fetch sessions");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/training/trainer/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast.error("Failed to fetch stats");
    }
  };

  const handleUpdateSessionStatus = async (
    sessionId: string,
    status: "ACCEPTED" | "REJECTED" | "COMPLETED"
  ) => {
    try {
      const response = await fetch(`/api/training/sessions/${sessionId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success("Session status updated successfully");
        fetchSessions();
        fetchStats();
      } else {
        toast.error("Failed to update session status");
      }
    } catch (error) {
      toast.error("Failed to update session status");
    }
  };

  const handleAddNotes = async () => {
    if (!selectedSession) return;

    try {
      const response = await fetch(
        `/api/training/sessions/${selectedSession._id}/notes`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ notes }),
        }
      );

      if (response.ok) {
        toast.success("Notes added successfully");
        setIsNotesOpen(false);
        setNotes("");
        fetchSessions();
      } else {
        toast.error("Failed to add notes");
      }
    } catch (error) {
      toast.error("Failed to add notes");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trainer Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Training Sessions</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{session.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {session.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(session.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{session.duration} min</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          session.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : session.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : session.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {session.status}
                      </span>
                    </TableCell>
                    <TableCell>${session.price}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {session.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateSessionStatus(session._id, "ACCEPTED")
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateSessionStatus(session._id, "REJECTED")
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {session.status === "ACCEPTED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateSessionStatus(session._id, "COMPLETED")
                            }
                          >
                            Complete
                          </Button>
                        )}
                        <Dialog
                          open={isNotesOpen && selectedSession?._id === session._id}
                          onOpenChange={(open) => {
                            setIsNotesOpen(open);
                            if (open) {
                              setSelectedSession(session);
                              setNotes(session.notes || "");
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Notes
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Session Notes</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <textarea
                                className="w-full h-32 p-2 border rounded-md"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes about the session..."
                              />
                              <Button onClick={handleAddNotes} className="w-full">
                                Save Notes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainerDashboard; 