import { gemini } from "./gemini";
import { mealPrompt } from "../prompts/meal.prompt";

interface MealPlanRequest {
    dailyCalories: number;
    dietType: string;
    excludeIngredients?: string[];
    preparationTime: number;
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    isKeto: boolean;
    isLowCarb: boolean;
    isHighProtein: boolean;
    isLowFat: boolean;
}

interface Meal {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    prepTime: number;
    image: string;
    ingredients: string[];
    instructions: string;
}

interface MealPlan {
    description: string;
    daily_calories: number;
    meals: {
        breakfast: Meal[];
        lunch: Meal[];
        dinner: Meal[];
        snacks: Meal[];
    };
}

export async function generateMealPlan(request: MealPlanRequest): Promise<{
    success: boolean;
    message: string;
    data?: {
        meal_plan: MealPlan;
    };
    error?: string;
}> {
    try {
        // Generate the prompt for Gemini
        const prompt = mealPrompt({
            ...request,
            excludeIngredients: request.excludeIngredients || []
        });
        
        console.log('Generated prompt:', prompt);
        
        // Get response from Gemini
        const result = await gemini(prompt);
        console.log('Gemini response:', JSON.stringify(result, null, 2));
        
        if (!result.success || !result.data || !('meal_plan' in result.data)) {
            console.error('Invalid response structure:', result);
            return {
                success: false,
                message: "Failed to generate meal plan",
                error: result.error
            };
        }

        // Validate meal plan structure
        const mealPlan = result.data.meal_plan;
        console.log('Validating meal plan structure:', JSON.stringify(mealPlan, null, 2));

        // Check required fields
        if (!mealPlan.description) {
            console.error('Missing description in meal plan');
            return {
                success: false,
                message: "Invalid meal plan structure: missing description",
                error: "Missing description in meal plan"
            };
        }

        if (typeof mealPlan.daily_calories !== 'number' || isNaN(mealPlan.daily_calories) || mealPlan.daily_calories !== request.dailyCalories) {
            console.error('Invalid daily_calories in meal plan:', mealPlan.daily_calories);
            return {
                success: false,
                message: "Invalid meal plan structure: daily_calories must match the requested value",
                error: `Invalid daily_calories: expected ${request.dailyCalories}, got ${mealPlan.daily_calories}`
            };
        }

        if (!mealPlan.meals || typeof mealPlan.meals !== 'object') {
            console.error('Missing or invalid meals object in meal plan');
            return {
                success: false,
                message: "Invalid meal plan structure: missing meals object",
                error: "Missing or invalid meals object"
            };
        }

        // Check meal types
        const requiredMealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
        type MealType = typeof requiredMealTypes[number];
        
        for (const mealType of requiredMealTypes) {
            if (!Array.isArray(mealPlan.meals[mealType as keyof typeof mealPlan.meals])) {
                console.error(`Invalid meal type structure for ${mealType}:`, mealPlan.meals[mealType as keyof typeof mealPlan.meals]);
                return {
                    success: false,
                    message: `Invalid meal plan structure: ${mealType} must be an array`,
                    error: `Invalid ${mealType} structure`
                };
            }

            // Validate each meal in the array
            mealPlan.meals[mealType as keyof typeof mealPlan.meals].forEach((meal: any, index: number) => {
                // Check required fields
                const requiredFields = ['name', 'calories', 'protein', 'carbs', 'fat', 'prepTime', 'image', 'ingredients', 'instructions'];
                for (const field of requiredFields) {
                    if (!(field in meal)) {
                        console.error(`Missing required field ${field} in ${mealType} meal ${index + 1}`);
                        return {
                            success: false,
                            message: `Invalid meal structure: missing ${field} in ${mealType} meal ${index + 1}`,
                            error: `Missing ${field} in ${mealType} meal ${index + 1}`
                        };
                    }
                }

                // Validate field types
                if (typeof meal.calories !== 'number' || isNaN(meal.calories)) {
                    console.error(`Invalid calories type in ${mealType} meal ${index + 1}:`, meal.calories);
                    return {
                        success: false,
                        message: `Invalid meal structure: calories must be a number in ${mealType} meal ${index + 1}`,
                        error: `Invalid calories type in ${mealType} meal ${index + 1}`
                    };
                }

                if (typeof meal.protein !== 'number' || isNaN(meal.protein)) {
                    console.error(`Invalid protein type in ${mealType} meal ${index + 1}:`, meal.protein);
                    return {
                        success: false,
                        message: `Invalid meal structure: protein must be a number in ${mealType} meal ${index + 1}`,
                        error: `Invalid protein type in ${mealType} meal ${index + 1}`
                    };
                }

                if (typeof meal.carbs !== 'number' || isNaN(meal.carbs)) {
                    console.error(`Invalid carbs type in ${mealType} meal ${index + 1}:`, meal.carbs);
                    return {
                        success: false,
                        message: `Invalid meal structure: carbs must be a number in ${mealType} meal ${index + 1}`,
                        error: `Invalid carbs type in ${mealType} meal ${index + 1}`
                    };
                }

                if (typeof meal.fat !== 'number' || isNaN(meal.fat)) {
                    console.error(`Invalid fat type in ${mealType} meal ${index + 1}:`, meal.fat);
                    return {
                        success: false,
                        message: `Invalid meal structure: fat must be a number in ${mealType} meal ${index + 1}`,
                        error: `Invalid fat type in ${mealType} meal ${index + 1}`
                    };
                }

                if (typeof meal.prepTime !== 'number' || isNaN(meal.prepTime)) {
                    console.error(`Invalid prepTime type in ${mealType} meal ${index + 1}:`, meal.prepTime);
                    return {
                        success: false,
                        message: `Invalid meal structure: prepTime must be a number in ${mealType} meal ${index + 1}`,
                        error: `Invalid prepTime type in ${mealType} meal ${index + 1}`
                    };
                }

                if (meal.prepTime > request.preparationTime) {
                    console.error(`Prep time exceeds maximum in ${mealType} meal ${index + 1}:`, meal.prepTime);
                    return {
                        success: false,
                        message: `Invalid meal structure: prep time exceeds maximum in ${mealType} meal ${index + 1}`,
                        error: `Prep time exceeds maximum in ${mealType} meal ${index + 1}`
                    };
                }

                if (!Array.isArray(meal.ingredients)) {
                    console.error(`Invalid ingredients type in ${mealType} meal ${index + 1}:`, meal.ingredients);
                    return {
                        success: false,
                        message: `Invalid meal structure: ingredients must be an array in ${mealType} meal ${index + 1}`,
                        error: `Invalid ingredients type in ${mealType} meal ${index + 1}`
                    };
                }

                if (typeof meal.instructions !== 'string') {
                    console.error(`Invalid instructions type in ${mealType} meal ${index + 1}:`, meal.instructions);
                    return {
                        success: false,
                        message: `Invalid meal structure: instructions must be a string in ${mealType} meal ${index + 1}`,
                        error: `Invalid instructions type in ${mealType} meal ${index + 1}`
                    };
                }

                if (typeof meal.image !== 'string') {
                    console.error(`Invalid image type in ${mealType} meal ${index + 1}:`, meal.image);
                    return {
                        success: false,
                        message: `Invalid meal structure: image must be a string in ${mealType} meal ${index + 1}`,
                        error: `Invalid image type in ${mealType} meal ${index + 1}`
                    };
                }

                if (typeof meal.name !== 'string') {
                    console.error(`Invalid name type in ${mealType} meal ${index + 1}:`, meal.name);
                    return {
                        success: false,
                        message: `Invalid meal structure: name must be a string in ${mealType} meal ${index + 1}`,
                        error: `Invalid name type in ${mealType} meal ${index + 1}`
                    };
                }
            });
        }

        return {
            success: true,
            message: "Meal plan generated successfully",
            data: {
                meal_plan: result.data.meal_plan
            }
        };
    } catch (error) {
        console.error('Error generating meal plan:', error);
        return {
            success: false,
            message: "Failed to generate meal plan",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

export default generateMealPlan;
