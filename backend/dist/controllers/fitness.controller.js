"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeGenerator = exports.ChatWithAI = exports.generateMealPlan = exports.generateWorkoutPlan = void 0;
const workoutPlanGenerator_1 = __importDefault(require("../libs/workoutPlanGenerator"));
const mealPlanGenerator_1 = require("../libs/mealPlanGenerator");
const AIChat_1 = require("../libs/AIChat");
const recipeGenerator_1 = require("../libs/recipeGenerator");
const generateWorkoutPlan = async (req, res) => {
    var _a;
    try {
        const { fitnessLevel, fitnessGoal, duration, daysPerweek } = req.body;
        // Validate required fields
        if (!fitnessLevel || !fitnessGoal || !duration || !daysPerweek) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory",
                requiredFields: {
                    fitnessLevel: "Fitness level (beginner/intermediate/advanced)",
                    fitnessGoal: "Fitness goal (e.g., build strength, lose weight)",
                    duration: "Workout duration per day",
                    daysPerweek: "Number of workout days per week"
                }
            });
        }
        // Generate the workout plan
        const result = await (0, workoutPlanGenerator_1.default)({
            fitnessLevel,
            fitnessGoal,
            duration,
            daysPerweek
        });
        // Check if the generation was successful
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.message || "Failed to generate workout plan",
                error: result.error
            });
        }
        // Return the formatted response
        return res.status(200).json({
            success: true,
            message: "Your workout plan is ready",
            data: {
                workout_plan: (_a = result.data) === null || _a === void 0 ? void 0 : _a.workout_plan
            }
        });
    }
    catch (error) {
        console.error('Error generating workout plan:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate workout plan",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
    }
};
exports.generateWorkoutPlan = generateWorkoutPlan;
const generateMealPlan = async (req, res) => {
    var _a;
    try {
        const { dailyCalories, dietType, excludeIngredients, preparationTime, isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto, isLowCarb, isHighProtein, isLowFat } = req.body;
        // Validate required fields
        if (!dailyCalories || !dietType || !preparationTime) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                requiredFields: {
                    dailyCalories: "Daily calorie target (number)",
                    dietType: "Type of diet (string)",
                    preparationTime: "Maximum preparation time in minutes (number)"
                }
            });
        }
        // Convert dailyCalories and preparationTime to numbers
        const parsedDailyCalories = Number(dailyCalories);
        const parsedPreparationTime = Number(preparationTime);
        if (isNaN(parsedDailyCalories) || isNaN(parsedPreparationTime)) {
            return res.status(400).json({
                success: false,
                message: "Invalid number format",
                error: "dailyCalories and preparationTime must be valid numbers"
            });
        }
        // Generate the meal plan
        const result = await (0, mealPlanGenerator_1.generateMealPlan)({
            dailyCalories: parsedDailyCalories,
            dietType,
            excludeIngredients: excludeIngredients ? (Array.isArray(excludeIngredients) ? excludeIngredients : excludeIngredients.split(',').map((i) => i.trim())) : [],
            preparationTime: parsedPreparationTime,
            isVegetarian: Boolean(isVegetarian),
            isVegan: Boolean(isVegan),
            isGlutenFree: Boolean(isGlutenFree),
            isDairyFree: Boolean(isDairyFree),
            isKeto: Boolean(isKeto),
            isLowCarb: Boolean(isLowCarb),
            isHighProtein: Boolean(isHighProtein),
            isLowFat: Boolean(isLowFat)
        });
        // Check if the generation was successful
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.message || "Failed to generate meal plan",
                error: result.error
            });
        }
        // Return the formatted response
        return res.status(200).json({
            success: true,
            message: "Your meal plan is ready",
            data: {
                meal_plan: (_a = result.data) === null || _a === void 0 ? void 0 : _a.meal_plan
            }
        });
    }
    catch (error) {
        console.error('Error generating meal plan:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate meal plan",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
    }
};
exports.generateMealPlan = generateMealPlan;
const ChatWithAI = async (req, res) => {
    const { message } = req.body;
    if (!message)
        return res.status(400).json({ message: "Please provide a message to send" });
    try {
        const reply = await (0, AIChat_1.chat)(message);
        res.status(200).json({ message: reply.reply });
    }
    catch (error) {
        console.log("error in chat controller", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
exports.ChatWithAI = ChatWithAI;
const recipeGenerator = async (req, res) => {
    try {
        const { ingredients, fitnessGoal } = req.body;
        // Validate required fields
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0 || !fitnessGoal) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                requiredFields: {
                    ingredients: "Array of ingredients",
                    fitnessGoal: "Fitness goal (e.g., weight loss, muscle gain)"
                }
            });
        }
        // Generate the recipe
        const recipe = await (0, recipeGenerator_1.generateRecipe)(ingredients, fitnessGoal);
        // Return the formatted response
        return res.status(200).json({
            success: true,
            message: "Recipe generated successfully",
            data: recipe
        });
    }
    catch (error) {
        console.error('Error generating recipe:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate recipe",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
    }
};
exports.recipeGenerator = recipeGenerator;
