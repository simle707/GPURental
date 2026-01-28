import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const askGpuAdvisor = async (userQuery: string): Promise<string> => {
	if (!apiKey) {
		return "API Key is missing. Please configure process.env.API_KEY to use the AI Advisor.";
	}

	try {
		const response = await ai.models.generateContent({
			model: 'gemini-3-flash-preview',
			contents: userQuery,
			config: {
				systemInstruction: "You are an expert cloud infrastructure engineer specializing in GPU workloads. Advise the user on whether an NVIDIA RTX 4090 is suitable for their task, and how many they might need. Keep answers concise (under 100 words).",
			}
		});
		
		return response.text || "I couldn't generate a recommendation at this time.";
	} catch (error) {
		console.error("Gemini API Error:", error);
		return "Sorry, I encountered an error while analyzing your request.";
	}
};