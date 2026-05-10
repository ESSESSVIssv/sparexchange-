
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateDescription = async (productName: string): Promise<string> => {
  try {
    const prompt = `Generate a compelling, short and friendly product description for a SpareXchange listing. The product is: "${productName}". Highlight its potential benefits and condition in a concise paragraph. Do not use markdown.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate description from AI.");
  }
};

export const generateChatReply = async (productName: string, conversationHistory: ChatMessage[]): Promise<string> => {
    try {
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
