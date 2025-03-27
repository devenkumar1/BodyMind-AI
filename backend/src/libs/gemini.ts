import { GoogleGenAI } from "@google/genai";
import dotenv from  'dotenv';
dotenv.config();

export async function geminiSetup(){

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}
await main();
}
