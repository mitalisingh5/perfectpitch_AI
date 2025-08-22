import { GoogleGenAI, Type, Chat, Content } from "@google/genai";
import type { PitchData, RatingData, Message, LongTextFormat } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const longTextSchema = {
  type: Type.OBJECT,
  properties: {
    summaryPoints: {
      type: Type.ARRAY,
      description: "A list of 2-3 key bullet points summarizing the content.",
      items: { type: Type.STRING },
    },
    fullText: {
      type: Type.STRING,
      description: "The full, detailed text of the content.",
    },
  },
  required: ["summaryPoints", "fullText"],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    elevatorPitch: {
      ...longTextSchema,
      description: "A concise and compelling 30-60 second summary of the business idea, presented as both summary points and full text.",
    },
    tagline: {
      type: Type.STRING,
      description: "A short, memorable slogan for the business.",
    },
    valueProposition: {
        ...longTextSchema,
        description: "A clear statement on the unique value and benefits the product/service offers, presented as both summary points and full text.",
    },
    slideBullets: {
      type: Type.ARRAY,
      description: "A list of 5-7 key bullet points for a pitch deck presentation.",
      items: { type: Type.STRING },
    },
    competitors: {
      type: Type.ARRAY,
      description: "A list of 2-3 key competitors and a brief description of their offerings. If a location is provided, include local competitors.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["name", "description"],
      },
    },
    revenueModels: {
      type: Type.ARRAY,
      description: "A list of 2-3 potential revenue models with a brief explanation of each.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["name", "description"],
      },
    },
  },
  required: [
    "elevatorPitch",
    "tagline",
    "valueProposition",
    "slideBullets",
    "competitors",
    "revenueModels",
  ],
};

const ratingSchema = {
  type: Type.OBJECT,
  properties: {
    successScore: {
      type: Type.INTEGER,
      description: "A numerical score from 0 to 100 representing the potential success of the startup idea. 0 is very low, 100 is extremely high.",
    },
    keyStrengths: {
      type: Type.ARRAY,
      description: "A list of 3-4 key strengths of the business idea.",
      items: { type: Type.STRING },
    },
    potentialWeaknesses: {
      type: Type.ARRAY,
      description: "A list of 3-4 potential weaknesses or challenges the business might face.",
      items: { type: Type.STRING },
    },
    actionableAdvice: {
        type: Type.ARRAY,
        description: "A list of 2-3 concrete, actionable pieces of advice for the entrepreneur to improve their idea.",
        items: { type: Type.STRING },
    }
  },
  required: ["successScore", "keyStrengths", "potentialWeaknesses", "actionableAdvice"],
};


export const generatePitch = async (idea: string, location?: string): Promise<PitchData> => {
  try {
    const locationPrompt = location ? `The user is based in ${location}. Focus on competitors both globally and specifically within this local area if possible.` : '';
    const prompt = `Generate a comprehensive business pitch for the following startup idea. The user may provide the idea in English or Hinglish (a mix of Hindi and English) - please interpret it correctly. The target audience for this pitch is potential investors and hackathon judges. Be creative, professional, and thorough. For the 'elevatorPitch' and 'valueProposition' fields, first provide 2-3 key summary bullet points, then write the full detailed text. Provide details for all fields in the requested JSON schema. ${locationPrompt} Startup Idea: ${idea}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    if (
      !parsedData.elevatorPitch?.fullText ||
      !parsedData.tagline ||
      !Array.isArray(parsedData.slideBullets)
    ) {
      throw new Error("AI response is missing required fields.");
    }

    return parsedData as PitchData;
  } catch (error) {
    console.error("Error generating pitch:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate pitch. Gemini API Error: ${error.message}`);
    } else {
        throw new Error("Failed to generate pitch due to an unknown error.");
    }
  }
};

export const rateIdea = async (idea: string, pitchData: PitchData): Promise<RatingData> => {
    try {
        const prompt = `Based on the following startup idea and its generated pitch, provide a viability rating. Analyze its strengths, weaknesses, and potential for success. Be critical but constructive.
        
        Startup Idea: "${idea}"
        
        Generated Pitch:
        Tagline: ${pitchData.tagline}
        Elevator Pitch: ${pitchData.elevatorPitch.fullText}
        Value Proposition: ${pitchData.valueProposition.fullText}
        Competitors: ${pitchData.competitors.map(c => c.name).join(', ')}
        Revenue Models: ${pitchData.revenueModels.map(r => r.name).join(', ')}

        Provide a rating and analysis in the requested JSON schema. The success score should be a thoughtful estimate based on the provided data.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: ratingSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as RatingData;

    } catch(error) {
        console.error("Error rating idea:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to rate idea. Gemini API Error: ${error.message}`);
        } else {
            throw new Error("Failed to rate idea due to an unknown error.");
        }
    }
}

let chat: Chat | null = null;

const getChat = (): Chat => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are PitchBot, an expert startup advisor and pitch coach. Your role is to help users refine their business ideas. Be encouraging, ask clarifying questions, and provide concise, actionable feedback. Keep your responses brief and to the point. The user has already provided an initial idea and received a generated pitch. Your conversation should focus on improving or expanding upon that existing idea.`
            },
        });
    }
    return chat;
}

export const resetChat = (): void => {
    chat = null;
}

export const recreateChatFromHistory = (history: Message[]): void => {
    // Convert our Message[] format to Gemini's Content[] format
    const geminiHistory: Content[] = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    // The initial bot message is a greeting, not part of the history for gemini
    const filteredHistory = geminiHistory.slice(1);

    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are PitchBot, an expert startup advisor and pitch coach. Your role is to help users refine their business ideas. Be encouraging, ask clarifying questions, and provide concise, actionable feedback. Keep your responses brief and to the point. The user has already provided an initial idea and received a generated pitch. Your conversation should focus on improving or expanding upon that existing idea.`
        },
        history: filteredHistory,
    });
}


export const sendMessage = async (message: string): Promise<string> => {
    try {
        const chatInstance = getChat();
        const response = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to send message. Gemini API Error: ${error.message}`);
        } else {
            throw new Error("Failed to send message due to an unknown error.");
        }
    }
}