"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const fitness_controller_1 = require("../controllers/fitness.controller");
const router = express_1.default.Router();
// GET /api/users/profile - Get user profile
router.get('/profile', auth_middleware_1.protect, user_controller_1.getUserProfile);
// PUT /api/users/profile - Update user profile
router.put('/profile', auth_middleware_1.protect, user_controller_1.updateUserProfile);
// POST /api/users/generate-workout-plan - Generate workout plan
router.post('/generate-workout-plan', auth_middleware_1.protect, fitness_controller_1.generateWorkoutPlan);
// POST /api/users/generate-meal-plan - Generate meal plan
router.post('/generate-meal-plan', auth_middleware_1.protect, fitness_controller_1.generateMealPlan);
router.post('/ai-chat', fitness_controller_1.ChatWithAI);
router.post('/ai-recipe', fitness_controller_1.recipeGenerator);
exports.default = router;
