import express from 'express';
import { geminifunctiocall, getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { geminiSetup } from '../libs/gemini';

const router = express.Router();

// GET /api/users/profile - Get user profile
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', protect, updateUserProfile);

router.get('/gemini-api',geminifunctiocall);

export default router; 