import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

interface WorkoutPlan {
    workout_plan: {
        description: string;
        schedule: {
            [key: string]: string;
        };
        daily_workouts: {
            [key: string]: {
                exercises: Array<{
                    name: string;
                    sets: number;
                    reps: string;
                    description: string;
                    gif_url: string;
                }>;
            };
        };
        warm_up: {
            description: string;
            exercises: Array<{
                name: string;
                duration: string;
                description: string;
                gif_url: string;
            }>;
        };
        cool_down: {
            description: string;
            exercises: Array<{
                name: string;
                duration: string;
                description: string;
                gif_url: string;
            }>;
        };
    };
}

export async function gemini(prompt: string): Promise<{
    success: boolean;
    message: string;
    data?: {
        workout_plan: {
            description: string;
            schedule: { [key: string]: string };
            daily_workouts: {
                [key: string]: {
                    exercises: Array<{
                        name: string;
                        sets: number;
                        reps: string;
                        description: string;
                        gif_url: string;
                    }>;
                };
            };
            warm_up: {
                description: string;
                exercises: Array<{
                    name: string;
                    duration: string;
                    description: string;
                    gif_url: string;
                }>;
            };
            cool_down: {
                description: string;
                exercises: Array<{
                    name: string;
                    duration: string;
                    description: string;
                    gif_url: string;
                }>;
            };
        };
    };
    error?: string;
}> {
    try {


      
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        // const model = await genAI.models.generateContent({ model: "gemini-2.0-flash", contents: prompt  });
        
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
          });
          
        const text = response.text ;
        
        // Clean the response text to ensure valid 
        if(!text) throw new Error('No response from Gemini');
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        //new
        try {
            // Parse the JSON response
            const parsedResponse = JSON.parse(cleanedText) as WorkoutPlan;
            
            // Validate the response structure
            if (!parsedResponse.workout_plan) {
                throw new Error('Invalid response structure: missing workout_plan');
            }
            
            // Ensure all required fields are present
            const requiredFields = ['description', 'schedule', 'daily_workouts', 'warm_up', 'cool_down'] as const;
            for (const field of requiredFields) {
                if (!(field in parsedResponse.workout_plan)) {
                    throw new Error(`Invalid response structure: missing ${field}`);
                }
            }

            // Validate daily workouts structure
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            for (const day of days) {
                if (!parsedResponse.workout_plan.daily_workouts[day]) {
                    throw new Error(`Invalid response structure: missing exercises for ${day}`);
                }
                if (!Array.isArray(parsedResponse.workout_plan.daily_workouts[day].exercises)) {
                    throw new Error(`Invalid response structure: exercises for ${day} must be an array`);
                }
                // Validate each exercise has required fields
                for (const exercise of parsedResponse.workout_plan.daily_workouts[day].exercises) {
                    if (!exercise.name || !exercise.sets || !exercise.reps || !exercise.description || !exercise.gif_url) {
                        throw new Error(`Invalid exercise structure in ${day}: missing required fields`);
                    }
                }
            }

            // Validate warm-up exercises
            if (!Array.isArray(parsedResponse.workout_plan.warm_up.exercises)) {
                throw new Error('Invalid response structure: warm-up exercises must be an array');
            }
            for (const exercise of parsedResponse.workout_plan.warm_up.exercises) {
                if (!exercise.name || !exercise.duration || !exercise.description || !exercise.gif_url) {
                    throw new Error('Invalid warm-up exercise structure: missing required fields');
                }
            }

            // Validate cool-down exercises
            if (!Array.isArray(parsedResponse.workout_plan.cool_down.exercises)) {
                throw new Error('Invalid response structure: cool-down exercises must be an array');
            }
            for (const exercise of parsedResponse.workout_plan.cool_down.exercises) {
                if (!exercise.name || !exercise.duration || !exercise.description || !exercise.gif_url) {
                    throw new Error('Invalid cool-down exercise structure: missing required fields');
                }
            }
            
            return {
                success: true,
                message: 'Workout plan retrieved successfully',
                data: { workout_plan: parsedResponse.workout_plan }
            };
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            throw new Error('Failed to parse workout plan response');
        }
    } catch (error) {
        console.error('Error in Gemini API:', error);
        return {
            success: false,
            message: 'An error occurred while retrieving the workout plan',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export default gemini;