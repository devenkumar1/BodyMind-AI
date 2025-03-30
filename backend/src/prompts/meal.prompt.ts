interface MealPlanRequest {
    dailyCalories: number;
    dietType: string;
    excludeIngredients: string[];
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

export const mealPrompt = ({
    dailyCalories,
    dietType,
    excludeIngredients = [],
    preparationTime,
    isVegetarian,
    isVegan,
    isGlutenFree,
    isDairyFree,
    isKeto,
    isLowCarb,
    isHighProtein,
    isLowFat
}: MealPlanRequest) => {
    // Validate required fields with better error messages
    if (typeof dailyCalories !== 'number' || isNaN(dailyCalories)) {
        throw new Error(`Invalid dailyCalories: ${dailyCalories}. Must be a valid number.`);
    }
    if (typeof dietType !== 'string' || !dietType.trim()) {
        throw new Error(`Invalid dietType: ${dietType}. Must be a non-empty string.`);
    }
    if (typeof preparationTime !== 'number' || isNaN(preparationTime)) {
        throw new Error(`Invalid preparationTime: ${preparationTime}. Must be a valid number.`);
    }

    // Ensure excludeIngredients is an array
    const ingredientsToExclude = Array.isArray(excludeIngredients) ? excludeIngredients : [];

    // Calculate total calories for each meal type
    const breakfastCalories = Math.round(dailyCalories * 0.3);
    const lunchCalories = Math.round(dailyCalories * 0.35);
    const dinnerCalories = Math.round(dailyCalories * 0.35);
    const snacksCalories = Math.round(dailyCalories * 0.1);

    return `Generate a detailed meal plan for a person with the following requirements:
    - Daily calories: ${dailyCalories}
    - Diet type: ${dietType}
    ${ingredientsToExclude.length > 0 ? `- Excluded ingredients: ${ingredientsToExclude.join(', ')}` : ''}
    - Maximum preparation time: ${preparationTime} minutes
    - Dietary restrictions: ${[
        isVegetarian && 'Vegetarian',
        isVegan && 'Vegan',
        isGlutenFree && 'Gluten-free',
        isDairyFree && 'Dairy-free',
        isKeto && 'Keto',
        isLowCarb && 'Low-carb',
        isHighProtein && 'High-protein',
        isLowFat && 'Low-fat'
    ].filter(Boolean).join(', ')}

    IMPORTANT: Your response must be a valid JSON object that exactly matches the structure below. Do not include any markdown formatting or code blocks.
    
    Required structure:
    {
        "meal_plan": {
            "description": "Overall meal plan description",
            "daily_calories": ${dailyCalories},
            "meals": {
                "breakfast": [
                    {
                        "name": "Meal name",
                        "calories": ${breakfastCalories},
                        "protein": 25,
                        "carbs": 45,
                        "fat": 15,
                        "prepTime": 15,
                        "image": "https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg",
                        "ingredients": [
                            "Ingredient 1",
                            "Ingredient 2"
                        ],
                        "instructions": "Step by step cooking instructions"
                    }
                ],
                "lunch": [
                    {
                        "name": "Meal name",
                        "calories": ${lunchCalories},
                        "protein": 30,
                        "carbs": 50,
                        "fat": 20,
                        "prepTime": 20,
                        "image": "https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg",
                        "ingredients": [
                            "Ingredient 1",
                            "Ingredient 2"
                        ],
                        "instructions": "Step by step cooking instructions"
                    }
                ],
                "dinner": [
                    {
                        "name": "Meal name",
                        "calories": ${dinnerCalories},
                        "protein": 35,
                        "carbs": 55,
                        "fat": 25,
                        "prepTime": 25,
                        "image": "https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg",
                        "ingredients": [
                            "Ingredient 1",
                            "Ingredient 2"
                        ],
                        "instructions": "Step by step cooking instructions"
                    }
                ],
                "snacks": [
                    {
                        "name": "Meal name",
                        "calories": ${snacksCalories},
                        "protein": 10,
                        "carbs": 20,
                        "fat": 8,
                        "prepTime": 5,
                        "image": "https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg",
                        "ingredients": [
                            "Ingredient 1",
                            "Ingredient 2"
                        ],
                        "instructions": "Step by step cooking instructions"
                    }
                ]
            }
        }
    }

    Requirements:
    1. The response must be a valid JSON object
    2. All fields must be present and match the structure above
    3. The daily_calories field must be exactly ${dailyCalories} (a number)
    4. Each meal must have all required fields
    5. All fields should be strings except for calories, protein, carbs, fat, and prepTime which should be numbers
    6. The ingredients field must be an array of strings
    7. The instructions field must be a string with step-by-step cooking instructions
    8. The image field must be a valid Pexels image URL in the format: https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg
    9. The prepTime should not exceed ${preparationTime} minutes
    10. The calories field should be the total calories for that meal
    11. The protein, carbs, and fat fields should be in grams
    12. The name field should be a descriptive name for the meal
    13. The description field should be a summary of the meal plan
    14. The meals object must contain all four meal types (breakfast, lunch, dinner, snacks)
    15. Each meal type must be an array of at least one meal
    16. The total calories of all meals should approximately match the daily_calories target (${dailyCalories})
    17. The meals should respect the dietary restrictions specified
    18. The prepTime should not exceed the maximum preparation time specified (${preparationTime} minutes)
    19. ${ingredientsToExclude.length > 0 ? `The ingredients should not include any of these excluded ingredients: ${ingredientsToExclude.join(', ')}` : 'No ingredients are excluded'}
    20. The meals should be appropriate for the specified diet type
    21. IMPORTANT: The daily_calories field must be exactly ${dailyCalories} (a number)
    22. IMPORTANT: The calories for each meal type should be approximately:
       - Breakfast: ${breakfastCalories} calories
       - Lunch: ${lunchCalories} calories
       - Dinner: ${dinnerCalories} calories
       - Snacks: ${snacksCalories} calories
    23. IMPORTANT: All image URLs must be from Pexels and follow the format: https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg`;
}

export default mealPrompt; 