import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import { TrainingSession } from '../models/TrainingSession';
import { User } from '../models/User';

const router = express.Router();

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
      .sort({ date: 1 });
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

export default router; 