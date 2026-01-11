
export interface Symptom {
  id: string;
  category: 'Mental' | 'Physical' | 'General' | 'Modality' | 'Sensation';
  location: string;  // e.g., "Right Side of Head", "Epigastrium"
  sensation: string; // e.g., "Burning Pain", "Feeling of a plug"
  timing: string;    // e.g., "3 AM", "After walking", "Better from pressure"
}

export interface RubricMatch {
  remedyName: string;
  grade: 1 | 2 | 3; // Classical Homeopathic grading
}

export interface RubricAnalysis {
  kentRubric: string;
  matches: RubricMatch[];
}

export interface RemedySuggestion {
  name: string;
  commonName?: string;
  relevanceScore: number; // 1-100
  keyIndications: string[];
  boerickeReference: string; // Specific insights from Boericke's Materia Medica
  kentRubrics: string[]; // List of specific rubrics matched from Kent's
  differentiation: string;
}

export interface AnalysisResult {
  summary: string;
  remedies: RemedySuggestion[];
  rubricAnalysis: RubricAnalysis[];
  totalSymptomsAnalyzed: number;
}
