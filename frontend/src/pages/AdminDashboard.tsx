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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Users,
  Calendar,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Trainer {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  hourlyRate: number;
  isVerified: boolean;
  rating: number;
}

interface Session {
  _id: string;
  trainer: {
    name: string;
    email: string;
  };
  user: {
    name: string;
    email: string;
  };
  date: string;
  duration: number;
  status: string;
  price: number;
}

const AdminDashboard = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isAddTrainerOpen, setIsAddTrainerOpen] = useState(false);
  const [newTrainer, setNewTrainer] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    hourlyRate: "",
    bio: "",
  });

  useEffect(() => {
    fetchTrainers();
    fetchSessions();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch("/api/admin/trainers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      toast.error("Failed to fetch trainers");
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/training/admin/sessions", {
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

  const handleAddTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/trainers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTrainer),
      });

      if (response.ok) {
        toast.success("Trainer added successfully");
        setIsAddTrainerOpen(false);
        setNewTrainer({
          name: "",
          email: "",
          password: "",
          specialization: "",
          hourlyRate: "",
          bio: "",
        });
        fetchTrainers();
      } else {
        toast.error("Failed to add trainer");
      }
    } catch (error) {
      toast.error("Failed to add trainer");
    }
  };

  const handleDeleteTrainer = async (trainerId: string) => {
    if (!confirm("Are you sure you want to delete this trainer?")) return;

    try {
      const response = await fetch(`/api/admin/trainers/${trainerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast.success("Trainer deleted successfully");
        fetchTrainers();
      } else {
        toast.error("Failed to delete trainer");
      }
    } catch (error) {
      toast.error("Failed to delete trainer");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter((s) => s.status === "ACCEPTED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${sessions.reduce((acc, s) => acc + s.price, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trainers Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Trainers</h2>
          <Dialog open={isAddTrainerOpen} onOpenChange={setIsAddTrainerOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Trainer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Trainer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTrainer} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newTrainer.name}
                    onChange={(e) =>
                      setNewTrainer({ ...newTrainer, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newTrainer.email}
                    onChange={(e) =>
                      setNewTrainer({ ...newTrainer, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newTrainer.password}
                    onChange={(e) =>
                      setNewTrainer({ ...newTrainer, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={newTrainer.specialization}
                    onChange={(e) =>
                      setNewTrainer({
                        ...newTrainer,
                        specialization: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={newTrainer.hourlyRate}
                    onChange={(e) =>
                      setNewTrainer({ ...newTrainer, hourlyRate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={newTrainer.bio}
                    onChange={(e) =>
                      setNewTrainer({ ...newTrainer, bio: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Trainer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Hourly Rate</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainers.map((trainer) => (
                  <TableRow key={trainer._id}>
                    <TableCell>{trainer.name}</TableCell>
                    <TableCell>{trainer.email}</TableCell>
                    <TableCell>{trainer.specialization}</TableCell>
                    <TableCell>${trainer.hourlyRate}/hr</TableCell>
                    <TableCell>{trainer.rating.toFixed(1)}</TableCell>
                    <TableCell>
                      {trainer.isVerified ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteTrainer(trainer._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">All Training Sessions</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainer</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session._id}>
                    <TableCell>{session.trainer.name}</TableCell>
                    <TableCell>{session.user.name}</TableCell>
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

export default AdminDashboard; 