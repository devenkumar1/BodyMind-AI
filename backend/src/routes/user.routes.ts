import express from 'express';
import {getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { generateWorkoutPlan } from '../controllers/fitness.controller';
const router = express.Router();

// GET /api/users/profile - Get user profile
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', protect, updateUserProfile);

router.post('/generate-workout',generateWorkoutPlan);

export default router; 