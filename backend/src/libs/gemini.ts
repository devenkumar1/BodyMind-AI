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

interface MealPlan {
    meal_plan: {
        description: string;
        daily_calories: number;
        meals: {
            breakfast: Array<{
                name: string;
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
                prepTime: number;
                image: string;
                ingredients: string[];
                instructions: string;
            }>;
            lunch: Array<{
                name: string;
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
                prepTime: number;
                image: string;
                ingredients: string[];
                instructions: string;
            }>;
            dinner: Array<{
                name: string;
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
                prepTime: number;
                image: string;
                ingredients: string[];
                instructions: string;
            }>;
            snacks: Array<{
                name: string;
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
                prepTime: number;
                image: string;
                ingredients: string[];
                instructions: string;
            }>;
        };
    };
}

type GeminiResponse = {
    success: boolean;
    message: string;
    data?: WorkoutPlan | MealPlan;
    error?: string;
};

export async function gemini(prompt: string): Promise<GeminiResponse> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        
        console.log('Sending prompt to Gemini...');
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
          
        const text = response.text;
        console.log('Raw Gemini response:', text);
        
        if(!text) throw new Error('No response from Gemini');
        
        // Clean the response text to ensure valid JSON
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        console.log('Cleaned response text:', cleanedText);
        
        try {
            // Parse the JSON response
            const parsedResponse = JSON.parse(cleanedText);
            console.log('Parsed response:', JSON.stringify(parsedResponse, null, 2));
            
            // Check if it's a workout plan or meal plan
            if ('workout_plan' in parsedResponse) {
                console.log('Validating workout plan structure...');
                const workoutPlan = parsedResponse as WorkoutPlan;
                // Validate workout plan structure
                if (!workoutPlan.workout_plan.description || !workoutPlan.workout_plan.schedule || !workoutPlan.workout_plan.daily_workouts) {
                    throw new Error('Invalid workout plan structure');
                }

                // Validate daily workouts structure
                const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                for (const day of days) {
                    if (!workoutPlan.workout_plan.daily_workouts[day]) {
                        throw new Error(`Invalid response structure: missing exercises for ${day}`);
                    }
                    if (!Array.isArray(workoutPlan.workout_plan.daily_workouts[day].exercises)) {
                        throw new Error(`Invalid response structure: exercises for ${day} must be an array`);
                    }
                }

                // Validate warm-up exercises
                if (!Array.isArray(workoutPlan.workout_plan.warm_up.exercises)) {
                    throw new Error('Invalid response structure: warm-up exercises must be an array');
                }

                // Validate cool-down exercises
                if (!Array.isArray(workoutPlan.workout_plan.cool_down.exercises)) {
                    throw new Error('Invalid response structure: cool-down exercises must be an array');
                }

                return {
                    success: true,
                    message: 'Workout plan retrieved successfully',
                    data: workoutPlan
                };
            } else if ('meal_plan' in parsedResponse) {
                console.log('Validating meal plan structure...');
                const mealPlan = parsedResponse as MealPlan;
                
                // Validate meal plan structure
                if (!mealPlan.meal_plan.description) {
                    console.error('Missing description in meal plan');
                    throw new Error('Invalid meal plan structure: missing description');
                }
                if (typeof mealPlan.meal_plan.daily_calories !== 'number' || isNaN(mealPlan.meal_plan.daily_calories)) {
                    console.error('Invalid daily_calories in meal plan:', mealPlan.meal_plan.daily_calories);
                    throw new Error('Invalid meal plan structure: daily_calories must be a valid number');
                }
                if (!mealPlan.meal_plan.meals) {
                    console.error('Missing meals in meal plan');
                    throw new Error('Invalid meal plan structure: missing meals');
                }

                // Validate meals structure
                const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
                for (const type of mealTypes) {
                    console.log(`Validating ${type} meals...`);
                    if (!Array.isArray(mealPlan.meal_plan.meals[type])) {
                        console.error(`Invalid ${type} structure:`, mealPlan.meal_plan.meals[type]);
                        throw new Error(`Invalid response structure: ${type} meals must be an array`);
                    }
                    
                    // Validate each meal in the array
                    mealPlan.meal_plan.meals[type].forEach((meal, index) => {
                        console.log(`Validating ${type} meal ${index + 1}:`, meal);
                        if (!meal.name || !meal.calories || !meal.protein || !meal.carbs || !meal.fat || !meal.prepTime || !meal.image || !Array.isArray(meal.ingredients) || !meal.instructions) {
                            console.error(`Invalid meal structure in ${type} meal ${index + 1}:`, meal);
                            throw new Error(`Invalid meal structure in ${type} meal ${index + 1}`);
                        }
                    });
                }

                console.log('Meal plan validation successful');
                return {
                    success: true,
                    message: 'Meal plan retrieved successfully',
                    data: mealPlan
                };
            } else {
                console.error('Invalid response type:', parsedResponse);
                throw new Error('Invalid response structure: neither workout plan nor meal plan');
            }
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            throw new Error(`Failed to parse response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error in Gemini API:', error);
        return {
            success: false,
            message: 'An error occurred while retrieving the response',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export default gemini;