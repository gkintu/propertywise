// npx tsx open-ai-sdk-docs.ts to test the file
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

async function main() {
  const userWord = 'tesla'; // Try changing this to anything

  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash-lite-preview-06-17',
    contents: `You are a stand-up comedian. When the user gives you a single word, you respond with a very short, funny joke based on that word. Keep it light and witty.

User word: ${userWord}`,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking for better performance
      },
    }
  });

  console.log(response.text);
}

main();
