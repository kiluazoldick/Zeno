"use client";

import Link from "next/link";

import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WeeklySummaryCardProps {
  tasks?: Array<{
    id: string;
    statut: string;
    date_execution: string | null;
  }>;
}

export function WeeklySummaryCard({ tasks = [] }: WeeklySummaryCardProps) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // Tâches de la semaine
  const weekTasks = tasks.filter((task) => {
    if (!task.date_execution) return false;
    const d = new Date(task.date_execution);
    return isWithinInterval(d, { start: weekStart, end: weekEnd });
  });

  const totalTasks = weekTasks.length;
  const completedTasks = weekTasks.filter((t) => t.statut === "Terminé").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Déterminer le message
  let message = "Aucune tâche cette semaine. Planifiez votre semaine !";
  let isGoodProgress = false;

  if (totalTasks > 0) {
    if (completionRate >= 80) {
      message =
        "Excellente progression cette semaine ! Continuez sur cette lancée. 🚀";
      isGoodProgress = true;
    } else if (completionRate >= 50) {
      message = "Bonne progression, mais vous pouvez faire mieux. 💪";
    } else if (completionRate >= 20) {
      message =
        "Il reste encore du travail cette semaine. Concentrez-vous ! 🎯";
    } else {
      message = "La semaine est encore jeune. À vous de jouer ! ✨";
    }
  }

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Cette semaine</CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            asChild
          >
            <Link href="/dashboard/tasks">Voir tout</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p
          className={`text-sm ${isGoodProgress ? "text-green-600" : "text-muted-foreground"}`}
        >
          {message}
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Objectifs atteints</span>
            <span className="font-medium">
              {completedTasks} / {totalTasks}
            </span>
          </div>
          <Progress
            value={completionRate}
            className={`h-2 ${isGoodProgress ? "bg-green-100" : ""}`}
          />
        </div>
        {totalTasks === 0 && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/dashboard/kanban">Planifier des tâches</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
