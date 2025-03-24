"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// GET /api/users/profile - Get user profile
router.get('/profile', auth_middleware_1.protect, user_controller_1.getUserProfile);
// PUT /api/users/profile - Update user profile
router.put('/profile', auth_middleware_1.protect, user_controller_1.updateUserProfile);
exports.default = router;
