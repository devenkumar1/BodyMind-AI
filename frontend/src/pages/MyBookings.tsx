import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

// Mock data - replace with actual API calls
const mockBookings = [
  {
    id: 1,
    trainerName: "John Smith",
    specialization: "Weight Training",
    date: new Date(2024, 2, 20, 10, 0),
    duration: 60,
    status: "upcoming",
    meetingLink: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: 2,
    trainerName: "Sarah Johnson",
    specialization: "Yoga",
    date: new Date(2024, 2, 22, 15, 0),
    duration: 45,
    status: "upcoming",
    meetingLink: "https://meet.google.com/xyz-uvwx-yz"
  },
  {
    id: 3,
    trainerName: "Mike Wilson",
    specialization: "HIIT",
    date: new Date(2024, 2, 18, 9, 0),
    duration: 30,
    status: "completed",
    meetingLink: "https://meet.google.com/123-4567-89"
  },
  {
    id: 4,
    trainerName: "Emma Davis",
    specialization: "Pilates",
    date: new Date(2024, 2, 19, 14, 0),
    duration: 60,
    status: "cancelled",
    meetingLink: "https://meet.google.com/987-6543-21"
  }
];

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  const filteredBookings = mockBookings.filter(booking => booking.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleJoinSession = (meetingLink: string) => {
    window.open(meetingLink, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Training Sessions</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {["upcoming", "completed", "cancelled"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {booking.trainerName}
                  </CardTitle>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize">{booking.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{format(booking.date, "PPP")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(booking.date, "h:mm a")} - {booking.duration} minutes
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Specialization: {booking.specialization}
                  </p>
                  {booking.status === "upcoming" && (
                    <Button
                      className="w-full"
                      onClick={() => handleJoinSession(booking.meetingLink)}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Session
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No {activeTab} training sessions found.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBookings; 