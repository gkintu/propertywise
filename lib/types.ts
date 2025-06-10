export interface PropertyDetails {
  address: string;
  bedrooms: number;
  price: number;
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

export interface PropertyAnalysis {
  propertyDetails: PropertyDetails;
  strongPoints: StrongPoint[];
  concerns: Concern[];
  bottomLine: string;
  summary: string;
}

export interface AnalysisResponse {
  analysis?: PropertyAnalysis;
  summary?: string; // fallback for unstructured response
  error?: string;
}
