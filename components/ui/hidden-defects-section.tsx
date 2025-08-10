"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { defectIcons } from "@/components/pdf/icons";
import { HiddenDefect } from "@/lib/types";

interface HiddenDefectsSectionProps {
  hiddenDefects: HiddenDefect[];
  className?: string;
}

const RiskIndicator = ({
  riskLevel,
}: {
  riskLevel: "low" | "medium" | "high";
}) => {
  const t = useTranslations("AnalysisResult");
  const riskStyles = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return (
    <Badge className={`capitalize ${riskStyles[riskLevel]}`}>
      {t(`hiddenDefects.riskLevels.${riskLevel}`)}
    </Badge>
  );
};

export function HiddenDefectsSection({ hiddenDefects, className }: HiddenDefectsSectionProps) {
  const t = useTranslations("AnalysisResult");

  if (!hiddenDefects || hiddenDefects.length === 0) {
    return null;
  }

  return (
    <Card className={`bg-white/85 dark:bg-[#111827]/85 backdrop-blur-sm mb-6 ${className}`}>
      <CardHeader>
        <CardTitle className="dark:text-[#F9FAFB]">
          {t("hiddenDefects.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {hiddenDefects.map((defect, index) => {
            const Icon = defectIcons[defect.category];
            return (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center gap-4">
                    {Icon && <Icon className="h-6 w-6" />}
                    <span className="font-semibold">
                      {t(`hiddenDefects.categories.${defect.category}.title`)}
                    </span>
                    <RiskIndicator riskLevel={defect.riskLevel} />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-10">
                    {/* Brief explanation section */}
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800/50">
                      <p className="text-sm text-[#b3621d] dark:text-[#ffc657]">
                        {defect.briefExplanation}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">
                        {t("hiddenDefects.consequences")}
                      </h4>
                      <p>{defect.consequences}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {t("hiddenDefects.preventiveMeasures")}
                      </h4>
                      <p>{defect.preventiveMeasures}</p>
                    </div>
                    {defect.actionRequired && (
                      <div>
                        <h4 className="font-semibold">
                          {t("hiddenDefects.actionRequired")}
                        </h4>
                        <p className="text-sm bg-gray-50/30 dark:bg-gray-600/10 p-2 rounded border-l-4 border-yellow-200 dark:border-yellow-800/50">
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
