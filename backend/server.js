import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = 3000;
const app = express();

app.use(cors()); 
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

const getAnalysisPrompt = (promptToAnalyze) => {
    return `You are The Perfect Prompt Analyst. Your job is to analyze the user's prompt and return a structured JSON object. The user's prompt is for another AI, you are analyzing how well it is written. You must respond with only a valid JSON object and nothing else. No commentary, no explanations, no markdown.

    The JSON object must have this exact structure:
    {
     "overallPercentage": <a number 0-100>,
     "rating": "<a string like 'Good' or 'Excellent'>",
     "categoryScores": {
       "communication": <number 0-100>,
       "analysis": <number 0-100>,
       "response": <number 0-100>,
       "feedback": <number 0-100>,
       "collaboration": <number 0-100>
     },
     "feedback": {
       "strength": "<string of a key positive aspect>",
       "suggestion": "<string of a key suggestion for improvement>",
       "critical": "<string of a critical issue, or empty string>"
     }
    }

    Here is the user's prompt to analyze:
    '${promptToAnalyze}'`;
};

app.post('/analyze', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        const instruction = getAnalysisPrompt(prompt);
        const result = await model.generateContent(instruction);
        const rawResponse = await result.response.text();

        // This is the missing line that defines 'match'
        const match = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);

        // This line can now use 'match' without an error
        const cleanResponse = match ? match[1] : rawResponse;
        
        const analysisResult = JSON.parse(cleanResponse);
        res.json(analysisResult);

    } catch (error) {
        console.error("Error during AI analysis:", error);
        res.status(500).json({ error: "Failed to analyze prompt." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});