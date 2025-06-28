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

  // Animation configuration - same as your original for realistic progression
  const config = useMemo(
    () => ({
      stage1: { start: 0, end: 35, duration: 8000 },
      stage2: { start: 35, end: 75, duration: 15000 },
      stage3: { start: 75, end: 95, duration: 12000 },
      completion: { start: 95, end: 100, duration: 2000 },
    }),
    []
  );

  // Stage text labels
  const stages = useMemo(
    () => [
      t("upload.progressStages.extractingDetails"),
      t("upload.progressStages.analyzingPrice"),
      t("upload.progressStages.checkingRisks"),
    ],
    [t]
  );

  // The main animation effect, runs once and manages its own loop
  useEffect(() => {
    // Helper to determine which stage config to use
    const getCurrentStageConfig = (currentProgress: number) => {
      if (complete && currentProgress >= config.stage3.end) {
        return config.completion;
      }
      if (currentProgress < config.stage1.end) return config.stage1;
      if (currentProgress < config.stage2.end) return config.stage2;
      return config.stage3;
    };
    
    // The animation loop function
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const stageConfig = getCurrentStageConfig(lastProgressRef.current);

      // Reset timer if we've completed a stage and need to move to the next
      if (elapsed > stageConfig.duration) {
        lastProgressRef.current = stageConfig.end; // Lock to the end of the stage
        startTimeRef.current = timestamp; // Reset timer for the next stage
      }

      const stageElapsed = Math.min(elapsed, stageConfig.duration);
      const stageProgressPercent = stageElapsed / stageConfig.duration;

      const progressRange = stageConfig.end - stageConfig.start;
      const newProgress = stageConfig.start + progressRange * stageProgressPercent;

      // Update React state for UI
      setProgress(newProgress);
      lastProgressRef.current = newProgress; // Update ref for the next frame's calculation

      // Update the stage text
      if (newProgress < config.stage1.end) setStage(0);
      else if (newProgress < config.stage2.end) setStage(1);
      else setStage(2);

      // Determine the final target
      const targetProgress = complete ? 100 : config.stage3.end;

      // Continue the animation if not complete
      if (newProgress < targetProgress) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
         // Ensure it lands exactly on the final value
        setProgress(targetProgress);
      }
    };
    
    // If 'complete' is triggered early, jump to the start of the final animation
    if (complete && lastProgressRef.current < config.completion.start) {
        lastProgressRef.current = config.completion.start;
        startTimeRef.current = undefined; // Reset timer for completion animation
    }

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup function to cancel the animation when the component unmounts
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // The effect depends on `complete` to restart the animation loop for the final step.
  }, [complete, config, t]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-md">
        <div className="p-6">
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {/* When progress is 100, show a final message */}
                {progress >= 100 ? t("upload.progressStages.complete") : stages[stage]}
              </p>
            </div>
            <div className="space-y-4">
              <Progress
                value={progress}
                // THE FIX IS HERE: `[&>div]:transition-none`
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
