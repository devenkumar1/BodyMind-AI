import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Dumbbell, Timer, Activity } from "lucide-react";

interface Exercise {
    name: string;
    sets: number;
    reps: string;
    description: string;
}

interface WarmUpExercise {
    name: string;
    duration: string;
    description: string;
}

interface WorkoutPlan {
    description: string;
    schedule: {
        [key: string]: string;
    };
    exercises: Exercise[];
    warm_up: {
        description: string;
        exercises: WarmUpExercise[];
    };
    cool_down: {
        description: string;
        exercises: WarmUpExercise[];
    };
}

interface WorkoutPlanDisplayProps {
    plan: WorkoutPlan | null;
}

export function WorkoutPlanDisplay({ plan }: WorkoutPlanDisplayProps) {
    if (!plan) {
        return null;
    }

    return (
        <div className="space-y-6 p-4">
            {/* Overall Description */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Workout Plan Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{plan.description}</p>
                </CardContent>
            </Card>

            {/* Weekly Schedule */}
            {plan.schedule && Object.keys(plan.schedule).length > 0 && (
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Weekly Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(plan.schedule).map(([day, workout]) => (
                                <div key={day} className="p-3 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm">
                                    <h4 className="font-semibold capitalize">{day}</h4>
                                    <p className="text-sm text-muted-foreground">{workout}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Warm-up Section */}
            {plan.warm_up && plan.warm_up.exercises && plan.warm_up.exercises.length > 0 && (
                <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Timer className="h-5 w-5" />
                            Warm-up
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">{plan.warm_up.description}</p>
                        <div className="grid gap-4">
                            {plan.warm_up.exercises.map((exercise, index) => (
                                <div key={index} className="p-4 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm">
                                    <h4 className="font-semibold">{exercise.name}</h4>
                                    <Badge variant="secondary" className="mt-2">{exercise.duration}</Badge>
                                    <p className="text-sm text-muted-foreground mt-2">{exercise.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Exercises */}
            {plan.exercises && plan.exercises.length > 0 && (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Dumbbell className="h-5 w-5" />
                            Main Exercises
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="grid gap-4">
                                {plan.exercises.map((exercise, index) => (
                                    <div key={index} className="p-4 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm">
                                        <h4 className="font-semibold">{exercise.name}</h4>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="secondary">{exercise.sets} sets</Badge>
                                            <Badge variant="secondary">{exercise.reps} reps</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">{exercise.description}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}

            {/* Cool-down Section */}
            {plan.cool_down && plan.cool_down.exercises && plan.cool_down.exercises.length > 0 && (
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Timer className="h-5 w-5" />
                            Cool-down
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">{plan.cool_down.description}</p>
                        <div className="grid gap-4">
                            {plan.cool_down.exercises.map((exercise, index) => (
                                <div key={index} className="p-4 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm">
                                    <h4 className="font-semibold">{exercise.name}</h4>
                                    <Badge variant="secondary" className="mt-2">{exercise.duration}</Badge>
                                    <p className="text-sm text-muted-foreground mt-2">{exercise.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 