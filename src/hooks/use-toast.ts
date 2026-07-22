import { useCallback } from "react";

interface Toast {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

// Simple toast hook that returns a toast function
export function useToast() {
  const toast = useCallback((config: Toast) => {
    // For now, just log to console
    // In a real app, this would integrate with a toast UI library
    const style = config.variant === "destructive" ? "color: red;" : "color: green;";
    console.log(`%c[TOAST] ${config.title}: ${config.description}`, style);
  }, []);

  return { toast };
}
