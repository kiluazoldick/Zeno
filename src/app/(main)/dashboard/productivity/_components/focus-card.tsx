"use client";

import { useState, useEffect } from "react";
import { BellOff, Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const POMODORO_DURATION = 25 * 60; // 25 minutes en secondes
const SHORT_BREAK = 5 * 60; // 5 minutes

export function FocusCard() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(SHORT_BREAK);
      } else {
        setIsBreak(false);
        setTimeLeft(POMODORO_DURATION);
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(POMODORO_DURATION);
  };

  const progress = isBreak
    ? 1 - timeLeft / SHORT_BREAK
    : 1 - timeLeft / POMODORO_DURATION;

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base">
          {isBreak ? "Pause ☕" : "Concentrateur"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3">
          {/* Timer circulaire */}
          <div className="relative size-32">
            <svg className="size-32 -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className={`${isBreak ? "text-green-500" : "text-zeno-primary"} transition-all duration-1000`}
                strokeDasharray={352}
                strokeDashoffset={352 * (1 - progress)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tracking-tight">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs text-muted-foreground">
                {isBreak ? "Pause" : "Travail"}
              </span>
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleTimer}
              className="min-w-24"
            >
              {isRunning ? (
                <>
                  <Pause className="size-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Démarrer
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={resetTimer}
              className="text-muted-foreground"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <BellOff className="size-3" />
            <span>Concentration totale</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
