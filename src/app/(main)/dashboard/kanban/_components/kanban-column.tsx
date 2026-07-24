// src/app/(main)/dashboard/kanban/_components/kanban-column.tsx
"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { TaskCard } from "./task-card";
import type { Column, Task } from "./types";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return "border-t-4 border-t-blue-400";
      case "in-progress":
        return "border-t-4 border-t-amber-400";
      case "cancelled":
        return "border-t-4 border-t-red-400";
      case "done":
        return "border-t-4 border-t-emerald-400";
      default:
        return "";
    }
  };

  const getCountColor = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "in-progress":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "done":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex h-full min-h-[300px] w-[280px] shrink-0 flex-col rounded-lg border bg-card p-3 shadow-sm transition-shadow",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary",
        getColumnColor(column.id),
      )}
    >
      {/* En-tête */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="size-4 text-muted-foreground cursor-grab shrink-0" />
          <h3 className="font-semibold text-sm truncate">{column.title}</h3>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0",
              getCountColor(column.id),
            )}
          >
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 shrink-0"
          onClick={onAddTask}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <Separator className="mb-3 shrink-0" />

      {/* Liste des tâches avec scroll */}
      <ScrollArea className="flex-1 min-h-0 -mr-3 pr-3">
        <div className="space-y-2 pb-2">
          {tasks.length === 0 ? (
            <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 text-sm text-muted-foreground">
              <p>Déposez une tâche</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
