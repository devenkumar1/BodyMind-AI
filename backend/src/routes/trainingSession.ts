import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import { TrainingSession } from '../models/TrainingSession';
import { User } from '../models/User';
import { z } from 'zod';

const router = express.Router();

// Validation schema for session status update
const updateSessionStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
  meetingLink: z.string().optional(),
  scheduledTime: z.string().optional(),
});

// Get all training sessions (Admin only)
router.get('/admin/sessions', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const sessions = await TrainingSession.find()
      .populate('trainer', 'name email specialization')
      .populate('user', 'name email')
      .sort({ date: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get trainer's sessions
router.get('/trainer/sessions', auth, checkRole(['TRAINER']), async (req, res) => {
  try {
    const sessions = await TrainingSession.find({ trainer: req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's sessions
router.get('/user/sessions', auth, checkRole(['USER']), async (req, res) => {
  try {
    const sessions = await TrainingSession.find({ user: req.user._id })
      .populate('trainer', 'name email specialization')
      .sort({ date: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Book a training session (User only)
router.post('/book', auth, checkRole(['USER']), async (req, res) => {
  try {
    const { trainerId, date, duration, notes } = req.body;

    // Check if trainer exists and is verified
    const trainer = await User.findOne({ _id: trainerId, role: 'TRAINER', isVerified: true });
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found or not verified' });
    }

    // Calculate price based on duration and trainer's hourly rate
    const price = (duration / 60) * trainer.hourlyRate!;

    const session = new TrainingSession({
      trainer: trainerId,
      user: req.user._id,
      date,
      duration,
      notes,
      price
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept a training session (Trainer only)
router.patch('/:sessionId/accept', auth, checkRole(['TRAINER']), async (req, res) => {
  try {
    const session = await TrainingSession.findOne({
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
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete a training session (Trainer only)
router.patch('/:sessionId/complete', auth, checkRole(['TRAINER']), async (req, res) => {
  try {
    const session = await TrainingSession.findOne({
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
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel a training session (User or Trainer)
router.patch('/:sessionId/cancel', auth, checkRole(['USER', 'TRAINER']), async (req, res) => {
  try {
    const session = await TrainingSession.findOne({
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

    session.status = 'CANCELLED';
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update session status (accept/reject)
router.patch('/sessions/:sessionId/status', auth, checkRole(['TRAINER']), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const validatedData = updateSessionStatusSchema.parse(req.body);

    const session = await TrainingSession.findOne({
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
      session.scheduledTime = validatedData.scheduledTime;
    }

    await session.save();

    // If accepted, send notification to user (you can implement this later)
    if (validatedData.status === 'ACCEPTED') {
      // TODO: Send notification to user
    }

    res.json(session);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 