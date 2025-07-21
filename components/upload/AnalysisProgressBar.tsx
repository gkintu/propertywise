"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { useTranslations } from "next-intl";

interface AnalysisProgressBarProps {
  complete?: boolean;
}

export default function AnalysisProgressBar({ complete = false }: AnalysisProgressBarProps) {
  const t = useTranslations("HomePage");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  // Refs to manage animation state without causing re-renders
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const lastProgressRef = useRef<number>(0);

  // --- CHANGE 1: UPDATE THE ANIMATION CONFIGURATION ---
  // We split the old stage3 into two parts to control the 80-95% speed specifically.
  const config = useMemo(
    () => ({
      stage1: { start: 0, end: 35, duration: 8000 },       // 35% over 8s
      stage2: { start: 35, end: 75, duration: 15000 },      // 40% over 15s
      stage3: { start: 75, end: 80, duration: 3000 },       // First 5% of this phase over 3s
      stage3_slow: { start: 80, end: 95, duration: 30000 }, // The requested 15% over 30s
      completion: { start: 95, end: 100, duration: 2000 },   // Final 5% over 2s
    }),
    []
  );

  // Stage text labels - updated for new logic.
  const stages = useMemo(
    () => [
      t("upload.progressStages.extractingDetails"),
      t("upload.progressStages.analyzingPrice"),
      t("upload.progressStages.checkingRisks"),
      t("upload.progressStages.finalizing"), // 90-99%
      t("upload.progressStages.analysisComplete") // 100%
    ],
    [t]
  );

  // The main animation effect
  useEffect(() => {
    // --- CHANGE 2: UPDATE THE STAGE CONFIG HELPER ---
    // Add logic to check for our new 'stage3_slow'.
    const getCurrentStageConfig = (currentProgress: number) => {
      if (complete && currentProgress >= config.stage3_slow.end) {
        return config.completion;
      }
      if (currentProgress < config.stage1.end) return config.stage1;
      if (currentProgress < config.stage2.end) return config.stage2;
      if (currentProgress < config.stage3.end) return config.stage3; // Covers 75-8 0%
      if (currentProgress < config.stage3_slow.end) return config.stage3_slow; // Covers 80-95%
      return config.completion; // fallback, should not be hit
    };
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const stageConfig = getCurrentStageConfig(lastProgressRef.current);

      if (elapsed > stageConfig.duration) {
        lastProgressRef.current = stageConfig.end;
        startTimeRef.current = timestamp;
      }

      const stageElapsed = Math.min(elapsed, stageConfig.duration);
      const stageProgressPercent = stageElapsed / stageConfig.duration;

      const progressRange = stageConfig.end - stageConfig.start;
      const newProgress = stageConfig.start + progressRange * stageProgressPercent;
      
      const clampedProgress = Math.max(0, Math.min(100, newProgress));

      setProgress(clampedProgress);
      lastProgressRef.current = clampedProgress;

      // --- CHANGE 3: UPDATE THE STAGE TEXT LOGIC ---
      if (clampedProgress < config.stage1.end) setStage(0);
      else if (clampedProgress < config.stage2.end) setStage(1);
      else if (clampedProgress < 90) setStage(2); // checkingRisks
      else if (clampedProgress < 100) setStage(3); // finalizing
      else setStage(4); // analysisComplete

      // --- CHANGE 4: UPDATE THE TARGET PROGRESS LOGIC ---
      const targetProgress = complete ? 100 : config.stage3_slow.end;

      if (clampedProgress < targetProgress) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
         const finalClampedProgress = Math.max(0, Math.min(100, targetProgress));
         setProgress(finalClampedProgress);
      }
    };
    
    if (complete && lastProgressRef.current < config.completion.start) {
        lastProgressRef.current = config.completion.start;
        startTimeRef.current = undefined;
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [complete, config, t]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-md">
        <div className="p-6">
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {stages[stage]}
              </p>
            </div>
            <div className="space-y-4">
              <Progress
                value={progress}
                className="h-3 bg-yellow-100 dark:bg-yellow-900 [&>div]:bg-yellow-500 [&>div]:dark:bg-yellow-400 [&>div]:transition-none"
              />
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
