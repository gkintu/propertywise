import React from 'react';
import { PDFIcon } from './PDFIcon';

export { PDFIcon, type IconName } from './PDFIcon';
export { 
  useLucideIconForPDF, 
  LucideIconForPDF 
} from './LucideIconForPDF';

// Demo component for testing
export { default as IconDemoPDF } from './IconDemoPDF';

// Re-export the most commonly used icons with convenient names
export const CheckCircleIcon = ({ size = 16, color = '#059669' }) => (
  <PDFIcon name="CheckCircle" size={size} color={color} />
);

export const AlertTriangleIcon = ({ size = 16, color = '#DC2626' }) => (
  <PDFIcon name="AlertTriangle" size={size} color={color} />
);

export const HomeIcon = ({ size = 16, color = '#000000' }) => (
  <PDFIcon name="Home" size={size} color={color} />
);

export const ClockIcon = ({ size = 16, color = '#6B7280' }) => (
  <PDFIcon name="Clock" size={size} color={color} />
);

export const MapPinIcon = ({ size = 16, color = '#6B7280' }) => (
  <PDFIcon name="MapPin" size={size} color={color} />
);

export const BedIcon = ({ size = 16, color = '#6B7280' }) => (
  <PDFIcon name="Bed" size={size} color={color} />
);

export const BathIcon = ({ size = 16, color = '#6B7280' }) => (
  <PDFIcon name="Bath" size={size} color={color} />
);

export const CarIcon = ({ size = 16, color = '#6B7280' }) => (
  <PDFIcon name="Car" size={size} color={color} />
);

export const FileTextIcon = ({ size = 16, color = '#111827' }) => (
  <PDFIcon name="FileText" size={size} color={color} />
);

export const EyeIcon = ({ size = 16, color = '#374151' }) => (
  <PDFIcon name="Eye" size={size} color={color} />
);

export const TrendingUpIcon = ({ size = 16, color = '#047857' }) => (
  <PDFIcon name="TrendingUp" size={size} color={color} />
);

export const InfoIcon = ({ size = 16, color = '#991B1B' }) => (
  <PDFIcon name="Info" size={size} color={color} />
);
