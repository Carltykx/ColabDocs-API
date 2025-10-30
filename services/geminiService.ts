
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will use mock data.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const getMockImprovement = (content: string): Promise<string> => {
    return new Promise(resolve => setTimeout(() => {
        resolve(content + "\n\n---\n*Mock AI improvement: This is a sample response as the API key is not configured.*");
    }, 1000));
}

export const improveDocumentWithAI = async (content: string): Promise<string> => {
  if (!ai) {
    return getMockImprovement(content);
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `You are an expert technical writer. Review the following markdown document. Improve it for clarity, conciseness, and correctness. Fix any grammar or spelling mistakes. Maintain the original markdown formatting. Only return the improved markdown content, without any additional commentary or preamble.

DOCUMENT:
---
${content}
---
`,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return content + "\n\n---\n*Error improving document with AI.*";
  }
};