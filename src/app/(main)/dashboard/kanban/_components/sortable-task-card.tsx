"use client";

import { useSortable } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { TaskCard } from "./task-card";
import type { ColumnId, Task } from "./types";

interface SortableTaskCardProps {
  task: Task;
  columnId: ColumnId;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function SortableTaskCard({
  task,
  columnId,
  onEdit,
  onDelete,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      className={cn("touch-none", isDragging && "opacity-30")}
      {...attributes}
      {...listeners}
    >
      <TaskCard
        task={task}
        columnId={columnId}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
