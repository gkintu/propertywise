"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Zap,
  Scale,
  Bug,
  Wrench,
  Beaker,
  DollarSign,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Home,
} from "lucide-react";
import { HiddenDefect } from "@/lib/types";
import { useTranslations } from "next-intl";

interface HiddenDefectsSectionProps {
  hiddenDefects: HiddenDefect[];
  className?: string;
}

const defectIcons = {
  shared_debt: DollarSign,
  legal_deficiencies: Scale,
  moisture_water_damage: Droplets,
  rot_fungus_pests: Bug,
  electrical_faults: Zap,
  drainage_leaks: Wrench,
  roof_structural_issues: Home,
  environmental_hazards: Beaker,
};

const riskColors = {
  low: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800/50",
    text: "text-green-800 dark:text-green-200",
    badge: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300",
  },
  medium: {
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    border: "border-yellow-200 dark:border-yellow-800/50",
    text: "text-yellow-800 dark:text-yellow-200",
    badge: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300",
  },
  high: {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800/50",
    text: "text-red-800 dark:text-red-200",
    badge: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300",
  },
};

export function HiddenDefectsSection({ hiddenDefects, className }: HiddenDefectsSectionProps) {
  const t = useTranslations("AnalysisResult");

  if (!hiddenDefects || hiddenDefects.length === 0) {
    return null;
  }

  return (
    <Card className={`mb-6 border-purple-200 dark:border-purple-800/50 bg-white dark:bg-[#1F2937] ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-[#F9FAFB] text-purple-900 dark:text-purple-300">
          <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          {t("hiddenDefects.title")}
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t("hiddenDefects.description")}
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full space-y-2">
          {hiddenDefects.map((defect, index) => {
            const Icon = defectIcons[defect.category];
            const colors = riskColors[defect.riskLevel];
            
            return (
              <AccordionItem
                key={index}
                value={`defect-${index}`}
                className={`${colors.bg} ${colors.border} border rounded-lg`}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {t(`hiddenDefects.categories.${defect.category}.title`)}
                      </div>
                    </div>
                    <Badge className={`${colors.badge} text-xs font-medium`}>
                      {t(`hiddenDefects.riskLevels.${defect.riskLevel}`)}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {/* Signs to Look For */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        {t("hiddenDefects.signsToLookFor")}
                      </h4>
                      <ul className="space-y-1">
                        {defect.signsToLookFor.map((sign, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                            {sign}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Consequences */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        {t("hiddenDefects.consequences")}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {defect.consequences}
                      </p>
                    </div>

                    {/* Preventive Measures */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {t("hiddenDefects.preventiveMeasures")}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {defect.preventiveMeasures}
                      </p>
                    </div>

                    {/* Action Required (if provided) */}
                    {defect.actionRequired && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-blue-500" />
                          {t("hiddenDefects.actionRequired")}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {defect.actionRequired}
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
