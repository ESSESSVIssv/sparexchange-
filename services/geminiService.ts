
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

        return response.text ?? "I'm not sure what to say, but I'm here to help!";
    } catch (error) {
        console.error("Error calling Gemini API for chat reply:", error);
        return "Sorry, I'm having a bit of trouble connecting right now. Please try again in a moment.";
    }
};

export const analyzeProductImage = async (imageBase64: string, name: string, description: string): Promise<{ isValid: boolean; score: number; reason: string }> => {
    try {
        const ai = getAIClient();
        
        // Extract base64 info
        const base64Data = imageBase64.split(',')[1];
        let mimeType = 'image/jpeg';
        const mimeMatch = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        if (mimeMatch && mimeMatch.length > 1) {
            mimeType = mimeMatch[1];
        }

        const prompt = `You are a strict, expert AI Moderation and Quality Control agent for a premium automotive parts marketplace.
Your task is to analyze the provided image and compare it to the product title and description.

Title: "${name}"
Description: "${description}"

Evaluate the image based on:
1. Does the image actually show the item described?
2. Does the image look like a genuine photo of a product, or is it a random/unrelated image?
3. Quality checks (is it clear enough?).

Return EXACTLY a JSON string with NO markdown formatting, NO backticks, in this format:
{
  "isValid": boolean, // true if it matches well and is safe, false if mismatch, suspicious, or unsafe
  "score": number, // 0 to 100 confidence score
  "reason": string // short explanation for the verdict
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt,
                { inlineData: { data: base64Data, mimeType } }
            ]
        });

        const textResponse = response.text || "{}";
        const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(cleanedText);
        
        return {
            isValid: result.isValid ?? true,
            score: result.score ?? 85,
            reason: result.reason ?? "Image analysis completed."
        };
    } catch (error) {
        console.error("Error calling Gemini API for image analysis:", error);
        return { isValid: true, score: 75, reason: "Fallback: AI verification unavailable right now." };
    }
};
