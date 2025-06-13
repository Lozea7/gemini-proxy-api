import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt } = request.body;

    if (!prompt) {
        return response.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY; // 環境変数からAPIキーを取得

    if (!apiKey) {
        console.error('API key is not set in environment variables.');
        return response.status(500).json({ error: 'API key is not configured.' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        response.status(200).json({ generatedText: text });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        response.status(500).json({ error: 'Failed to generate content from AI.', details: error.message });
    }
}
