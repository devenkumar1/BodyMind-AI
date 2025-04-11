import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Salad } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
}

interface DailyMeals {
  meals: Meal[];
}

interface MealPlan {
  _id: string;
  name: string;
  description: string;
  dailyCalories: number;
  weeklyPlan: {
    [key: string]: DailyMeals;
  };
  createdAt: string;
}

export function MealPlanView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('monday');

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/saved-meal-plans/${id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setMealPlan(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching meal plan:', error);
        toast.error('Failed to fetch meal plan');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMealPlan();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Salad className="w-12 h-12 mx-auto text-muted-foreground" />
              <h2 className="mt-4 text-lg font-medium">Meal Plan Not Found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The meal plan you're looking for doesn't exist or has been deleted.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/profile')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const days = Object.keys(mealPlan.weeklyPlan || {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{mealPlan.name}</CardTitle>
            <CardDescription>{mealPlan.description}</CardDescription>
            <div className="mt-2 text-sm text-muted-foreground">
              Daily Calories: {mealPlan.dailyCalories}
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeDay} onValueChange={setActiveDay}>
          <TabsList className="grid grid-cols-7 mb-4">
            {days.map((day: string) => (
              <TabsTrigger
                key={day}
                value={day}
                className="capitalize"
              >
                {day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {days.map((day: string) => (
            <TabsContent key={day} value={day}>
              <div className="space-y-6">
                {mealPlan.weeklyPlan[day]?.meals.map((meal: Meal, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{meal.name}</CardTitle>
                      <CardDescription>
                        {meal.calories} calories • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Ingredients</h4>
                          <ul className="list-disc pl-4 space-y-1">
                            {meal.ingredients.map((ingredient: string, i: number) => (
                              <li key={i} className="text-sm">
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Instructions</h4>
                          <ol className="list-decimal pl-4 space-y-1">
                            {meal.instructions.map((instruction: string, i: number) => (
                              <li key={i} className="text-sm">
                                {instruction}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}