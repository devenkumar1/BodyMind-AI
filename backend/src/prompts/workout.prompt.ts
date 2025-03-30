import { workAttt } from "../libs/workoutPlanGenerator";

export const workoutPrompt = ({fitnessLevel, fitnessGoal, duration, daysPerweek}: workAttt) => {
    return `Generate a detailed workout plan for a ${fitnessLevel} person who wants to ${fitnessGoal} for ${duration} per day and ${daysPerweek} days per week. 
    Return the response in a clean, properly formatted JSON structure with the following schema:
    {
        "workout_plan": {
            "description": "Overall plan description",
            "schedule": {
                "monday": "Workout type",
                "tuesday": "Workout type",
                "wednesday": "Workout type",
                "thursday": "Workout type",
                "friday": "Workout type",
                "saturday": "Workout type",
                "sunday": "Workout type"
            },
            "daily_workouts": {
                "monday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": number,
                            "reps": "number or AMRAP",
                            "description": "Detailed exercise description",
                            "gif_url": "URL to exercise demonstration GIF"
                        }
                    ]
                },
                "tuesday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": number,
                            "reps": "number or AMRAP",
                            "description": "Detailed exercise description",
                            "gif_url": "URL to exercise demonstration GIF"
                        }
                    ]
                },
                "wednesday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": number,
                            "reps": "number or AMRAP",
                            "description": "Detailed exercise description",
                            "gif_url": "URL to exercise demonstration GIF"
                        }
                    ]
                },
                "thursday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": number,
                            "reps": "number or AMRAP",
                            "description": "Detailed exercise description",
                            "gif_url": "URL to exercise demonstration GIF"
                        }
                    ]
                },
                "friday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": number,
                            "reps": "number or AMRAP",
                            "description": "Detailed exercise description",
                            "gif_url": "URL to exercise demonstration GIF"
                        }
                    ]
                },
                "saturday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": number,
                            "reps": "number or AMRAP",
                            "description": "Detailed exercise description",
                            "gif_url": "URL to exercise demonstration GIF"
                        }
                    ]
                },
                "sunday": {
                    "exercises": [
                        {
                            "name": "Exercise name",
                            "sets": number,
                            "reps": "number or AMRAP",
                            "description": "Detailed exercise description",
                            "gif_url": "URL to exercise demonstration GIF"
                        }
                    ]
                }
            },
            "warm_up": {
                "description": "Warm-up instructions",
                "exercises": [
                    {
                        "name": "Warm-up exercise name",
                        "duration": "Duration in seconds or minutes",
                        "description": "Warm-up exercise description",
                        "gif_url": "URL to warm-up exercise demonstration GIF"
                    }
                ]
            },
            "cool_down": {
                "description": "Cool-down instructions",
                "exercises": [
                    {
                        "name": "Cool-down exercise name",
                        "duration": "Duration in seconds or minutes",
                        "description": "Cool-down exercise description",
                        "gif_url": "URL to cool-down exercise demonstration GIF"
                    }
                ]
            }
        }
    }
    
    Ensure the response is valid JSON and follows this exact structure. For each day, include 4-6 main exercises, and for the entire plan include 3-4 warm-up exercises and 2-3 cool-down exercises. Make sure to provide appropriate GIF URLs for each exercise that demonstrate the proper form and movement.`;
}

export default workoutPrompt;