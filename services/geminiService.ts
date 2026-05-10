
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

let aiInstance: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
    if (!aiInstance) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY environment variable not set. AI features will not work.");
            throw new Error("GEMINI_API_KEY environment variable not set");
        }
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
};

export const generateDescription = async (productName: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const prompt = `Generate a compelling, short and friendly product description for a SpareXchange listing. The product is: "${productName}". Highlight its potential benefits and condition in a concise paragraph. Do not use markdown.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text ?? "A premium automotive part designed for performance.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "This product doesn't have an AI generated description yet. A premium aftermarket part for best performance.";
  }
};

export const generateChatReply = async (productName: string, conversationHistory: ChatMessage[]): Promise<string> => {
    try {
        const ai = getAIClient();
        const history = conversationHistory
            .map(msg => `${msg.sender === 'currentUser' ? 'Buyer' : 'Seller'}: ${msg.text}`)
            .join('\n');

        const prompt = `You are a friendly and helpful seller on the SpareXchange marketplace. A buyer is messaging you about a product you are selling. Be concise, conversational, and helpful. Do not mention that you are an AI.

Product Name: "${productName}"

Conversation History (the last message is the new one from the buyer):
${history}

Your (Seller) Reply:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for chat reply:", error);
        return "Sorry, I'm having a bit of trouble connecting right now. Please try again in a moment.";
    }
};
