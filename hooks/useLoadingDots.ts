import { useEffect, useState } from "react";

/**
 * Custom hook that creates animated loading text with dots
 * Cycles through: "text." -> "text.." -> "text..." -> "text." (repeat)
 */
export function useLoadingDots(baseText: string, intervalMs: number = 500) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        // Cycle through dots: . -> .. -> ... -> . (repeat)
        return prevDots.length >= 3 ? "." : prevDots + ".";
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return `${baseText}${dots}`;
}