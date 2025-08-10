/**
 * Utility functions for smooth progress bar animations and interpolation
 */

export interface ProgressState {
  value: number;
  velocity: number;
  lastUpdate: number;
}

export class ProgressInterpolator {
  private targetProgress: number = 0;
  private currentProgress: number = 0;
  private animationFrame: number | null = null;
  private onUpdate?: (progress: number) => void;
  
  // Animation configuration
  private readonly ANIMATION_SPEED = 0.08; // Higher = faster animation
  private readonly MIN_INCREMENT = 0.1; // Minimum progress increment per frame
  private readonly MAX_INCREMENT = 2.0; // Maximum progress increment per frame
  
  constructor(onUpdate?: (progress: number) => void) {
    this.onUpdate = onUpdate;
  }

  /**
   * Set target progress and animate smoothly to it
   */
  setTarget(targetProgress: number): void {
    this.targetProgress = Math.max(0, Math.min(100, targetProgress));
    this.startAnimation();
  }

  /**
   * Get current interpolated progress value
   */
  getCurrent(): number {
    return this.currentProgress;
  }

  /**
   * Start smooth animation to target
   */
  private startAnimation(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    const animate = () => {
      const difference = this.targetProgress - this.currentProgress;
      
      if (Math.abs(difference) < 0.01) {
        // Close enough, snap to target
        this.currentProgress = this.targetProgress;
        this.onUpdate?.(this.currentProgress);
        this.animationFrame = null;
        return;
      }

      // Calculate smooth increment
      let increment = difference * this.ANIMATION_SPEED;
      increment = Math.max(Math.min(increment, this.MAX_INCREMENT), this.MIN_INCREMENT);
      
      if (difference < 0) {
        increment = -Math.min(Math.abs(increment), this.MAX_INCREMENT);
      }

      this.currentProgress += increment;
      this.currentProgress = Math.max(0, Math.min(100, this.currentProgress));
      
      this.onUpdate?.(this.currentProgress);
      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  /**
   * Instantly set progress without animation
   */
  setInstant(progress: number): void {
    this.targetProgress = Math.max(0, Math.min(100, progress));
    this.currentProgress = this.targetProgress;
    this.onUpdate?.(this.currentProgress);
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Clean up animation frame
   */
  destroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
}

/**
 * Simulate progress when no real updates are received
 * Useful for maintaining perceived activity during long operations
 */
export class ProgressSimulator {
  private interval: NodeJS.Timeout | null = null;
  private currentProgress: number = 0;
  private maxProgress: number = 95; // Don't simulate beyond 95%
  private onUpdate?: (progress: number) => void;
  
  // Simulation parameters
  private readonly INITIAL_SPEED = 0.5; // Progress points per second initially
  private readonly SLOWDOWN_FACTOR = 0.98; // Speed reduction factor per update
  private readonly MIN_SPEED = 0.05; // Minimum progress speed
  private readonly UPDATE_INTERVAL = 200; // Update every 200ms

  constructor(startProgress: number, onUpdate?: (progress: number) => void) {
    this.currentProgress = startProgress;
    this.onUpdate = onUpdate;
  }

  /**
   * Start simulating progress
   */
  start(): void {
    if (this.interval) return;

    let speed = this.INITIAL_SPEED;
    
    this.interval = setInterval(() => {
      if (this.currentProgress >= this.maxProgress) {
        this.stop();
        return;
      }

      // Update progress with decreasing speed
      this.currentProgress += speed * (this.UPDATE_INTERVAL / 1000);
      this.currentProgress = Math.min(this.currentProgress, this.maxProgress);
      
      // Slow down over time
      speed = Math.max(speed * this.SLOWDOWN_FACTOR, this.MIN_SPEED);
      
      this.onUpdate?.(this.currentProgress);
    }, this.UPDATE_INTERVAL);
  }

  /**
   * Stop simulation
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Set maximum progress for simulation
   */
  setMaxProgress(max: number): void {
    this.maxProgress = Math.max(0, Math.min(100, max));
  }

  /**
   * Get current simulated progress
   */
  getCurrent(): number {
    return this.currentProgress;
  }
}

/**
 * Format estimated time remaining
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
}

/**
 * Calculate progress velocity (progress points per second)
 */
export function calculateVelocity(
  currentProgress: number,
  previousProgress: number,
  timeDelta: number
): number {
  if (timeDelta <= 0) return 0;
  return (currentProgress - previousProgress) / (timeDelta / 1000);
}