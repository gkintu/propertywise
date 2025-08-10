export interface PropertyDetails {
  address: string;
  bedrooms: number;
  price: number;
  currency?: string; // e.g., "NOK", "USD", "EUR", "SEK", "DKK"
  size: number; // in square meters
  yearBuilt: number;
  propertyType: string; // e.g., "apartment", "house", "condo"
}

export interface StrongPoint {
  title: string;
  description: string;
  category: 'kitchen' | 'location' | 'fees' | 'outdoor' | 'storage' | 'condition' | 'other';
}

export interface Concern {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  estimatedCost?: string;
  category: 'electrical' | 'structural' | 'safety' | 'pest' | 'maintenance' | 'age' | 'other';
}

export interface HiddenDefect {
  category: 'shared_debt' | 'legal_deficiencies' | 'moisture_water_damage' | 'rot_fungus_pests' | 'electrical_faults' | 'drainage_leaks' | 'roof_structural_issues' | 'environmental_hazards';
  riskLevel: 'low' | 'medium' | 'high';
  briefExplanation: string;
  consequences: string;
  preventiveMeasures: string;
  actionRequired?: string;
}

export interface DocumentClassification {
  documentType: 'property_report' | 'not_property_report';
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface PropertyAnalysis {
  propertyDetails: PropertyDetails;
  strongPoints: (StrongPoint | string)[];
  concerns: (Concern | string)[];
  hiddenDefects: HiddenDefect[];
  bottomLine: string;
  summary: string;
}

export interface CombinedAnalysisResponse {
  classification: DocumentClassification;
  propertyDetails?: PropertyDetails;
  strongPoints?: (StrongPoint | string)[];
  concerns?: (Concern | string)[];
  hiddenDefects?: HiddenDefect[];
  bottomLine?: string;
  summary?: string;
}

export interface AnalysisResponse {
  analysis?: PropertyAnalysis;
  summary?: string; // fallback for unstructured response
  error?: string;
}
