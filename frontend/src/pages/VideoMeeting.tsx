import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Clock, Mic, MicOff, Video, VideoOff, PhoneOff, Share } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

const VideoMeeting = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  
  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Refs for WebRTC connections
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  // Reference to the signaling server connection
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId || !user) {
      console.error('Missing required parameters:', { roomId, user: !!user });
      setError('Missing required meeting parameters. Please go back and try joining again.');
      setIsLoading(false);
      return;
    }

    // Initialize the media connection
    const initializeMediaConnection = async () => {
      try {
        // Request user media (camera and microphone)
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        localStreamRef.current = mediaStream;
        
        // Display local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
        
        // Set up a basic peer connection (for demonstration)
        // In a real app, you would need a signaling server to exchange ICE candidates
        peerConnectionRef.current = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        });
        
        // Add local tracks to the peer connection
        mediaStream.getTracks().forEach(track => {
          if (peerConnectionRef.current) {
            peerConnectionRef.current.addTrack(track, mediaStream);
          }
        });
        
        // Handle incoming remote streams
        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
        
        // Here you would typically set up signaling using WebSockets
        // This is a simplified implementation for demonstration
        
        console.log('Media connection initialized with room ID:', roomId);
        setIsLoading(false);
        
        // For demo purposes, we're simulating a connection without actual signaling
        toast.success('Meeting room ready. Waiting for participants...');
        
      } catch (err) {
        console.error('Error initializing media:', err);
        setError('Failed to access camera or microphone. Please check permissions and try again.');
        setIsLoading(false);
      }
    };

    initializeMediaConnection();
    
    // Cleanup function
    return () => {
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      
      // Stop all tracks in the local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Close signaling connection
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId, user]);
  
  // Toggle microphone
  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMicOn(audioTracks[0].enabled);
      }
    }
  };
  
  // Toggle camera
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsVideoOn(videoTracks[0].enabled);
      }
    }
  };
  
  // Share meeting link
  const shareMeetingLink = () => {
    const meetingLink = `${window.location.origin}/meeting/join/${roomId}`;
    navigator.clipboard.writeText(meetingLink)
      .then(() => toast.success('Meeting link copied to clipboard'))
      .catch(() => toast.error('Failed to copy meeting link'));
  };
  
  // End call and navigate back
  const endCall = () => {
    // Clean up connections
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    navigate('/dashboard');
  };

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
      
      {/* Video Container */}
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            You (Me)
          </div>
        </div>
        
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            Remote User
          </div>
          {!remoteVideoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              Waiting for participants...
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="p-4 flex justify-center space-x-4">
        <Button
          variant={isMicOn ? "default" : "destructive"}
          size="icon"
          onClick={toggleMicrophone}
        >
          {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant={isVideoOn ? "default" : "destructive"}
          size="icon"
          onClick={toggleCamera}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={shareMeetingLink}
        >
          <Share className="h-5 w-5" />
        </Button>
        
        <Button
          variant="destructive"
          size="icon"
          onClick={endCall}
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default VideoMeeting;
