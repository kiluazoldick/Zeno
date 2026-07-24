// src/app/(main)/dashboard/kanban/_components/task-card.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
  Folder,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import type { Task } from "./types";

interface TaskCardProps {
  task: Task;
  columnId?: string;
  isOverlay?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TaskCard({
  task,
  columnId,
  isOverlay = false,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Haute":
        return "border-l-4 border-l-red-500";
      case "Moyenne":
        return "border-l-4 border-l-amber-500";
      case "Basse":
        return "border-l-4 border-l-emerald-500";
      default:
        return "";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Haute":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "Moyenne":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "Basse":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getInitials = (name: string) => {
    if (!name || name === "Non assigné") return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("touch-none select-none", isDragging && "opacity-50")}
    >
      <Card
        className={cn(
          "relative shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing",
          isOverlay && "shadow-lg ring-2 ring-primary scale-105",
          getPriorityColor(task.priority),
        )}
      >
        <CardContent className="p-3 space-y-2">
          {/* Titre + Actions */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm line-clamp-2 flex-1">
              {task.title}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-medium",
                  getPriorityBadge(task.priority),
                )}
              >
                {task.priority}
              </Badge>
              {!isOverlay && (onEdit || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {onEdit && (
                      <DropdownMenuItem onClick={onEdit}>
                        <Pencil className="size-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={onDelete}
                        variant="destructive"
                      >
                        <Trash2 className="size-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {task.owner && task.owner.name !== "Non assigné" && (
              <div className="flex items-center gap-1">
                <Avatar className="size-5">
                  <AvatarFallback className={cn("text-xs", task.owner.tone)}>
                    {getInitials(task.owner.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate max-w-[60px]">{task.owner.name}</span>
              </div>
            )}

            {task.team && task.team !== "Sans projet" && (
              <div className="flex items-center gap-1">
                <Folder className="size-3 shrink-0" />
                <span className="truncate max-w-[60px]">{task.team}</span>
              </div>
            )}

            {task.dueDate && task.dueDate !== "Non défini" && (
              <div className="flex items-center gap-1">
                <Calendar className="size-3 shrink-0" />
                <span>{task.dueDate}</span>
              </div>
            )}

            {task.location && (
              <div className="flex items-center gap-1">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate max-w-[50px]">{task.location}</span>
              </div>
            )}
          </div>

          {/* Progression */}
          {task.progress > 0 && (
            <div className="mt-1">
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-zeno-primary transition-all"
                  style={{ width: `${Math.min(task.progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
