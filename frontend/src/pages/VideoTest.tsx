import React, { useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

const VideoTest = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const myMeetingRef = useRef<HTMLDivElement>(null);
  
  // ZegoCloud credentials (used directly for testing)
  const appID = 1206661689;
  const serverSecret = "87cb564542638903a15c5a1ecf4fa2d1";
  
  // This function will be called when the component mounts
  const startMeeting = async (element: HTMLDivElement) => {
    console.log("VideoTest: Starting meeting with element", element);
    
    try {
      // Generate random test ID for user
      const userID = Math.floor(Math.random() * 10000).toString();
      const userName = "Test User";
      const meetingID = roomId || "test_room";
      
      console.log("VideoTest: Generating kit token with", {
        appID,
        hasSecret: !!serverSecret,
        meetingID,
        userID,
        userName
      });
      
      // Generate kit token
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        meetingID,
        userID,
        userName
      );
      
      console.log("VideoTest: Token generated, creating ZegoUIKitPrebuilt instance");
      
      // Create ZegoUIKitPrebuilt instance
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      
      console.log("VideoTest: Joining room with container:", element);
      
      // Join room
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Copy meeting link',
            url: `${window.location.origin}/video-test/${meetingID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        turnOnCameraWhenJoining: true,
        turnOnMicrophoneWhenJoining: true,
        showPreJoinView: true,
        onJoinRoom: () => {
          console.log("VideoTest: Successfully joined room!");
        },
        onLeaveRoom: () => {
          console.log("VideoTest: Left room");
          navigate('/dashboard');
        }
      });
      
      console.log("VideoTest: Room join initiated");
    } catch (error) {
      console.error("VideoTest: Error initializing meeting", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-xl font-bold ml-4">Video Test (Room ID: {roomId || "test_room"})</h1>
      </div>
      
      <div 
        ref={myMeetingRef}
        className="flex-1"
        style={{ height: 'calc(100vh - 65px)' }}
      />
      
      <Button
        className="absolute bottom-4 right-4 z-50"
        onClick={() => {
          if (myMeetingRef.current) {
            startMeeting(myMeetingRef.current);
          } else {
            console.error("VideoTest: Meeting container ref is not available");
          }
        }}
      >
        Start Meeting
      </Button>
    </div>
  );
};

export default VideoTest; 