import { Request, Response } from "express";
import User from "../models/user.model";
import { TrainingSession } from "../models/TrainingSession";
import generateZegoToken from "../utils/zegoToken";

// ZegoCloud credentials - should be in environment variables
const ZEGO_APP_ID = process.env.ZEGO_APP_ID ? parseInt(process.env.ZEGO_APP_ID) : 0;
const ZEGO_SERVER_SECRET = process.env.ZEGO_SERVER_SECRET || '';

export const getAllTrainers=async(req:Request,res:Response)=>{
    try {
        const trainers= await User.find({ role: 'TRAINER' });
        if(!trainers || trainers.length === 0)  return res.status(400).json({message:"no available trainers",trainers:null});
        res.status(200).json({message:"trainers fetched successfully",trainers});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal server error",error});
    }

}

export const bookTrainer=async (req:Request,res:Response)=>{
    const {trainerId,userId,meetingLink,scheduledTime}=await req.body;
    if(!trainerId||!userId ||!meetingLink||!scheduledTime) return res.status(400).json({message:"trainer id is mandatory"});
    try {
       const newSession= await TrainingSession.create({
        user: userId,
        trainer: trainerId,
        meetingLink: meetingLink,
        scheduledTime: scheduledTime,
        status: 'PENDING'
       })

       if(!newSession) return res.status(300).json({message:"session not created"});
       return res.status(201).json({message:"training session generated succesfully",TrainingSession:newSession});
    } catch (error) {
        console.log("something went wrong in booking session route",error);
        return res.status(500).json({message:"something went wrong in creating session"})
    }
}

/**
 * Generate a ZegoCloud token for secure video calls
 */
export const generateMeetingToken = async (req: Request, res: Response) => {
    const { userId, roomId } = req.body;
    
    if (!userId || !roomId) {
        return res.status(400).json({ message: "User ID and room ID are required" });
    }
    
    try {
        if (!ZEGO_APP_ID || !ZEGO_SERVER_SECRET) {
          console.log("ZegoCloud credentials not configured on server");
            return res.status(500).json({ 
                message: "ZegoCloud credentials not configured on server" 
            });
        }
        
        // Generate token with 2 hours validity
        const token = generateZegoToken(
            ZEGO_APP_ID, 
            ZEGO_SERVER_SECRET, 
            userId,
            roomId,
            3600 
        );
        
        // Return the token and meeting details
        return res.status(200).json({
            message: "Meeting token generated successfully",
            token,
            roomId,
            appId: ZEGO_APP_ID
        });
    } catch (error) {
        console.error("Error generating meeting token:", error);
        return res.status(500).json({ message: "Failed to generate meeting token" });
    }
};

export const acceptSessionRequest = async (req:Request,res:Response)=>{
    const {sessionId, scheduledTime, meetingLink} = await req.body;
    if(!sessionId) return res.status(400).json({message:"session ID is required"});
    try {
        const currentSession = await TrainingSession.findById(sessionId);
        if(!currentSession) return res.status(400).json({message:"invalid training session id provided"});
        
        // Update the session status and save the meeting link and scheduled time
        currentSession.status = 'ACCEPTED';
        
        if (meetingLink) {
            currentSession.meetingLink = meetingLink;
        }
        
        if (scheduledTime) {
            currentSession.scheduledTime = new Date(scheduledTime);
        }
        
        // Save the updated session
        await currentSession.save();
        
        return res.status(200).json({
            message: "Training session accepted successfully",
            session: currentSession
        });
    } catch (error) {
        console.log("error occurred in accept session route", error);
        return res.status(500).json({message:"something went wrong in accepting session"});        
    }
}

export const rejectSessionRequest = async (req:Request,res:Response)=>{
    const {sessionId}=await req.body;
    if(!sessionId) return res.status(400).json({message:"no session link provided"});
    try {
        const currentSession= await TrainingSession.deleteOne({_id:sessionId});
        return res.status(200).json({message:"request rejected successful"});
    } catch (error) {
    console.log("error occured in reject session route",error);
    return res.status(500).json({message:"something went wrong in rejecting session"});        
    }
}

/**
 * Get all training sessions for a user
 */
export const getUserSessions = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  
  try {
    const sessions = await TrainingSession.find({ user: userId })
      .populate('trainer', 'name specialization')
      .sort({ scheduledTime: 1 }) // Sort by date ascending
      .lean();
      
    if (!sessions) {
      return res.status(404).json({ 
        message: "No training sessions found for this user",
        sessions: []
      });
    }
    
    // Map sessions to include status based on date
    const now = new Date();
    const processedSessions = sessions.map(session => {
      // Preserve the original status from the database
      // This ensures consistency with the trainer's view
      const status = session.status || 'PENDING';
      
      return {
        ...session,
        status,
        // Add computed properties for UI display only
        isInPast: session.scheduledTime ? new Date(session.scheduledTime) < now : false,
        timeRemaining: session.scheduledTime ? getTimeRemaining(new Date(session.scheduledTime), now) : null
      };
    });
    
    return res.status(200).json({
      message: "Training sessions retrieved successfully",
      sessions: processedSessions
    });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return res.status(500).json({ 
      message: "Failed to fetch training sessions",
      error: error.message
    });
  }
};

/**
 * Cancel a training session
 */
export const cancelSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }
  
  try {
    // Find the session
    const session = await TrainingSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: "Training session not found" });
    }
    
    // Check if session is in the future
    const sessionDate = new Date(session.scheduledTime);
    const now = new Date();
    
    if (sessionDate < now) {
      return res.status(400).json({ 
        message: "Cannot cancel a session that has already started or completed" 
      });
    }
    
    // Update the session status to REJECTED (which is effectively cancellation)
    session.status = 'REJECTED';
    await session.save();
    
    return res.status(200).json({
      message: "Training session cancelled successfully",
      session
    });
  } catch (error) {
    console.error("Error cancelling session:", error);
    return res.status(500).json({ 
      message: "Failed to cancel training session",
      error: error.message
    });
  }
};

/**
 * Get all training sessions for a trainer
 */
export const getTrainerSessions = async (req: Request, res: Response) => {
  const trainerId = req.params.trainerId;
  
  if (!trainerId) {
    return res.status(400).json({ message: "Trainer ID is required" });
  }
  
  try {
    console.log(`Fetching sessions for trainer: ${trainerId}`);
    
    const sessions = await TrainingSession.find({ trainer: trainerId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 }) // Most recent first
      .lean();
      
    console.log(`Found ${sessions.length} sessions for trainer ${trainerId}`);
      
    if (!sessions || sessions.length === 0) {
      return res.status(200).json({ 
        message: "No training sessions found for this trainer",
        sessions: []
      });
    }
    
    // Process sessions to include time-based status
    const now = new Date();
    const processedSessions = sessions.map(session => {
      // Preserve the existing status - don't automatically mark as COMPLETED
      // This fixes the issue where sessions are prematurely marked as completed
      let status = session.status || 'PENDING';
      
      // Add additional properties but don't change the core status
      return {
        ...session,
        status,
        // Add a computed property for UI display only, don't change the actual status
        isInPast: session.scheduledTime ? new Date(session.scheduledTime) < now : false,
        timeRemaining: session.scheduledTime ? getTimeRemaining(new Date(session.scheduledTime), now) : null
      };
    });
    
    return res.status(200).json({
      message: "Training sessions retrieved successfully",
      sessions: processedSessions
    });
  } catch (error) {
    console.error("Error fetching trainer sessions:", error);
    return res.status(500).json({ 
      message: "Failed to fetch training sessions",
      error: error.message
    });
  }
};

/**
 * Mark a training session as completed
 */
export const completeSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }
  
  try {
    // Find the session
    const session = await TrainingSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: "Training session not found" });
    }
    
    // Only allow completion of ACCEPTED sessions
    if (session.status !== 'ACCEPTED') {
      return res.status(400).json({ 
        message: "Only accepted sessions can be marked as completed" 
      });
    }
    
    // Update the session status to COMPLETED
    session.status = 'COMPLETED';
    await session.save();
    
    return res.status(200).json({
      message: "Training session marked as completed successfully",
      session
    });
  } catch (error) {
    console.error("Error completing session:", error);
    return res.status(500).json({ 
      message: "Failed to mark training session as completed",
      error: error.message
    });
  }
};

// Helper function to calculate time remaining
function getTimeRemaining(sessionDate: Date, now: Date): string {
  const diffMs = sessionDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'In progress or past';
  
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min(s) remaining`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour(s) remaining`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day(s) remaining`;
}