
import { GoogleGenAI, Type } from "@google/genai";
import { Todo, Priority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const breakdownTask = async (taskText: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down the following complex task into 3-5 smaller, actionable sub-tasks: "${taskText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error breaking down task:", error);
    return [];
  }
};

export const getSmartInsights = async (todos: Todo[]): Promise<{ summary: string, suggestions: string[] }> => {
  try {
    const tasksSummary = todos
      .map(t => `- [${t.priority}] ${t.text} (${t.completed ? 'Done' : 'Pending'})`)
      .join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these tasks and provide a short motivational summary (2 sentences) and 3 specific suggestions for better productivity:\n${tasksSummary}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "suggestions"]
        }
      }
    });

    return JSON.parse(response.text || '{"summary": "", "suggestions": []}');
  } catch (error) {
    console.error("Error getting AI insights:", error);
    return { summary: "Ready to conquer your day?", suggestions: ["Try breaking down your biggest task first."] };
  }
};

export const suggestPriority = async (taskText: string): Promise<Priority> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Categorize the priority of this task as Low, Medium, or High based on its description: "${taskText}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
                    },
                    required: ["priority"]
                }
            }
        });
        const result = JSON.parse(response.text || '{"priority": "Medium"}');
        return result.priority as Priority;
    } catch (e) {
        return Priority.Medium;
    }
}
