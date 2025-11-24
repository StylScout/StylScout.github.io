
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchClothes = async (query: string): Promise<Product[]> => {
  const model = "gemini-2.5-flash"; // Using flash for speed, supported with tools

  const prompt = `
    You are an expert fashion personal shopper. The user is looking for: "${query}".
    
    Task:
    1. Search the internet using Google Search to find real, purchasable clothing items that match the user's description.
    2. Prioritize finding the *cheapest* options available that still match the quality and description.
    3. Find at least 4-6 distinct options.
    4. For each item, provide:
       - Name of the product
       - Price (with currency)
       - Store Name
       - URL: THIS IS CRITICAL. 
         - You MUST provide a DIRECT link to the product page (e.g., amazon.com/dp/..., zara.com/us/en/product...).
         - Do NOT provide a Google Search results link (like google.com/search?q=...).
         - Do NOT provide a generic homepage link.
         - Find the actual item page.
       - Description: A detailed text description of the item, specifying materials, fit, and key features.
       - Reasoning: Why this is a good option (e.g., "Lowest price found", "High rated material").

    Output Format:
    You MUST output a valid JSON array of objects. Do not wrap it in markdown code blocks like \`\`\`json. Just the raw JSON string.
    
    The JSON objects must have these keys:
    - "name": string
    - "price": string
    - "store": string
    - "url": string
    - "description": string
    - "reasoning": string
    
    If you cannot find exact matches, find the closest alternatives and explain why in the 'reasoning' field.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType cannot be JSON when using tools, so we rely on prompt engineering
      },
    });

    const text = response.text || "";
    
    // Clean up potential markdown code blocks if the model ignores the "raw JSON" instruction
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Attempt to parse
    const start = cleanedText.indexOf('[');
    const end = cleanedText.lastIndexOf(']');
    
    if (start === -1 || end === -1) {
      console.error("Failed to parse JSON from Gemini response:", text);
      throw new Error("Could not find products. Please try a different description.");
    }

    const jsonString = cleanedText.substring(start, end + 1);
    const products: Omit<Product, 'id'>[] = JSON.parse(jsonString);

    // Add unique IDs and Verify URLs
    return products.map((p, index) => {
      let finalUrl = p.url;
      
      // Client-side URL Safety Check
      // Only fallback if the URL is completely garbage.
      const isGarbage = 
        !finalUrl || 
        !finalUrl.startsWith('http') || 
        finalUrl.includes('example.com') || 
        finalUrl.includes('placeholder');

      if (isGarbage) {
        // Only then do we fallback to search
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(`${p.name} ${p.store} buy online`)}`;
      }

      return {
        ...p,
        url: finalUrl,
        id: `gemini-${Date.now()}-${index}`,
      };
    });

  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw new Error("Failed to search for clothes. Please check your internet connection or try again.");
  }
};
