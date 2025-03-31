import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all trainers
router.get('/trainers', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const trainers = await User.find({ role: 'TRAINER' })
      .select('-password')
      .sort({ name: 1 });
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new trainer
router.post('/trainers', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const { name, email, password, specialization, hourlyRate, bio } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new trainer
    const trainer = new User({
      name,
      email,
      password: hashedPassword,
      role: 'TRAINER',
      specialization,
      hourlyRate,
      bio,
      isVerified: true // Admin-created trainers are automatically verified
    });

    await trainer.save();

    // Remove password from response
    const trainerResponse = trainer.toObject();
    delete trainerResponse.password;

    res.status(201).json(trainerResponse);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update trainer details
router.patch('/trainers/:trainerId', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const { name, specialization, hourlyRate, bio, isVerified } = req.body;

    const trainer = await User.findOne({
      _id: req.params.trainerId,
      role: 'TRAINER'
    });

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // Update fields
    if (name) trainer.name = name;
    if (specialization) trainer.specialization = specialization;
    if (hourlyRate) trainer.hourlyRate = hourlyRate;
    if (bio) trainer.bio = bio;
    if (typeof isVerified === 'boolean') trainer.isVerified = isVerified;

    await trainer.save();

    // Remove password from response
    const trainerResponse = trainer.toObject();
    delete trainerResponse.password;

    res.json(trainerResponse);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a trainer
router.delete('/trainers/:trainerId', auth, checkRole(['ADMIN']), async (req, res) => {
  try {
    const trainer = await User.findOne({
      _id: req.params.trainerId,
      role: 'TRAINER'
    });

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    await trainer.remove();
    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 