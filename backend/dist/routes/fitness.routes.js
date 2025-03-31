"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fitness_controller_1 = require("../controllers/fitness.controller");
const router = (0, express_1.Router)();
router.post("/workout-plan", fitness_controller_1.generateWorkoutPlan);
router.post("/meal-plan", fitness_controller_1.generateMealPlan);
exports.default = router;
