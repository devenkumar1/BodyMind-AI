import workoutPrompt from "../prompts/workout.prompt";
import gemini from "./gemini";

export interface workAttt {
    fitnessLevel: string;
    fitnessGoal: string;
    duration: string;
    daysPerweek: string;
}

export const workoutPlanGenerator = async ({fitnessLevel, fitnessGoal, duration, daysPerweek}: workAttt) => {
    try {
        const prompt = workoutPrompt({fitnessLevel, fitnessGoal, duration, daysPerweek});
        const plan = await gemini(prompt);
        return plan;
    } catch (error) {
        console.error("Error generating workout plan:", error);
        throw error;
    }
}

export default workoutPlanGenerator;