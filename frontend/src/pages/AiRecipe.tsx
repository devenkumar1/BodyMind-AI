import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'; // Add SelectContent and SelectTrigger
import Input from '@/components/ui/Input';
import { Label } from '@radix-ui/react-label';

function AiRecipe() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [fitnessGoal, setFitnessGoal] = useState<string>('');
  const [generatedRecipe, setGeneratedRecipe] = useState<string | null>(null);

  const handleIngredientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (!ingredients.includes(value)) {
      setIngredients((prev) => [...prev, value]);
    }
  };

  const handleFitnessGoalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFitnessGoal(event.target.value);
  };

  const handleGenerateRecipe = () => {
    if (ingredients.length === 0 || !fitnessGoal) {
      alert("Please select ingredients and fitness goal");
      return;
    }

    const recipe = `Recipe for ${fitnessGoal} with ${ingredients.join(', ')}.`;
    setGeneratedRecipe(recipe);
  };

  return (
    <div className="flex flex-col items-center md:pt-4 p-6 min-h-screen">
      <h1 className="text-3xl font-bold dark:text-white text-gray-800 mb-6">Recipe Generator</h1>

      <div className="w-full max-w-md bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <Label htmlFor="ingredients">Ingredients</Label>
          <Input
            id="ingredients"
            type="text"
            placeholder="Add ingredient"
            className="w-full mt-2"
            onChange={handleIngredientChange}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="fitnessGoal">Fitness Goal</Label>
          <Select value={fitnessGoal} onValueChange={setFitnessGoal} className="mt-2">
            <SelectTrigger aria-label="Select fitness goal">
              <span>{fitnessGoal || "Select Goal"}</span>
              <ArrowDown className="ml-2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weight Loss">Weight Loss</SelectItem>
              <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
              <SelectItem value="Maintain Weight">Maintain Weight</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center mb-4">
          <Button onClick={handleGenerateRecipe} color="primary" size="lg">
            Generate Recipe
            <ArrowDown className="ml-2" />
          </Button>
        </div>

        {generatedRecipe && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-semibold">Generated Recipe</h3>
            <p>{generatedRecipe}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiRecipe;
