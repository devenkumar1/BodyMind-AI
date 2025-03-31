import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/Button';
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
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { RefreshCw, CheckCircle2, XCircle, Video } from 'lucide-react';

interface TrainingSession {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  date: string;
  duration: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  price: number;
  meetingLink?: string;
  scheduledTime?: string;
}

export default function TrainerDashboard() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    meetingLink: '',
    scheduledTime: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/training/trainer/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      toast.error('Failed to fetch sessions');
    }
  };

  const handleAcceptSession = async () => {
    if (!selectedSession) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/training/sessions/${selectedSession._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'ACCEPTED',
            meetingLink: meetingDetails.meetingLink,
            scheduledTime: meetingDetails.scheduledTime
          })
        }
      );

      if (!response.ok) throw new Error('Failed to accept session');
      
      toast.success('Session accepted successfully');
      setIsAcceptDialogOpen(false);
      setMeetingDetails({ meetingLink: '', scheduledTime: '' });
      fetchSessions();
    } catch (error) {
      toast.error('Failed to accept session');
    }
  };

  const handleRejectSession = async (sessionId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/training/sessions/${sessionId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'REJECTED' })
        }
      );

      if (!response.ok) throw new Error('Failed to reject session');
      
      toast.success('Session rejected successfully');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to reject session');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
        <Button onClick={fetchSessions}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Sessions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Meeting</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{session.user.name}</div>
                      <div className="text-sm text-muted-foreground">{session.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                  <TableCell>{session.duration} min</TableCell>
                  <TableCell>₹{session.price}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {session.meetingLink && (
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Join Meeting
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {session.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSession(session)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Accept Training Session</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="meetingLink">Google Meet Link</Label>
                                <Input
                                  id="meetingLink"
                                  value={meetingDetails.meetingLink}
                                  onChange={(e) => setMeetingDetails({ ...meetingDetails, meetingLink: e.target.value })}
                                  placeholder="https://meet.google.com/..."
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                                <Input
                                  id="scheduledTime"
                                  type="datetime-local"
                                  value={meetingDetails.scheduledTime}
                                  onChange={(e) => setMeetingDetails({ ...meetingDetails, scheduledTime: e.target.value })}
                                  required
                                />
                              </div>
                              <Button onClick={handleAcceptSession}>Confirm Acceptance</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectSession(session._id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 