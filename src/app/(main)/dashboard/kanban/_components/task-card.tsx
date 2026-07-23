"use client";

import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  FileText,
  Flame,
  type LucideIcon,
  MapPin,
  MessageSquare,
  Minus,
  Paperclip,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn, getInitials } from "@/lib/utils";

import { tagTones } from "./data";
import type { ColumnId, Task, TaskInsightLabel, TaskPriority } from "./types";

const taskInsightIcons: Record<TaskInsightLabel, LucideIcon> = {
  Attachments: Paperclip,
  Comments: MessageSquare,
  Documents: FileText,
};

const priorityBadgeConfig: Record<
  TaskPriority,
  { icon: LucideIcon; variant: "destructive" | "secondary"; className: string }
> = {
  Haute: {
    icon: Flame,
    variant: "destructive",
    className: "border-transparent",
  },
  Basse: {
    icon: Minus,
    variant: "secondary",
    className:
      "bg-slate-500/10 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  },
  Moyenne: {
    icon: ArrowUpRight,
    variant: "secondary",
    className:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
};

interface TaskCardProps {
  task: Task;
  columnId?: ColumnId;
  isOverlay?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({
  task,
  columnId,
  isOverlay = false,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const isDone = columnId === "done";
  const owner = task.owner;
  const PriorityIcon = priorityBadgeConfig[task.priority]?.icon;

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-xs relative group",
        isOverlay && "w-68 rotate-1 shadow-lg",
        task.reportDone && isDone && "border-green-500/30",
      )}
    >
      {/* Menu d'actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit?.(task)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(task.id)}
              variant="destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="min-w-0 truncate font-medium text-sm leading-none">
            {task.title}
          </h3>
          {PriorityIcon && (
            <Badge
              variant={priorityBadgeConfig[task.priority].variant}
              className={cn(
                "shrink-0 rounded-md border-transparent px-2 font-medium",
                priorityBadgeConfig[task.priority].className,
              )}
            >
              <PriorityIcon className="mr-1 h-3 w-3" />
              {task.priority}
            </Badge>
          )}
        </div>
        <p className="line-clamp-2 text-muted-foreground text-sm leading-5">
          {task.description}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Avatar className={cn("size-5 after:rounded-sm", owner?.tone || "")}>
            <AvatarFallback className="rounded-sm text-[10px]">
              {getInitials(owner?.name || "N/A")}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-sm">
            {owner?.name || "Non assigné"}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-3 text-muted-foreground">
          {task.location && (
            <span className="flex items-center gap-1 text-xs">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-20">{task.location}</span>
            </span>
          )}
          <span className="flex items-center gap-1 text-xs">
            <CalendarDays className="h-3 w-3" />
            <span>{task.dueDate}</span>
          </span>
        </div>
      </div>

      {/* Rapport effectué ? */}
      {columnId === "done" && (
        <div className="flex items-center gap-2 text-xs">
          {task.reportDone ? (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Rapport effectué
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-600">
              <span className="h-3.5 w-3.5 rounded-full border-2 border-amber-500" />
              Rapport à faire
            </span>
          )}
        </div>
      )}

      {!isDone && task.progress > 0 && task.progress < 100 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span className="leading-none">Progression</span>
            <span className="tabular-nums leading-none">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-1.5" />
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between">
        {isDone ? (
          <div className="flex items-center gap-1 font-medium text-green-700 text-sm dark:text-green-600">
            <BadgeCheck className="h-4 w-4" />
            Terminé
          </div>
        ) : (
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            {task.insights?.map((insight) => {
              const Icon = taskInsightIcons[insight.label];

              return (
                <span
                  key={insight.label}
                  className="flex items-center gap-1.5 text-sm"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {insight.count}
                </span>
              );
            })}
          </div>
        )}

        <Badge
          variant="secondary"
          className={cn(
            "rounded-md border-transparent px-2 font-medium text-xs",
            tagTones[task.team] || "bg-gray-500/10 text-gray-700",
          )}
        >
          {task.team || "Sans projet"}
        </Badge>
      </div>
    </article>
  );
}
