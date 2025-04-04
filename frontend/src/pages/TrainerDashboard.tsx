import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
import { RefreshCw, CheckCircle2, XCircle, Video, Clock, Calendar, AlertCircle } from 'lucide-react';

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
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<TrainingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    scheduledTime: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);
  
  // Filter upcoming sessions whenever sessions change
  useEffect(() => {
    const now = new Date();
    const upcoming = sessions.filter(session => {
      // Only include accepted sessions with a scheduled time in the future
      if (session.status !== 'ACCEPTED' || !session.scheduledTime) return false;
      const scheduledTime = new Date(session.scheduledTime);
      return scheduledTime > now;
    });
    
    // Sort by scheduled time (closest first)
    upcoming.sort((a, b) => {
      const timeA = new Date(a.scheduledTime || 0).getTime();
      const timeB = new Date(b.scheduledTime || 0).getTime();
      return timeA - timeB;
    });
    
    setUpcomingSessions(upcoming);
  }, [sessions]);

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
            scheduledTime: meetingDetails.scheduledTime
          })
        }
      );

      if (!response.ok) throw new Error('Failed to accept session');
      
      toast.success('Session accepted successfully');
      setIsAcceptDialogOpen(false);
      setMeetingDetails({ scheduledTime: '' });
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

  const joinMeeting = (meetingLink: string) => {
    // Extract roomId and token from the meetingLink
    // Format is /video-meeting/{roomId}?token={token}
    const url = new URL(meetingLink, window.location.origin);
    const pathname = url.pathname;
    const roomId = pathname.split('/').pop();
    const token = url.searchParams.get('token');
    
    if (roomId && token) {
      navigate(`/video-meeting/${roomId}?token=${token}`);
    } else {
      toast.error('Invalid meeting link');
    }
  };

  // Format date and time for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate time remaining until meeting
  const getTimeRemaining = (dateString: string) => {
    const now = new Date();
    const meetingTime = new Date(dateString);
    const diffMs = meetingTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Starting now';
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} remaining`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} remaining`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`;
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
      
      {/* Upcoming Meetings Section */}
      {upcomingSessions.length > 0 && (
        <Card className="mb-8 border-2 border-primary/20 shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingSessions.map((session) => (
                <Card key={session._id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 bg-muted/50">
                    <CardTitle className="text-base flex justify-between items-center">
                      <span>Session with {session.user.name}</span>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {session.duration} min
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {session.scheduledTime && formatDateTime(session.scheduledTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.scheduledTime && getTimeRemaining(session.scheduledTime)}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => session.meetingLink && joinMeeting(session.meetingLink)}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Meeting
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                    {session.meetingLink && session.status === 'ACCEPTED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => joinMeeting(session.meetingLink || '')}
                        className="flex items-center"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Join Meeting
                      </Button>
                    )}
                    {session.scheduledTime && session.status === 'ACCEPTED' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDateTime(session.scheduledTime)}
                      </div>
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
                                <div className="flex items-center gap-2 mb-2 p-2 bg-primary/10 rounded text-sm">
                                  <AlertCircle className="w-4 h-4 text-primary" />
                                  <p>A ZegoCloud video meeting will be automatically created when you accept this session.</p>
                                </div>
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