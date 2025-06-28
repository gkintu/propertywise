import React from "react";

interface ProgressProps {
  value: number; // 0-100
  className?: string;
}

// Theme-aware progress bar
export const Progress: React.FC<ProgressProps> = ({ value, className = "" }) => {
  return (
    <div
      className={`relative w-full rounded-full overflow-hidden bg-yellow-100 dark:bg-yellow-900 h-3 ${className}`}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
    >
      <div
        className="progress-bar absolute left-0 top-0 h-full transition-all duration-300 bg-yellow-500 dark:bg-yellow-400"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
