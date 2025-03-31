import { Router } from "express";
import { generateWorkoutPlan, generateMealPlan, recipeGenerator } from "../controllers/fitness.controller";

const router = Router();

router.post("/workout-plan", generateWorkoutPlan);
router.post("/meal-plan", generateMealPlan);


export default router; 