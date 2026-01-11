
import { GoogleGenAI, Type } from "@google/genai";
import { Symptom, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeSymptoms = async (symptoms: Symptom[]): Promise<AnalysisResult> => {
  // Format the structured symptoms into a descriptive string for the AI
  const formattedSymptoms = symptoms.map(s => 
    `[${s.category}] Location: ${s.location} | Sensation: ${s.sensation} | Timing/Modality: ${s.timing}`
  ).join('\n');
  
  const prompt = `
    As a master Homeopathic Doctor, perform a professional repertorization using Kent's Repertory and Boericke's Materia Medica.
    
    THE CASE DATA:
    ${formattedSymptoms}
    
    STRICT REPERTORIZATION GUIDELINES:
    1. ANALYZE LOCATION: Pay special attention to side of body (Left/Right) and specific organs.
    2. ANALYZE TIMING: Consider modalities (Worse/Better) and specific hours/periodicity.
    3. KENT RUBRICS: Map these to the exact hierarchy of Kent's Repertory (Chapter - Rubric - Sub-rubric).
    4. GRADING: Assign 3 (Bold), 2 (Italics), or 1 (Roman) based on classical data.
    5. MATERIA MEDICA: Confirm using clinical pictures from Boericke.
    6. DIFFERENTIATION: Explain why the top remedy is the 'Simillimum'.

    Provide the output in JSON format matching the defined schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            totalSymptomsAnalyzed: { type: Type.NUMBER },
            rubricAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  kentRubric: { type: Type.STRING },
                  matches: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        remedyName: { type: Type.STRING },
                        grade: { type: Type.NUMBER }
                      },
                      required: ["remedyName", "grade"]
                    }
                  }
                },
                required: ["kentRubric", "matches"]
              }
            },
            remedies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  commonName: { type: Type.STRING },
                  relevanceScore: { type: Type.NUMBER },
                  keyIndications: { type: Type.ARRAY, items: { type: Type.STRING } },
                  boerickeReference: { type: Type.STRING },
                  kentRubrics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  differentiation: { type: Type.STRING }
                },
                required: ["name", "relevanceScore", "keyIndications", "differentiation", "boerickeReference"]
              }
            }
          },
          required: ["summary", "remedies", "rubricAnalysis", "totalSymptomsAnalyzed"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Repertorization failed. Ensure symptoms are described precisely.");
  }
};
