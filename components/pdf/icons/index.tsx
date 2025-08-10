import React from 'react';
import { PDFIcon } from './PDFIcon';

export { PDFIcon, type IconName } from './PDFIcon';
export { defectIcons, type DefectType } from './DefectIcons';

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

export const Maximize2Icon = ({ size = 16, color = '#047857' }) => (
  <PDFIcon name="Maximize2" size={size} color={color} />
);

export const CalendarIcon = ({ size = 16, color = '#047857' }) => (
  <PDFIcon name="Calendar" size={size} color={color} />
);

export const InfoIcon = ({ size = 16, color = '#991B1B' }) => (
  <PDFIcon name="Info" size={size} color={color} />
);

// PDF-specific defect icons
const MoistureWaterDamageIcon = ({ size = 16, color = '#000000' }) => (
  <PDFIcon name="Droplets" size={size} color={color} />
);
const ElectricalFaultsIcon = ({ size = 16, color = '#000000' }) => (
  <PDFIcon name="Zap" size={size} color={color} />
);
const LegalDeficienciesIcon = ({ size = 16, color = '#000000' }) => (
  <PDFIcon name="Scale" size={size} color={color} />
);
const RotFungusPestsIcon = ({ size = 16, color = '#000000' }) => (
  <PDFIcon name="Bug" size={size} color={color} />
);
const DrainageLeaksIcon = ({ size = 16, color = '#000000' }) => (
  <PDFIcon name="Wrench" size={size} color={color} />
);
const EnvironmentalHazardsIcon = ({ size = 16, color = '#000000' }) => (
  <PDFIcon name="Beaker" size={size} color={color} />
);
const SharedDebtIcon = ({ size = 16, color = '#000000' }) => (
  <PDFIcon name="DollarSign" size={size} color={color} />
);
const RoofStructuralIssuesIcon = ({ size = 16, color = '#000000' }) => (
  <PDFIcon name="Home" size={size} color={color} />
);

export const pdfDefectIcons = {
  shared_debt: SharedDebtIcon,
  legal_deficiencies: LegalDeficienciesIcon,
  moisture_water_damage: MoistureWaterDamageIcon,
  rot_fungus_pests: RotFungusPestsIcon,
  electrical_faults: ElectricalFaultsIcon,
  drainage_leaks: DrainageLeaksIcon,
  roof_structural_issues: RoofStructuralIssuesIcon,
  environmental_hazards: EnvironmentalHazardsIcon,
};
