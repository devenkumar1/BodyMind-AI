import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Dumbbell, 
  Timer, 
  Calendar, 
  Target, 
  Trophy, 
  RefreshCw, 
  Download, 
  Flame,
  Heart,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const fitnessGoals = [
  { value: 'strength', label: 'Build Strength' },
  { value: 'muscle', label: 'Muscle Gain' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'toning', label: 'Toning & Definition' },
  { value: 'flexibility', label: 'Flexibility' },
];

const equipmentOptions = [
  { id: 'bodyweight', label: 'Bodyweight Only' },
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'bench', label: 'Bench' },
  { id: 'barbell', label: 'Barbell' },
  { id: 'kettlebell', label: 'Kettlebell' },
  { id: 'resistance-bands', label: 'Resistance Bands' },
  { id: 'cables', label: 'Cable Machine' },
  { id: 'pullup-bar', label: 'Pull-up Bar' },
];

// Sample workouts for demonstration
const sampleWorkouts = {
  upper: [
    {
      name: "Push-Up",
      sets: 3, 
      reps: "10-12",
      rest: 60,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.",
      muscles: ["Chest", "Shoulders", "Triceps"],
      difficulty: "Beginner",
      video: "https://www.youtube.com/watch?v=IODxDxX7oi4"
    },
    {
      name: "Dumbbell Bench Press",
      sets: 4, 
      reps: "8-10",
      rest: 90,
      image: "https://images.unsplash.com/photo-1534368786749-d80adbc0d320?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Lie on a bench with a dumbbell in each hand. Push the weights up until your arms are straight, then lower them back down.",
      muscles: ["Chest", "Shoulders", "Triceps"],
      difficulty: "Intermediate",
      video: "https://www.youtube.com/watch?v=QwuUZ5wgQOk"
    },
    {
      name: "Pull-Up",
      sets: 3, 
      reps: "8-10",
      rest: 90,
      image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1452&q=80",
      description: "Hang from a bar with palms facing away. Pull yourself up until your chin is over the bar, then lower back down with control.",
      muscles: ["Back", "Biceps", "Forearms"],
      difficulty: "Intermediate",
      video: "https://www.youtube.com/watch?v=eGo4IYlbE5g"
    },
    {
      name: "Dumbbell Shoulder Press",
      sets: 3, 
      reps: "10-12",
      rest: 60,
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      description: "Sit or stand with a dumbbell in each hand at shoulder height. Press the weights up until your arms are straight, then lower them back down.",
      muscles: ["Shoulders", "Triceps"],
      difficulty: "Beginner",
      video: "https://www.youtube.com/watch?v=qEwKCR5JCog"
    }
  ],
  lower: [
    {
      name: "Squat",
      sets: 4, 
      reps: "12-15",
      rest: 90,
      image: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      description: "Stand with feet shoulder-width apart. Lower your body as if sitting in a chair, keeping your chest up. Push through your heels to return to standing.",
      muscles: ["Quadriceps", "Glutes", "Hamstrings"],
      difficulty: "Beginner",
      video: "https://www.youtube.com/watch?v=YaXPRqUwItQ"
    },
    {
      name: "Romanian Deadlift",
      sets: 3, 
      reps: "10-12",
      rest: 90,
      image: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      description: "Hold a barbell or dumbbells in front of your thighs. Hinge at the hips while keeping your back straight, lowering the weight towards the floor. Return to standing by driving your hips forward.",
      muscles: ["Hamstrings", "Glutes", "Lower Back"],
      difficulty: "Intermediate",
      video: "https://www.youtube.com/watch?v=5rIqN1XZ5jU"
    },
    {
      name: "Lunges",
      sets: 3, 
      reps: "10-12 each leg",
      rest: 60,
      image: "https://images.unsplash.com/photo-1434608519344-49d8a9e40874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Step forward with one leg and lower your body until both knees are bent at a 90-degree angle. Push off the front foot to return to the starting position.",
      muscles: ["Quadriceps", "Glutes", "Hamstrings"],
      difficulty: "Beginner",
      video: "https://www.youtube.com/watch?v=QOVaHwm-Q6U"
    },
    {
      name: "Calf Raises",
      sets: 3, 
      reps: "15-20",
      rest: 45,
      image: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Stand with feet hip-width apart. Rise up onto the balls of your feet, then lower your heels back down.",
      muscles: ["Calves"],
      difficulty: "Beginner",
      video: "https://www.youtube.com/watch?v=gwLzBJYoWlI"
    }
  ],
  full: [
    {
      name: "Burpee",
      sets: 3, 
      reps: "10-15",
      rest: 60,
      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      description: "Start standing, then squat down and place hands on floor. Jump feet back to a plank, perform a push-up, jump feet forward, then explosively jump up with arms overhead.",
      muscles: ["Full Body", "Cardiovascular"],
      difficulty: "Intermediate",
      video: "https://www.youtube.com/watch?v=TU8QYVW0gDU"
    },
    {
      name: "Kettlebell Swing",
      sets: 3, 
      reps: "15-20",
      rest: 60,
      image: "https://images.unsplash.com/photo-1604247584233-99c3f9ea18f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Stand with feet shoulder-width apart, holding a kettlebell with both hands. Hinge at the hips and swing the kettlebell between your legs, then thrust your hips forward to swing the kettlebell to chest height.",
      muscles: ["Glutes", "Hamstrings", "Core", "Shoulders"],
      difficulty: "Intermediate",
      video: "https://www.youtube.com/watch?v=Buz6gaVzVZs"
    },
    {
      name: "Mountain Climber",
      sets: 3, 
      reps: "20-30 seconds",
      rest: 45,
      image: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      description: "Start in a plank position. Rapidly alternate bringing your knees toward your chest, as if running in place in a plank position.",
      muscles: ["Core", "Shoulders", "Cardiovascular"],
      difficulty: "Beginner",
      video: "https://www.youtube.com/watch?v=nmwgirgXLYM"
    },
    {
      name: "Turkish Get-Up",
      sets: 2, 
      reps: "5-6 each side",
      rest: 90,
      image: "https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      description: "Lie on your back holding a kettlebell or dumbbell above your shoulder. Rise to a standing position while keeping the weight overhead, then reverse the movement to return to the starting position.",
      muscles: ["Full Body", "Core", "Shoulders", "Stability"],
      difficulty: "Advanced",
      video: "https://www.youtube.com/watch?v=jFK8FOGnXLw"
    }
  ]
};

const WorkoutGenerator = () => {
  const [fitnessLevel, setFitnessLevel] = useState('intermediate');
  const [fitnessGoal, setFitnessGoal] = useState('strength');
  const [workoutDuration, setWorkoutDuration] = useState(45);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(4);
  const [includeWarmup, setIncludeWarmup] = useState(true);
  const [includeCooldown, setIncludeCooldown] = useState(true);
  const [equipment, setEquipment] = useState<string[]>(['bodyweight', 'dumbbells']);
  const [generating, setGenerating] = useState(false);
  const [workouts, setWorkouts] = useState<any>(null);
  const [activeWorkoutType, setActiveWorkoutType] = useState('upper');
  
  const handleEquipmentChange = (checked: boolean, id: string) => {
    if (checked) {
      setEquipment([...equipment, id]);
    } else {
      setEquipment(equipment.filter(item => item !== id));
    }
  };
  
  const handleGenerate = () => {
    setGenerating(true);
    
    // Simulating API call delay
    setTimeout(() => {
      setWorkouts(sampleWorkouts);
      setGenerating(false);
    }, 1500);
  };
  
  const handleReset = () => {
    setWorkouts(null);
  };

  return (
    <div className="container max-w-6xl py-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">AI Workout Generator</h1>
        <p className="text-lg text-muted-foreground">Create personalized workout routines based on your goals and available equipment</p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Workout Generator Form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="w-5 h-5 mr-2 text-primary" />
                Workout Preferences
              </CardTitle>
              <CardDescription>Customize your workout plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fitness Level</label>
                <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    {fitnessLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fitness Goal</label>
                <Select value={fitnessGoal} onValueChange={setFitnessGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {fitnessGoals.map((goal) => (
                      <SelectItem key={goal.value} value={goal.value}>{goal.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Workout Duration</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{workoutDuration} minutes</span>
                </div>
                <Slider
                  defaultValue={[45]}
                  min={15}
                  max={90}
                  step={5}
                  onValueChange={(value) => setWorkoutDuration(value[0])}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Workouts Per Week</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{workoutsPerWeek} workouts</span>
                </div>
                <Slider
                  defaultValue={[4]}
                  min={1}
                  max={7}
                  step={1}
                  onValueChange={(value) => setWorkoutsPerWeek(value[0])}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Available Equipment</label>
                <div className="grid grid-cols-2 gap-2">
                  {equipmentOptions.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={item.id}
                        checked={equipment.includes(item.id)}
                        onCheckedChange={(checked) => handleEquipmentChange(checked as boolean, item.id)}
                      />
                      <Label htmlFor={item.id} className="text-sm">{item.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Additional Options</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="warmup" className="text-sm">Include Warm-up Routine</Label>
                    <Switch 
                      id="warmup" 
                      checked={includeWarmup}
                      onCheckedChange={setIncludeWarmup}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cooldown" className="text-sm">Include Cool-down Routine</Label>
                    <Switch 
                      id="cooldown" 
                      checked={includeCooldown}
                      onCheckedChange={setIncludeCooldown}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {!workouts ? (
                <Button onClick={handleGenerate} className="w-full" disabled={generating}>
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating Workouts
                    </>
                  ) : (
                    <>
                      <Dumbbell className="w-4 h-4 mr-2" /> Generate Workout Plan
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleReset} variant="outline" className="w-full">
                  <Target className="w-4 h-4 mr-2" /> Reset Preferences
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Generated Workout Plans */}
        <div className="md:col-span-2">
          {!workouts ? (
            <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed">
              <div className="flex flex-col items-center text-center p-8">
                <Dumbbell className="w-16 h-16 mb-4 text-muted-foreground/60" />
                <h3 className="text-lg font-medium mb-2">No Workout Plan Generated Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Adjust your preferences and generate a personalized workout plan to see results here.
                </p>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Personalized Workout Plan</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" /> Save Plan
                  </Button>
                </div>
                <CardDescription>
                  {workoutsPerWeek}x per week, {workoutDuration} min, {fitnessGoal} focus for {fitnessLevel} level
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeWorkoutType} onValueChange={setActiveWorkoutType}>
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="upper"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Upper Body
                    </TabsTrigger>
                    <TabsTrigger
                      value="lower"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Lower Body
                    </TabsTrigger>
                    <TabsTrigger
                      value="full"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Full Body
                    </TabsTrigger>
                  </TabsList>
                  
                  {Object.keys(workouts).map((type) => (
                    <TabsContent key={type} value={type} className="pt-4">
                      {/* Workout Summary */}
                      <div className="flex items-center justify-between mb-6 p-3 bg-muted/50 rounded-lg">
                        <div className="flex gap-6">
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{workoutDuration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">~320 calories</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Moderate intensity</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1">
                          Schedule <Calendar className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                      
                      {/* Exercise List */}
                      <div className="space-y-4">
                        {workouts[type].map((exercise: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card>
                              <div className="flex flex-col sm:flex-row">
                                <div className="relative h-48 sm:h-auto sm:w-1/3 overflow-hidden rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none">
                                  <img
                                    src={exercise.image}
                                    alt={exercise.name}
                                    className="object-cover w-full h-full"
                                  />
                                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded text-xs font-medium">
                                    {exercise.difficulty}
                                  </div>
                                </div>
                                <div className="p-4 sm:w-2/3">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold">{exercise.name}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <div className="px-2 py-1 rounded-full bg-primary/10 text-xs">
                                        {exercise.sets} sets × {exercise.reps}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                                  
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {exercise.muscles.map((muscle: string, i: number) => (
                                      <span key={i} className="px-2 py-0.5 bg-muted text-xs rounded-full">
                                        {muscle}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  <div className="flex justify-between items-center">
                                    <div className="text-sm text-muted-foreground">
                                      <span className="font-medium">Rest:</span> {exercise.rest} sec
                                    </div>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" className="h-8 text-xs">
                                        View Demo
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                                        Replace
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Start Workout Button */}
                      <div className="flex justify-center mt-8">
                        <Button className="gap-2">
                          Start Workout <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
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

export default WorkoutGenerator; 