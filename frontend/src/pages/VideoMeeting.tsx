import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Clock } from 'lucide-react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuth } from '@/context/AuthContext';

const ZEGO_APP_ID = parseInt(import.meta.env.VITE_ZEGO_APP_ID || '0');
const ZEGO_SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET || '';

const VideoMeeting = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const myMeetingRef = useRef<HTMLDivElement>(null);
  const guestIdRef = useRef(`guest-${Math.floor(Math.random() * 100000)}`);

  useEffect(() => {
    if (!roomId || !myMeetingRef.current) return;
    
    const userId = user?._id || guestIdRef.current;
    const userName = user?.name || 'Guest User';
    
    try {
      // Generate token
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        ZEGO_APP_ID,
        ZEGO_SERVER_SECRET,
        roomId,
        userId,
        userName
      );
      
      // Create instance
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      
      // Join room
      zp.joinRoom({
        container: myMeetingRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        turnOnCameraWhenJoining: true,
        turnOnMicrophoneWhenJoining: true,
        onLeaveRoom: () => {
          navigate('/dashboard');
        }
      });
    } catch (err) {
      console.error('Failed to initialize meeting:', err);
    }
  }, [roomId, user, navigate]);

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
        id="meeting-container"
        ref={myMeetingRef}
        className="flex-1"
        style={{ height: 'calc(100vh - 65px)' }}
      />
    </div>
  );
};

export default VideoMeeting;
