import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Apple, Clock, Utensils, UtensilsCrossed, Salad, ChefHat, SaveIcon, RefreshCw, Filter } from 'lucide-react';
import axios from 'axios';

const dietTypes = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'low-carb', label: 'Low Carb' },
  { value: 'keto', label: 'Keto' },
  { value: 'high-protein', label: 'High Protein' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'paleo', label: 'Paleo' },
];

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snacks', label: 'Snacks' },
];

const weekDays = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

// Sample meals for demonstration
const sampleMeals = {
  breakfast: [
    {
      name: 'Protein Oatmeal Bowl',
      calories: 410,
      protein: 24,
      carbs: 45,
      fat: 12,
      prepTime: 10,
      image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?q=80&w=1476&auto=format&fit=crop',
      ingredients: ['1/2 cup rolled oats', '1 scoop protein powder', '1 tbsp almond butter', '1/2 banana', '1 tsp honey', 'Cinnamon'],
      instructions: 'Cook oats with water. Once cooked, stir in protein powder. Top with sliced banana, almond butter, a drizzle of honey, and a sprinkle of cinnamon.'
    },
    {
      name: 'Avocado Toast with Eggs',
      calories: 380,
      protein: 18,
      carbs: 30,
      fat: 22,
      prepTime: 15,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1480&auto=format&fit=crop',
      ingredients: ['2 slices whole grain bread', '1/2 avocado', '2 eggs', 'Salt', 'Pepper', 'Red pepper flakes'],
      instructions: 'Toast bread. Mash avocado and spread on toast. Cook eggs sunny side up. Place eggs on toast and season with salt, pepper, and red pepper flakes.'
    },
  ],
  lunch: [
    {
      name: 'Mediterranean Chickpea Salad',
      calories: 320,
      protein: 12,
      carbs: 35,
      fat: 18,
      prepTime: 20,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop',
      ingredients: ['1 cup chickpeas', '1 cup cucumber', '1 cup cherry tomatoes', '1/4 cup feta cheese', '2 tbsp olive oil', '1 tbsp lemon juice', 'Salt', 'Pepper'],
      instructions: 'Combine chickpeas, diced cucumber, halved cherry tomatoes, and crumbled feta in a bowl. Dress with olive oil, lemon juice, salt, and pepper.'
    },
    {
      name: 'Turkey & Avocado Wrap',
      calories: 450,
      protein: 28,
      carbs: 40,
      fat: 22,
      prepTime: 10,
      image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=1470&auto=format&fit=crop',
      ingredients: ['1 whole wheat wrap', '4 oz turkey breast', '1/2 avocado', 'Lettuce', 'Tomato', '1 tbsp hummus'],
      instructions: 'Spread hummus on wrap. Layer turkey, sliced avocado, lettuce, and tomato. Roll up tightly and slice in half.'
    },
  ],
  dinner: [
    {
      name: 'Grilled Salmon with Quinoa',
      calories: 520,
      protein: 40,
      carbs: 38,
      fat: 22,
      prepTime: 30,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1470&auto=format&fit=crop',
      ingredients: ['6 oz salmon fillet', '1/2 cup quinoa', '1 cup mixed vegetables', '1 tbsp olive oil', 'Lemon', 'Salt', 'Pepper', 'Herbs'],
      instructions: 'Cook quinoa according to package instructions. Season salmon with salt, pepper, and herbs. Grill for 4-5 minutes per side. Sauté vegetables in olive oil. Serve salmon over quinoa with vegetables on the side and a squeeze of lemon.'
    },
    {
      name: 'Chicken Stir-Fry',
      calories: 480,
      protein: 35,
      carbs: 42,
      fat: 18,
      prepTime: 25,
      image: 'https://images.unsplash.com/photo-1512058556646-c4da40fba323?q=80&w=1472&auto=format&fit=crop',
      ingredients: ['5 oz chicken breast', '2 cups mixed vegetables', '1/2 cup brown rice', '2 tbsp stir-fry sauce', '1 tsp sesame oil', 'Garlic', 'Ginger'],
      instructions: 'Cook rice according to package instructions. Slice chicken and stir-fry with minced garlic and ginger. Add vegetables and continue to cook. Add sauce and sesame oil. Serve over rice.'
    }
  ],
  snacks: [
    {
      name: 'Greek Yogurt with Berries',
      calories: 180,
      protein: 18,
      carbs: 15,
      fat: 6,
      prepTime: 5,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1632&auto=format&fit=crop',
      ingredients: ['1 cup Greek yogurt', '1/2 cup mixed berries', '1 tsp honey', '1 tbsp chia seeds'],
      instructions: 'Top Greek yogurt with berries, honey, and chia seeds.'
    },
    {
      name: 'Apple with Almond Butter',
      calories: 220,
      protein: 6,
      carbs: 25,
      fat: 13,
      prepTime: 2,
      image: 'https://images.unsplash.com/photo-1568093858174-0f391ea21c45?q=80&w=1470&auto=format&fit=crop',
      ingredients: ['1 medium apple', '2 tbsp almond butter', 'Cinnamon (optional)'],
      instructions: 'Slice apple and serve with almond butter for dipping. Sprinkle with cinnamon if desired.'
    }
  ]
};

interface Preferences {
  excludeIngredients: string;
  timeConstraint: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isKeto: boolean;
  isLowCarb: boolean;
  isHighProtein: boolean;
  isLowFat: boolean;
}

const MealGenerator = () => {
  const [calories, setCalories] = useState(2000);
  const [dietType, setDietType] = useState('balanced');
  const [generating, setGenerating] = useState(false);
  const [meals, setMeals] = useState<any>(null);
  const [activeDay, setActiveDay] = useState('monday');
  const [activeMealType, setActiveMealType] = useState('breakfast');
  const [preferences, setPreferences] = useState<Preferences>({
    excludeIngredients: '',
    timeConstraint: 30,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isDairyFree: false,
    isKeto: false,
    isLowCarb: false,
    isHighProtein: false,
    isLowFat: false,
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Log the current state values
      console.log('Current state values:', {
        calories,
        dietType,
        timeConstraint: preferences.timeConstraint,
        preferences
      });

      // Validate required fields before sending
      if (!calories || !dietType || !preferences.timeConstraint) {
        console.error('Missing required fields:', { calories, dietType, timeConstraint: preferences.timeConstraint });
        return;
      }

      const requestData = {
        dailyCalories: Number(calories),
        dietType: String(dietType),
        excludeIngredients: preferences.excludeIngredients.trim() ? preferences.excludeIngredients.split(',').map(i => i.trim()) : [],
        preparationTime: Number(preferences.timeConstraint),
        isVegetarian: Boolean(preferences.isVegetarian),
        isVegan: Boolean(preferences.isVegan),
        isGlutenFree: Boolean(preferences.isGlutenFree),
        isDairyFree: Boolean(preferences.isDairyFree),
        isKeto: Boolean(preferences.isKeto),
        isLowCarb: Boolean(preferences.isLowCarb),
        isHighProtein: Boolean(preferences.isHighProtein),
        isLowFat: Boolean(preferences.isLowFat)
      };

      // Log the request data before sending
      console.log('Request data being sent:', requestData);

      const response = await axios.post('/api/user/generate-meal-plan', requestData);

      if (response.data.success) {
        // Store the meal plan data
        setMeals(response.data.data.meal_plan);
      } else {
        console.error('Failed to generate meal plan:', response.data.error);
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setMeals(null);
    setPreferences({
      excludeIngredients: '',
      timeConstraint: 30,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isDairyFree: false,
      isKeto: false,
      isLowCarb: false,
      isHighProtein: false,
      isLowFat: false,
    });
  };

  const handleExcludeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({ ...preferences, excludeIngredients: e.target.value });
  };

  const handleTimeChange = (value: number[]) => {
    setPreferences({ ...preferences, timeConstraint: value[0] });
  };

  const handleDietaryPreferenceChange = (key: keyof Preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="container max-w-6xl py-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">AI Meal Generator</h1>
        <p className="text-lg text-muted-foreground">Create personalized meal plans based on your preferences and nutrition goals</p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Meal Generator Form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Utensils className="w-5 h-5 mr-2 text-primary" />
                Meal Preferences
              </CardTitle>
              <CardDescription>Customize your meal plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Calories</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{calories} kcal</span>
                  <span className="text-xs text-muted-foreground">Recommended for your profile</span>
                </div>
                <Slider
                  defaultValue={[2000]}
                  min={1200}
                  max={3500}
                  step={50}
                  onValueChange={(value) => setCalories(value[0])}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Diet Type</label>
                <Select value={dietType} onValueChange={setDietType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a diet type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dietTypes.map((diet) => (
                      <SelectItem key={diet.value} value={diet.value}>{diet.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Exclude Ingredients</label>
                <Input 
                  placeholder="e.g. nuts, shellfish, dairy" 
                  value={preferences.excludeIngredients}
                  onChange={handleExcludeChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Preparation Time</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{preferences.timeConstraint} minutes</span>
                </div>
                <Slider
                  defaultValue={[30]}
                  min={5}
                  max={60}
                  step={5}
                  onValueChange={handleTimeChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Dietary Restrictions</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(preferences)
                    .filter(([key]) => key.startsWith('is'))
                    .map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={() => handleDietaryPreferenceChange(key as keyof Preferences)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          {key.replace('is', '').replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {!meals ? (
                <Button onClick={handleGenerate} className="w-full" disabled={generating}>
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating Plan
                    </>
                  ) : (
                    <>
                      <ChefHat className="w-4 h-4 mr-2" /> Generate Meal Plan
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleReset} variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" /> Reset Preferences
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Generated Meal Plans */}
        <div className="md:col-span-2">
          {!meals ? (
            <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed">
              <div className="flex flex-col items-center text-center p-8">
                <Salad className="w-16 h-16 mb-4 text-muted-foreground/60" />
                <h3 className="text-lg font-medium mb-2">No Meal Plan Generated Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Adjust your preferences and generate a personalized meal plan to see results here.
                </p>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Weekly Meal Plan</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2">
                    <SaveIcon className="w-4 h-4" /> Save Plan
                  </Button>
                </div>
                <CardDescription>
                  {meals.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeDay} onValueChange={setActiveDay}>
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    {weekDays.map((day) => (
                      <TabsTrigger
                        key={day.value}
                        value={day.value}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                      >
                        {day.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {weekDays.map((day) => (
                    <TabsContent key={day.value} value={day.value} className="pt-4">
                      <Tabs value={activeMealType} onValueChange={setActiveMealType}>
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                          {mealTypes.map((type) => (
                            <TabsTrigger
                              key={type.value}
                              value={type.value}
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                              {type.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {mealTypes.map((type) => (
                          <TabsContent key={type.value} value={type.value} className="pt-4">
                            <div className="grid gap-6 sm:grid-cols-2">
                              {meals.weekly_plan[day.value]?.[type.value]?.map((meal: any, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                  <Card className="overflow-hidden">
                                    <div className="relative h-48">
                                      <img
                                        src={meal.image}
                                        alt={meal.name}
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                    <CardHeader className="pb-2">
                                      <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{meal.name}</CardTitle>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                          <Clock className="w-4 h-4 mr-1" /> {meal.prepTime} min
                                        </div>
                                      </div>
                                      <div className="flex gap-3 text-sm">
                                        <div className="flex flex-col items-center">
                                          <span className="font-bold">{meal.calories}</span>
                                          <span className="text-xs text-muted-foreground">cal</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                          <span className="font-bold">{meal.protein}g</span>
                                          <span className="text-xs text-muted-foreground">protein</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                          <span className="font-bold">{meal.carbs}g</span>
                                          <span className="text-xs text-muted-foreground">carbs</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                          <span className="font-bold">{meal.fat}g</span>
                                          <span className="text-xs text-muted-foreground">fat</span>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                      <div className="space-y-3">
                                        <div>
                                          <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
                                          <ul className="text-sm text-muted-foreground">
                                            {meal.ingredients.map((ingredient: string, idx: number) => (
                                              <li key={idx} className="list-disc ml-4">{ingredient}</li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium mb-1">Instructions:</h4>
                                          <p className="text-sm text-muted-foreground">{meal.instructions}</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealGenerator; 