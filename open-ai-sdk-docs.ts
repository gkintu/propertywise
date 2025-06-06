import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://yourdomain.com', // Replace with your site URL
    'X-Title': 'ComedyBot', // Replace with your app's title
  },
});

async function main() {
  const userWord = 'tesla'; // Try changing this to anything

  const completion = await openai.chat.completions.create({
    model: 'google/gemma-3-27b-it:free',
    messages: [
      {
        role: 'system',
        content: 'You are a stand-up comedian. When the user gives you a single word, you respond with a very short, funny joke based on that word. Keep it light and witty.',
      },
      {
        role: 'user',
        content: userWord
      },
    ],
  });

  console.log(completion.choices[0].message.content);
}

main();
