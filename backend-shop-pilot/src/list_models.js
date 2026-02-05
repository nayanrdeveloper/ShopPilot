const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // For listing models, we might need to use the model manager or just try a basic one
    // But the SDK exposes listModels differently depending on version.
    // Let's try a direct approach or fallback to 'gemini-pro' which is usually standard.
    console.log('Checking API Key...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Test');
    console.log('gemini-pro is WORKING.');
  } catch (error) {
    console.log('gemini-pro FAILED:', error.message);
  }

  try {
    console.log('Checking gemini-1.5-flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Test');
    console.log('gemini-1.5-flash is WORKING.');
  } catch (error) {
    console.log('gemini-1.5-flash FAILED:', error.message);
  }
}

listModels();
