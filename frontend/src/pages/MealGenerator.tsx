import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/generate-meal-plan`, requestData);

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