"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useTranslations } from "next-intl";

interface AnalysisProgressBarProps {
  complete?: boolean;
}

export default function AnalysisProgressBar({ complete = false }: AnalysisProgressBarProps) {
  const t = useTranslations("HomePage");
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  // Stages are fetched from i18n
  const stages = [
    t("upload.progressStages.extractingDetails"),
    t("upload.progressStages.analyzingPrice"),
    t("upload.progressStages.checkingRisks"),
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (!complete) {
      timer = setInterval(() => {
        setProgress((prev) => {
          let next = prev;
          if (prev < 80) {
            next = prev + 1;
          } else if (prev >= 80 && prev < 90) {
            next = prev + 1;
          }
          if (next <= 33) setCurrentStage(0);
          else if (next <= 66) setCurrentStage(1);
          else setCurrentStage(2);
          // Cap at 90% until complete
          if (next >= 90) return 90;
          return next;
        });
      }, progress < 80 ? 375 : 3000); // 0-80%: 375ms, 80-90%: 3000ms
    } else {
      setProgress(100);
      setCurrentStage(2);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, progress]);

  // Theme-aware progress bar
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-md">
        <div className="p-6">
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-lg font-medium text-gray-900 dark:text-white">{stages[currentStage]}</p>
            </div>
            <div className="space-y-4">
              <Progress value={progress} className="h-3 bg-yellow-100 dark:bg-yellow-900 [&_.progress-bar]:bg-yellow-500 [&_.progress-bar]:dark:bg-yellow-400" />
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">{Math.round(progress)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
