import { PDFIcon, IconName } from './PDFIcon';
import React from 'react';

// Mapping from Lucide React icon names to our PDF icon names
const lucideToIconName: Record<string, IconName> = {
  'CheckCircle': 'CheckCircle',
  'CircleCheck': 'CheckCircle',
  'AlertTriangle': 'AlertTriangle',
  'TriangleAlert': 'AlertTriangle',
  'Home': 'Home',
  'Clock': 'Clock',
  'MapPin': 'MapPin',
  'Bed': 'Bed',
  'Bath': 'Bath',
  'Car': 'Car',
  'Search': 'Search',
  'Upload': 'Upload',
  'X': 'X',
  'ExternalLink': 'ExternalLink',
  'Info': 'Info',
  // Additional aliases
  'Check': 'Success',
  'Warning': 'Warning',
  'Error': 'Error',
  'Success': 'Success'
};

interface UseLucideIconForPDFProps {
  iconName: string;
  size?: number;
  color?: string;
}

/**
 * Hook to convert Lucide React icon names to PDF-compatible icons
 * Usage:
 * const IconComponent = useLucideIconForPDF({ iconName: 'CheckCircle', size: 16, color: '#059669' });
 * return <>{IconComponent}</>;
 */
export const useLucideIconForPDF = ({ 
  iconName, 
  size = 16, 
  color = '#000000' 
}: UseLucideIconForPDFProps) => {
  const pdfIconName = lucideToIconName[iconName];
  
  if (!pdfIconName) {
    console.warn(`Icon "${iconName}" not found in PDF icon mapping. Using fallback.`);
    return <PDFIcon name="Info" size={size} color={color} />;
  }
  
  return <PDFIcon name={pdfIconName} size={size} color={color} />;
};

/**
 * Direct component wrapper for easier usage
 * Usage: <LucideIconForPDF iconName="CheckCircle" size={16} color="#059669" />
 */
export const LucideIconForPDF: React.FC<UseLucideIconForPDFProps> = (props) => {
  return useLucideIconForPDF(props);
};

export default LucideIconForPDF;
