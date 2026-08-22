import { GoogleGenAI, Type } from '@google/genai';

const HUMAN_LANGS = {
  hin_Deva: 'Hindi', tel_Telu: 'Telugu', tam_Taml: 'Tamil', kan_Knda: 'Kannada',
  mal_Mlym: 'Malayalam', ben_Beng: 'Bengali', mar_Deva: 'Marathi', guj_Gujr: 'Gujarati',
  pan_Guru: 'Punjabi', odia_Orya: 'Odia', urd_Arab: 'Urdu'
};

export class GeminiProvider {
  constructor() {
    this.client = null;
    this.modelName = process.env.TRANSLATION_MODEL || 'gemini-3.6-flash';
  }

  async init() {
    const apiKey = process.env.TRANSLATION_API_KEY;
    if (!apiKey) {
      throw new Error('TRANSLATION_API_KEY is required for the Gemini translation provider.');
    }
    console.log('✅ Gemini API key detected.');
    
    this.client = new GoogleGenAI({ apiKey });
    
    console.log(`✅ Worker Ready. Model: ${this.modelName}, Provider: gemini`);
  }

  async translateBatch(items, sourceLang, targetLang) {
    if (!this.client) throw new Error('GeminiProvider not initialized');
    if (items.length === 0) return [];
    
    const humanTarget = HUMAN_LANGS[targetLang] || targetLang;
    
    const promptText = `
Source language: English
Target language: ${humanTarget}

Rules:
- translate naturally for native speakers
- preserve meaning
- preserve placeholders exactly (e.g. {count}, {percent})
- preserve HTML/React tags exactly (e.g. <br/>, <Heart />)
- preserve technical terminology (e.g. PDF, OCR, API, JSON, HTML, CSS, JavaScript, Next.js, WebAssembly, SVG, TIFF, JPEG, PNG, WebP, DPI, RFC, SHA-256)
- do not translate JSON keys
- do not translate URLs
- do not translate route slugs
- do not modify technical identifiers
- return only structured translation data
- do not add explanations

Translate the following JSON list of strings:
${JSON.stringify(items.map(i => ({ key: i.key, text: i.text })), null, 2)}
`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        translations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              key: { type: Type.STRING },
              text: { type: Type.STRING }
            },
            required: ['key', 'text']
          }
        }
      },
      required: ['translations']
    };

    let response;
    try {
      response = await this.client.models.generateContent({
        model: this.modelName,
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.1, // very low temperature for translation stability
        }
      });
      
      const jsonStr = response.text;
      const parsed = JSON.parse(jsonStr);
      return parsed.translations;
      
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      throw error;
    }
  }

  close() {
    // No-op for Gemini
  }
}
