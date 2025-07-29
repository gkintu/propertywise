import {
  Droplets,
  Zap,
  Scale,
  Bug,
  Wrench,
  Beaker,
  DollarSign,
  Home,
} from "lucide-react";

export const defectIcons = {
  shared_debt: DollarSign,
  legal_deficiencies: Scale,
  moisture_water_damage: Droplets,
  rot_fungus_pests: Bug,
  electrical_faults: Zap,
  drainage_leaks: Wrench,
  roof_structural_issues: Home,
  environmental_hazards: Beaker,
} as const;

export type DefectType = keyof typeof defectIcons;
