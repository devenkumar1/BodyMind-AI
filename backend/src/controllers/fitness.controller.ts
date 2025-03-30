import { Request, Response } from "express"
import workoutPlanGenerator from "../libs/workoutPlanGenerator";
import { generateMealPlan as generateMealPlanService } from "../libs/mealPlanGenerator";

export const generateWorkoutPlan = async (req: Request, res: Response) => {
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
        const result = await workoutPlanGenerator({
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
                workout_plan: result.data?.workout_plan
            }
        });
    } catch (error) {
        console.error('Error generating workout plan:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate workout plan",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
    }
}; 

export const generateMealPlan = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {
            dailyCalories,
            dietType,
            excludeIngredients,
            preparationTime,
            isVegetarian,
            isVegan,
            isGlutenFree,
            isDairyFree,
            isKeto,
            isLowCarb,
            isHighProtein,
            isLowFat
        } = req.body;

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
        const result = await generateMealPlanService({
            dailyCalories: parsedDailyCalories,
            dietType,
            excludeIngredients: excludeIngredients ? (Array.isArray(excludeIngredients) ? excludeIngredients : excludeIngredients.split(',').map((i: string) => i.trim())) : [],
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
                meal_plan: result.data?.meal_plan
            }
        });
    } catch (error) {
        console.error('Error generating meal plan:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate meal plan",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        });
    }
};