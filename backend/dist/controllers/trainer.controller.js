"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeSession = exports.getTrainerSessions = exports.cancelSession = exports.getUserSessions = exports.rejectSessionRequest = exports.acceptSessionRequest = exports.bookTrainer = exports.getAllTrainers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const TrainingSession_1 = require("../models/TrainingSession");
const getAllTrainers = async (req, res) => {
    try {
        const trainers = await user_model_1.default.find({ role: 'TRAINER' });
        if (!trainers || trainers.length === 0)
            return res.status(400).json({ message: "no available trainers", trainers: null });
        res.status(200).json({ message: "trainers fetched successfully", trainers });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error", error });
    }
};
exports.getAllTrainers = getAllTrainers;
const bookTrainer = async (req, res) => {
    const { trainerId, userId, meetingLink, scheduledTime, roomId } = await req.body;
    if (!trainerId || !userId || !meetingLink || !scheduledTime)
        return res.status(400).json({ message: "trainer id is mandatory" });
    try {
        const newSession = await TrainingSession_1.TrainingSession.create({
            user: userId,
            trainer: trainerId,
            meetingLink: meetingLink,
            scheduledTime: scheduledTime,
            roomId: roomId,
            status: 'PENDING'
        });
        if (!newSession)
            return res.status(300).json({ message: "session not created" });
        return res.status(201).json({ message: "training session generated succesfully", TrainingSession: newSession });
    }
    catch (error) {
        console.log("something went wrong in booking session route", error);
        return res.status(500).json({ message: "something went wrong in creating session" });
    }
};
exports.bookTrainer = bookTrainer;
const acceptSessionRequest = async (req, res) => {
    const { sessionId, scheduledTime, meetingLink, roomId } = await req.body;
    if (!sessionId)
        return res.status(400).json({ message: "session ID is required" });
    try {
        const currentSession = await TrainingSession_1.TrainingSession.findById(sessionId);
        if (!currentSession)
            return res.status(400).json({ message: "invalid training session id provided" });
        // Update the session status and save the meeting link and scheduled time
        currentSession.status = 'ACCEPTED';
        if (meetingLink) {
            currentSession.meetingLink = meetingLink;
        }
        if (roomId) {
            currentSession.roomId = roomId;
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
    }
    catch (error) {
        console.log("error occurred in accept session route", error);
        return res.status(500).json({ message: "something went wrong in accepting session" });
    }
};
exports.acceptSessionRequest = acceptSessionRequest;
const rejectSessionRequest = async (req, res) => {
    const { sessionId } = await req.body;
    if (!sessionId)
        return res.status(400).json({ message: "no session link provided" });
    try {
        const currentSession = await TrainingSession_1.TrainingSession.deleteOne({ _id: sessionId });
        return res.status(200).json({ message: "request rejected successful" });
    }
    catch (error) {
        console.log("error occured in reject session route", error);
        return res.status(500).json({ message: "something went wrong in rejecting session" });
    }
};
exports.rejectSessionRequest = rejectSessionRequest;
/**
 * Get all training sessions for a user
 */
const getUserSessions = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const sessions = await TrainingSession_1.TrainingSession.find({ user: userId })
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
    }
    catch (error) {
        console.error("Error fetching user sessions:", error);
        return res.status(500).json({
            message: "Failed to fetch training sessions",
            error: error.message
        });
    }
};
exports.getUserSessions = getUserSessions;
/**
 * Cancel a training session
 */
const cancelSession = async (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
    }
    try {
        // Find the session
        const session = await TrainingSession_1.TrainingSession.findById(sessionId);
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
    }
    catch (error) {
        console.error("Error cancelling session:", error);
        return res.status(500).json({
            message: "Failed to cancel training session",
            error: error.message
        });
    }
};
exports.cancelSession = cancelSession;
/**
 * Get all training sessions for a trainer
 */
const getTrainerSessions = async (req, res) => {
    const trainerId = req.params.trainerId;
    if (!trainerId) {
        return res.status(400).json({ message: "Trainer ID is required" });
    }
    try {
        console.log(`Fetching sessions for trainer: ${trainerId}`);
        const sessions = await TrainingSession_1.TrainingSession.find({ trainer: trainerId })
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
    }
    catch (error) {
        console.error("Error fetching trainer sessions:", error);
        return res.status(500).json({
            message: "Failed to fetch training sessions",
            error: error.message
        });
    }
};
exports.getTrainerSessions = getTrainerSessions;
/**
 * Mark a training session as completed
 */
const completeSession = async (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
    }
    try {
        // Find the session
        const session = await TrainingSession_1.TrainingSession.findById(sessionId);
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
    }
    catch (error) {
        console.error("Error completing session:", error);
        return res.status(500).json({
            message: "Failed to mark training session as completed",
            error: error.message
        });
    }
};
exports.completeSession = completeSession;
// Helper function to calculate time remaining
function getTimeRemaining(sessionDate, now) {
    const diffMs = sessionDate.getTime() - now.getTime();
    if (diffMs <= 0)
        return 'In progress or past';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60)
        return `${diffMins} min(s) remaining`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
        return `${diffHours} hour(s) remaining`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day(s) remaining`;
}
