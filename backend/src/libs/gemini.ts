import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

interface WorkoutPlan {
    workout_plan: {
        description: string;
        schedule: {
            [key: string]: string;
        };
        exercises: Array<{
            name: string;
            sets: number;
            reps: string;
            description: string;
        }>;
        warm_up: {
            description: string;
            exercises: Array<{
                name: string;
                duration: string;
                description: string;
            }>;
        };
        cool_down: {
            description: string;
            exercises: Array<{
                name: string;
                duration: string;
                description: string;
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
            exercises: Array<{
                name: string;
                sets: number;
                reps: string;
                description: string;
            }>;
            warm_up: {
                description: string;
                exercises: Array<{
                    name: string;
                    duration: string;
                    description: string;
                }>;
            };
            cool_down: {
                description: string;
                exercises: Array<{
                    name: string;
                    duration: string;
                    description: string;
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
        
        try {
            // Parse the JSON response
            const parsedResponse = JSON.parse(cleanedText) as WorkoutPlan;
            
            // Validate the response structure
            if (!parsedResponse.workout_plan) {
                throw new Error('Invalid response structure: missing workout_plan');
            }
            
            // Ensure all required fields are present
            const requiredFields = ['description', 'schedule', 'exercises', 'warm_up', 'cool_down'] as const;
            for (const field of requiredFields) {
                if (!(field in parsedResponse.workout_plan)) {
                    throw new Error(`Invalid response structure: missing ${field}`);
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