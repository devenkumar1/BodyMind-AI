"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const TrainingSession_1 = require("../models/TrainingSession");
const User_1 = require("../models/User");
const zod_1 = require("zod");
const router = express_1.default.Router();
// Validation schema for session status update
const updateSessionStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['ACCEPTED', 'REJECTED']),
    meetingLink: zod_1.z.string().optional(),
    scheduledTime: zod_1.z.string().optional(),
});
// Get all training sessions (Admin only)
router.get('/admin/sessions', auth_1.auth, (0, auth_1.checkRole)(['ADMIN']), async (req, res) => {
    try {
        const sessions = await TrainingSession_1.TrainingSession.find()
            .populate('trainer', 'name email specialization')
            .populate('user', 'name email')
            .sort({ date: 1 });
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Get trainer's sessions
router.get('/trainer/sessions', auth_1.auth, (0, auth_1.checkRole)(['TRAINER']), async (req, res) => {
    try {
        const sessions = await TrainingSession_1.TrainingSession.find({ trainer: req.user._id })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Get user's sessions
router.get('/user/sessions', auth_1.auth, (0, auth_1.checkRole)(['USER']), async (req, res) => {
    try {
        const sessions = await TrainingSession_1.TrainingSession.find({ user: req.user._id })
            .populate('trainer', 'name email specialization')
            .sort({ date: 1 });
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Book a training session (User only)
router.post('/book', auth_1.auth, (0, auth_1.checkRole)(['USER']), async (req, res) => {
    try {
        const { trainerId, date, duration, notes } = req.body;
        // Check if trainer exists and is verified
        const trainer = await User_1.User.findOne({ _id: trainerId, role: 'TRAINER', isVerified: true });
        if (!trainer) {
            return res.status(404).json({ error: 'Trainer not found or not verified' });
        }
        // Calculate price based on duration and trainer's hourly rate
        const price = (duration / 60) * trainer.hourlyRate;
        const session = new TrainingSession_1.TrainingSession({
            trainer: trainerId,
            user: req.user._id,
            date,
            duration,
            notes,
            price
        });
        await session.save();
        res.status(201).json(session);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Accept a training session (Trainer only)
router.patch('/:sessionId/accept', auth_1.auth, (0, auth_1.checkRole)(['TRAINER']), async (req, res) => {
    try {
        const session = await TrainingSession_1.TrainingSession.findOne({
            _id: req.params.sessionId,
            trainer: req.user._id,
            status: 'PENDING'
        });
        if (!session) {
            return res.status(404).json({ error: 'Session not found or not pending' });
        }
        // Generate meeting link (you can integrate with your preferred video service)
        const meetingLink = `https://meet.google.com/${Math.random().toString(36).substring(7)}`;
        session.status = 'ACCEPTED';
        session.meetingLink = meetingLink;
        await session.save();
        res.json(session);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Complete a training session (Trainer only)
router.patch('/:sessionId/complete', auth_1.auth, (0, auth_1.checkRole)(['TRAINER']), async (req, res) => {
    try {
        const session = await TrainingSession_1.TrainingSession.findOne({
            _id: req.params.sessionId,
            trainer: req.user._id,
            status: 'ACCEPTED'
        });
        if (!session) {
            return res.status(404).json({ error: 'Session not found or not accepted' });
        }
        session.status = 'COMPLETED';
        await session.save();
        res.json(session);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Cancel a training session (User or Trainer)
router.patch('/:sessionId/cancel', auth_1.auth, (0, auth_1.checkRole)(['USER', 'TRAINER']), async (req, res) => {
    try {
        const session = await TrainingSession_1.TrainingSession.findOne({
            _id: req.params.sessionId,
            $or: [
                { user: req.user._id },
                { trainer: req.user._id }
            ],
            status: { $in: ['PENDING', 'ACCEPTED'] }
        });
        if (!session) {
            return res.status(404).json({ error: 'Session not found or cannot be cancelled' });
        }
        session.status = 'REJECTED';
        await session.save();
        res.json(session);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Update session status (accept/reject)
router.patch('/sessions/:sessionId/status', auth_1.auth, (0, auth_1.checkRole)(['TRAINER']), async (req, res) => {
    try {
        const { sessionId } = req.params;
        const validatedData = updateSessionStatusSchema.parse(req.body);
        const session = await TrainingSession_1.TrainingSession.findOne({
            _id: sessionId,
            trainer: req.user._id
        });
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        if (session.status !== 'PENDING') {
            return res.status(400).json({ error: 'Session status can only be updated if pending' });
        }
        // Update session status
        session.status = validatedData.status;
        // If accepting, add meeting details
        if (validatedData.status === 'ACCEPTED') {
            if (!validatedData.meetingLink || !validatedData.scheduledTime) {
                return res.status(400).json({ error: 'Meeting link and scheduled time are required for accepting sessions' });
            }
            session.meetingLink = validatedData.meetingLink;
            session.scheduledTime = new Date(validatedData.scheduledTime);
        }
        await session.save();
        // If accepted, send notification to user (you can implement this later)
        if (validatedData.status === 'ACCEPTED') {
            // TODO: Send notification to user
        }
        res.json(session);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
