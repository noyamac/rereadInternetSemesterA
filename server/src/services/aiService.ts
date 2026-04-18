import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPrompt } from './utils/aiPrompt';

export class AIService {
  private genAI(): GoogleGenerativeAI | null {
    if (process.env.GEMINI_API_KEY) {
      return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return null;
  }

  async generateResult(userInput: string): Promise<string> {
    const genAI = this.genAI();
    if (!genAI) {
      throw new Error('Google Generative AI API key is not set');
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: "application/json" } });
    try {
      const result = await model.generateContent(getPrompt(userInput));
      const text = result.response.text();


      const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.warn('No JSON found in Gemini response, using fallback');
      return userInput; 
    }

    const data = JSON.parse(jsonMatch[0]);
    
    if (data.keywords && Array.isArray(data.keywords)) {
      const rawKeywords = data.keywords.join(' ');
      return rawKeywords.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
    }

    return userInput;

    } catch (error) {
      console.error('Gemini expansion failed:', error);
      return userInput;
    }
  }
}
