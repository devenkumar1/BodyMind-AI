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

export const mealPrompt = (request: MealPlanRequest): string => {
    const dietaryRestrictions = [];
    if (request.isVegetarian) dietaryRestrictions.push('vegetarian');
    if (request.isVegan) dietaryRestrictions.push('vegan');
    if (request.isGlutenFree) dietaryRestrictions.push('gluten-free');
    if (request.isDairyFree) dietaryRestrictions.push('dairy-free');
    if (request.isKeto) dietaryRestrictions.push('keto');
    if (request.isLowCarb) dietaryRestrictions.push('low-carb');
    if (request.isHighProtein) dietaryRestrictions.push('high-protein');
    if (request.isLowFat) dietaryRestrictions.push('low-fat');

    const restrictionsText = dietaryRestrictions.length > 0 
        ? `The meals must be ${dietaryRestrictions.join(', ')}.` 
        : '';

    const excludeText = request.excludeIngredients.length > 0
        ? `Do not include any meals containing: ${request.excludeIngredients.join(', ')}.`
        : '';

    return `Generate a detailed weekly meal plan for a ${request.dietType} diet with ${request.dailyCalories} calories per day. ${restrictionsText} ${excludeText} Each meal should take no more than ${request.preparationTime} minutes to prepare.

    IMPORTANT: Your response must be a valid JSON object that exactly matches the structure below. Do not include any markdown formatting or code blocks.
    
    Required structure:
    {
        "meal_plan": {
            "description": "Overall weekly meal plan description",
            "daily_calories": ${request.dailyCalories},
            "weekly_plan": {
                "monday": {
                    "breakfast": [
                        {
                            "name": "Meal name",
                            "calories": number,
                            "protein": number,
                            "carbs": number,
                            "fat": number,
                            "prepTime": number,
                            "image": "https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg",
                            "ingredients": ["ingredient 1", "ingredient 2", ...],
                            "instructions": "Detailed cooking instructions"
                        }
                    ],
                    "lunch": [...],
                    "dinner": [...],
                    "snacks": [...]
                },
                "tuesday": {
                    "breakfast": [...],
                    "lunch": [...],
                    "dinner": [...],
                    "snacks": [...]
                },
                "wednesday": {
                    "breakfast": [...],
                    "lunch": [...],
                    "dinner": [...],
                    "snacks": [...]
                },
                "thursday": {
                    "breakfast": [...],
                    "lunch": [...],
                    "dinner": [...],
                    "snacks": [...]
                },
                "friday": {
                    "breakfast": [...],
                    "lunch": [...],
                    "dinner": [...],
                    "snacks": [...]
                },
                "saturday": {
                    "breakfast": [...],
                    "lunch": [...],
                    "dinner": [...],
                    "snacks": [...]
                },
                "sunday": {
                    "breakfast": [...],
                    "lunch": [...],
                    "dinner": [...],
                    "snacks": [...]
                }
            }
        }
    }

    Requirements:
    1. The response must be valid JSON without any markdown formatting
    2. Each day must have all four meal types (breakfast, lunch, dinner, snacks)
    3. Each meal type must be an array with at least one meal
    4. The total calories of all meals for each day should approximately match the daily calories target
    5. Each meal must have all required fields (name, calories, protein, carbs, fat, prepTime, image, ingredients, instructions)
    6. All numeric fields (calories, protein, carbs, fat, prepTime) must be numbers
    7. The ingredients field must be an array of strings
    8. The image field must be a valid Pexels image URL that closely matches the meal:
       - For breakfast meals: Use images of breakfast foods, eggs, oatmeal, toast, etc.
       - For lunch meals: Use images of salads, sandwiches, wraps, etc.
       - For dinner meals: Use images of main dishes, protein with sides, etc.
       - For snacks: Use images of healthy snacks, fruits, nuts, etc.
       - The image should visually represent the actual meal being described
       - Use high-quality, well-lit food photography
       - The image should be appetizing and professional
    9. The instructions field must be a detailed string
    10. The prepTime must not exceed ${request.preparationTime} minutes
    11. Each meal must respect the dietary restrictions and excluded ingredients
    12. The weekly plan must include all seven days (monday through sunday)
    13. Each day must have different meals to provide variety throughout the week
    14. The meals should be practical and easy to prepare
    15. The nutritional information should be accurate and balanced
    16. IMPORTANT: All image URLs must be from Pexels and follow the format: https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg
    17. IMPORTANT: The image must be relevant to the meal being described - do not use generic food images
    18. IMPORTANT: For each meal, search Pexels using the meal name and main ingredients to find the most relevant image
    19. IMPORTANT: The image should show the final prepared dish, not just ingredients
    20. IMPORTANT: If the meal has specific dietary requirements (vegetarian, vegan, etc.), the image should reflect those requirements`;
};

export default mealPrompt; 