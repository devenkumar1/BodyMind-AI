import express from 'express';
import {getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { generateWorkoutPlan, generateMealPlan, ChatWithAI, recipeGenerator } from '../controllers/fitness.controller';
import { canGenerateWorkoutPlan, canGenerateMealPlan } from '../middlewares/subscription.middleware';
import subscriptionRoutes from '../routes/subscription.routes';
import trainerRoutes from './Trainer.routes'

const router = express.Router();

// GET /api/users/profile - Get user profile
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', protect, updateUserProfile);

// POST /api/users/generate-workout-plan - Generate workout plan
router.post('/generate-workout-plan', protect, canGenerateWorkoutPlan, generateWorkoutPlan);

// POST /api/users/generate-meal-plan - Generate meal plan
router.post('/generate-meal-plan', protect, canGenerateMealPlan, generateMealPlan);

router.post('/ai-chat', ChatWithAI);
router.post('/ai-recipe', recipeGenerator);

// Subscription routes
router.use('/subscription', subscriptionRoutes);
router.use('/training',trainerRoutes);


export default router;