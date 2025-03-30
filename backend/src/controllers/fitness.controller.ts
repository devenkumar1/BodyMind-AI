import { Request, Response } from "express"
import workoutPlanGenerator from "../libs/workoutPlanGenerator";

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
        const workoutPlan = await workoutPlanGenerator({
            fitnessLevel,
            fitnessGoal,
            duration,
            daysPerweek
        });

        // Return the formatted response
        return res.status(200).json({
            success: true,
            message: "Your workout plan is ready",
            workout_plan: workoutPlan
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