import express from 'express';
import {getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { generateWorkoutPlan, generateMealPlan } from '../controllers/fitness.controller';

const router = express.Router();

// GET /api/users/profile - Get user profile
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', protect, updateUserProfile);

// POST /api/users/generate-workout-plan - Generate workout plan
router.post('/generate-workout-plan', protect, generateWorkoutPlan);

// POST /api/users/generate-meal-plan - Generate meal plan
router.post('/generate-meal-plan', protect, generateMealPlan);

export default router; 