import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Clock } from 'lucide-react';

interface VideoMeetingProps {}

const VideoMeeting: React.FC<VideoMeetingProps> = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId || !token || !user) {
      setError('Missing required parameters for the meeting');
      setIsLoading(false);
      return;
    }

    const initializeZegoCloud = async () => {
      try {
        // Get the container element
        const container = document.getElementById('zego-container');
        if (!container) {
          setError('Meeting container not found');
          setIsLoading(false);
          return;
        }

        // Initialize ZegoCloud
        const kitToken = token;
        const userID = user._id;
        const userName = user.name || 'User';

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container,
          sharedLinks: [
            {
              name: 'Copy meeting link',
              url: window.location.href,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: true,
          showTurnOffRemoteCameraButton: true,
          showTurnOffRemoteMicrophoneButton: true,
          showRemoveUserButton: false,
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          showUserName: true,
          maxUsers: 2,
          layout: 'Auto',
          showLayoutButton: true,
          showPreJoinView: true,
          preJoinViewConfig: {
            title: 'Freaky Fit Training Session',
          },
          onJoinRoom: () => {
            setIsLoading(false);
          },
          onLeaveRoom: () => {
            navigate('/dashboard');
          },
        });
      } catch (err) {
        console.error('Error initializing ZegoCloud:', err);
        setError('Failed to initialize the meeting. Please try again.');
        setIsLoading(false);
      }
    };

    initializeZegoCloud();
  }, [roomId, token, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Setting up your meeting...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Meeting Error</h2>
          <p className="text-muted-foreground text-center mb-6">{error}</p>
          <Button 
            className="w-full" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Meeting ID: {roomId}
          </span>
        </div>
      </div>
      
      {/* ZegoCloud Container */}
      <div 
        id="zego-container" 
        className="flex-1 w-full"
      ></div>
    </div>
  );
};

export default VideoMeeting;
