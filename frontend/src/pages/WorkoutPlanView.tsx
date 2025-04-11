import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  description: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
}

interface DailyWorkout {
  warmUp: Exercise[];
  mainWorkout: Exercise[];
  coolDown: Exercise[];
}

interface WorkoutPlan {
  _id: string;
  name: string;
  description: string;
  schedule: {
    [key: string]: DailyWorkout;
  };
  createdAt: string;
}

export function WorkoutPlanView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('monday');

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/saved-workout-plans/${id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setWorkoutPlan(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching workout plan:', error);
        toast.error('Failed to fetch workout plan');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkoutPlan();
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

  if (!workoutPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground" />
              <h2 className="mt-4 text-lg font-medium">Workout Plan Not Found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The workout plan you're looking for doesn't exist or has been deleted.
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

  const renderExerciseList = (exercises: Exercise[], title: string) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h4 className="font-medium">{exercise.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sets</p>
                      <p className="font-medium">{exercise.sets}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reps</p>
                      <p className="font-medium">{exercise.reps}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rest Time</p>
                      <p className="font-medium">{exercise.restTime}s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Difficulty</p>
                      <p className="font-medium capitalize">{exercise.difficulty}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Equipment</p>
                    <p className="text-sm">{exercise.equipment}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Muscle Group</p>
                    <p className="text-sm">{exercise.muscleGroup}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Instructions</p>
                    <p className="text-sm">{exercise.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

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
            <CardTitle>{workoutPlan.name}</CardTitle>
            <CardDescription>{workoutPlan.description}</CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeDay} onValueChange={setActiveDay}>
          <TabsList className="grid grid-cols-7 mb-4">
            {Object.keys(workoutPlan.schedule).map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="capitalize"
              >
                {day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(workoutPlan.schedule).map(([day, workout]) => (
            <TabsContent key={day} value={day}>
              {renderExerciseList(workout.warmUp, 'Warm Up')}
              {renderExerciseList(workout.mainWorkout, 'Main Workout')}
              {renderExerciseList(workout.coolDown, 'Cool Down')}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}