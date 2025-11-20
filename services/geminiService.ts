import { GoogleGenAI, Type } from "@google/genai";
import { GeminiSuggestion } from "../types";

export const suggestProfileConfig = async (appName: string): Promise<GeminiSuggestion> => {
  // Default mock data if API key is missing
  const mockIdentity = {
    imei: `86${Math.floor(Math.random() * 1000000000000)}`,
    model: 'Galaxy S24 Ultra',
    manufacturer: 'Samsung',
    androidVersion: '14.0',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      city: 'New York, US'
    }
  };

  if (!process.env.API_KEY) {
    console.warn("API_KEY not found in environment variables. Returning mock data.");
    return {
      description: `Secure clone of ${appName}.`,
      themeColor: 'indigo',
      tags: ['Social', 'Privacy'],
      privacyConfig: {
        randomizeId: true,
        spoofLocation: true,
        incognitoMode: true,
        blockTrackers: true,
        hideRoot: true
      },
      securityNote: "Advanced device fingerprinting protection enabled.",
      deviceIdentity: mockIdentity
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `I am cloning an Android application named "${appName}". 
    1. Suggest a configuration for this clone to ensure it is safe and undetectable.
    2. Generate a realistic FAKE DEVICE IDENTITY to spoof. This must include a valid-looking 15-digit IMEI, a popular Android device model (e.g. Samsung S23, Pixel 8, Xiaomi 13), a manufacturer, and a realistic Android version (11-14).
    3. Pick a random major city for location spoofing (lat/lng/city).
    
    Provide the response in JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          themeColor: { type: Type.STRING },
          securityNote: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          privacyConfig: {
             type: Type.OBJECT,
             properties: {
                randomizeId: { type: Type.BOOLEAN },
                spoofLocation: { type: Type.BOOLEAN },
                incognitoMode: { type: Type.BOOLEAN },
                blockTrackers: { type: Type.BOOLEAN },
                hideRoot: { type: Type.BOOLEAN },
             }
          },
          deviceIdentity: {
            type: Type.OBJECT,
            properties: {
              imei: { type: Type.STRING, description: "15 digit numeric string" },
              model: { type: Type.STRING },
              manufacturer: { type: Type.STRING },
              androidVersion: { type: Type.STRING },
              location: {
                type: Type.OBJECT,
                properties: {
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER },
                  city: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(text) as GeminiSuggestion;
};