"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { format, isSameDay, startOfMonth, startOfToday } from "date-fns";
import { fr } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarPanelProps {
  tasks?: Array<{
    id: string;
    titre: string;
    date_execution: string | null;
    statut: string;
  }>;
}

export function CalendarPanel({ tasks = [] }: CalendarPanelProps) {
  const router = useRouter();
  const today = startOfToday();
  const [date, setDate] = React.useState<Date | undefined>(today);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() =>
    startOfMonth(today),
  );

  // Dates avec événements (tâches)
  const eventDates = React.useMemo(() => {
    const dates: Date[] = [];
    tasks.forEach((task) => {
      if (task.date_execution) {
        const d = new Date(task.date_execution);
        // Éviter les doublons
        if (!dates.some((existing) => isSameDay(existing, d))) {
          dates.push(d);
        }
      }
    });
    return dates;
  }, [tasks]);

  // Tâches du jour sélectionné
  const selectedDateTasks = React.useMemo(() => {
    if (!date) return [];
    return tasks.filter((task) => {
      if (!task.date_execution) return false;
      const d = new Date(task.date_execution);
      return isSameDay(d, date);
    });
  }, [tasks, date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  return (
    <Card className="w-full shadow-xs">
      <CardHeader>
        <CardTitle className="text-base">Calendrier</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fixedWeeks
          locale={fr}
          className="w-full p-0"
          modifiers={{
            event: eventDates,
          }}
          modifiersStyles={{
            event: {
              backgroundColor: "var(--zeno-primary, #02B3C4)",
              color: "white",
              borderRadius: "50%",
              fontWeight: "bold",
            },
          }}
        />

        {date && selectedDateTasks.length > 0 && (
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-sm font-medium">
              {format(date, "EEEE d MMMM", { locale: fr })}
            </p>
            <ul className="mt-1 space-y-1">
              {selectedDateTasks.slice(0, 3).map((task) => (
                <li key={task.id} className="flex items-center gap-2 text-sm">
                  <span
                    className={`size-2 rounded-full ${
                      task.statut === "Terminé"
                        ? "bg-green-500"
                        : task.statut === "En cours"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <span className="truncate">{task.titre}</span>
                </li>
              ))}
              {selectedDateTasks.length > 3 && (
                <li className="text-xs text-muted-foreground">
                  +{selectedDateTasks.length - 3} autre
                  {selectedDateTasks.length - 3 > 1 ? "s" : ""}
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
