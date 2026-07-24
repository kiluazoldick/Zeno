// src/app/(main)/dashboard/kanban/_components/kanban.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  ArrowUpDown,
  Bot,
  ChevronDown,
  Kanban as KanbanIcon,
  LayoutTemplate,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  Table2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import { TaskDialog } from "./task-dialog";
import type { BoardState, ColumnId, Task } from "./types";
import { findColumnId, findTask, getStatusFromColumn } from "./utils";

// Importer le bon hook
import { useUpdateTaskPosition } from "@/hooks/queries/use-tasks";

const columns = [
  { id: "todo", title: "À faire" },
  { id: "in-progress", title: "En cours" },
  { id: "cancelled", title: "Annulé" },
  { id: "done", title: "Terminé" },
] as const;

const columnIds = columns.map((column) => column.id);

// Mapping colonne -> statut
const columnToStatus: Record<
  string,
  "À faire" | "En cours" | "Annulé" | "Terminé"
> = {
  todo: "À faire",
  "in-progress": "En cours",
  cancelled: "Annulé",
  done: "Terminé",
};

interface KanbanProps {
  initialBoard: BoardState;
  members?: any[];
  projects?: any[];
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingTask: any;
  defaultColumn: "todo" | "in-progress" | "cancelled" | "done";
  onAddTask: (columnId?: "todo" | "in-progress" | "cancelled" | "done") => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onSaveTask: (data: any) => void;
  refetch: () => void;
}

export function Kanban({
  initialBoard,
  members = [],
  projects = [],
  dialogOpen,
  setDialogOpen,
  editingTask,
  defaultColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onSaveTask,
  refetch,
}: KanbanProps) {
  const router = useRouter();
  const [board, setBoard] = React.useState<BoardState>(initialBoard);
  const [columnOrder, setColumnOrder] = React.useState<ColumnId[]>([
    ...columnIds,
  ]);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [activeColumnId, setActiveColumnId] = React.useState<ColumnId | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Utiliser le bon hook pour la mise à jour des positions
  const updateTaskPosition = useUpdateTaskPosition();

  const boardBeforeDrag = React.useRef<BoardState | null>(null);
  const orderedColumns = columnOrder.flatMap(
    (columnId) => columns.find((column) => column.id === columnId) ?? [],
  );

  React.useEffect(() => {
    setBoard(initialBoard);
  }, [initialBoard]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "column") return;

    boardBeforeDrag.current = JSON.parse(JSON.stringify(board));
    const task = findTask(board, String(event.active.id));
    setActiveTask(task ?? null);
    setActiveColumnId(findColumnId(board, String(event.active.id)) ?? null);
  }

  function handleDragCancel() {
    if (boardBeforeDrag.current) {
      setBoard(boardBeforeDrag.current);
    }
    boardBeforeDrag.current = null;
    setActiveTask(null);
    setActiveColumnId(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.type === "column") return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setBoard((currentBoard) => {
      const activeColId = findColumnId(currentBoard, activeId);
      const overColId = findColumnId(currentBoard, overId);

      if (overColId) setActiveColumnId(overColId);

      if (!activeColId || !overColId || activeColId === overColId)
        return currentBoard;

      const activeItems = [...currentBoard[activeColId]];
      const overItems = [...currentBoard[overColId]];
      const activeIndex = activeItems.findIndex((task) => task.id === activeId);
      if (activeIndex === -1) return currentBoard;

      const activeItem = activeItems[activeIndex];

      const newActiveItems = activeItems.filter((task) => task.id !== activeId);
      const newOverItems = [...overItems, activeItem];

      return {
        ...currentBoard,
        [activeColId]: newActiveItems,
        [overColId]: newOverItems,
      };
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeType = active.data.current?.type;
    const snapshot = boardBeforeDrag.current;
    boardBeforeDrag.current = null;
    setActiveTask(null);
    setActiveColumnId(null);

    if (isUpdating) {
      if (snapshot) setBoard(snapshot);
      return;
    }

    if (activeType === "column") {
      if (!over) return;

      const activeColumnId = String(active.id) as ColumnId;
      const overColumnId = findColumnId(board, String(over.id));
      if (!overColumnId || activeColumnId === overColumnId) return;

      setColumnOrder((currentOrder) => {
        const activeIndex = currentOrder.indexOf(activeColumnId);
        const overIndex = currentOrder.indexOf(overColumnId);
        if (activeIndex === -1 || overIndex === -1) return currentOrder;
        return arrayMove(currentOrder, activeIndex, overIndex);
      });
      return;
    }

    if (!over) {
      if (snapshot) setBoard(snapshot);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const task = findTask(board, activeId);
    if (!task) {
      if (snapshot) setBoard(snapshot);
      return;
    }

    const activeColumnId = findColumnId(board, activeId);
    const overColumnId = findColumnId(board, overId);

    if (!activeColumnId || !overColumnId) {
      if (snapshot) setBoard(snapshot);
      return;
    }

    // Déterminer la nouvelle position
    const overTasks = board[overColumnId] || [];
    const overIndex = overTasks.findIndex((t) => t.id === overId);
    const newPosition = overIndex >= 0 ? overIndex : overTasks.length;

    if (activeColumnId !== overColumnId) {
      // Changement de colonne
      const newStatus = columnToStatus[overColumnId];

      setIsUpdating(true);
      try {
        const result = await updateTaskPosition.mutateAsync({
          taskId: activeId,
          newPosition: newPosition,
          columnId: newStatus,
        });

        if (result?.error) {
          toast.error("Erreur: " + JSON.stringify(result.error));
          if (snapshot) setBoard(snapshot);
          return;
        }

        toast.success(`Tâche déplacée vers "${getColumnLabel(overColumnId)}"`);

        // Rafraîchir les données
        await refetch();
        setBoard(initialBoard);
      } catch (error: any) {
        toast.error("Erreur: " + error.message);
        if (snapshot) setBoard(snapshot);
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    // Réorganiser dans la même colonne
    const columnTasks = [...board[activeColumnId]];
    const activeIndex = columnTasks.findIndex((t) => t.id === activeId);
    if (activeIndex === -1 || activeIndex === overIndex) {
      if (snapshot) setBoard(snapshot);
      return;
    }

    // Mettre à jour la position dans la même colonne
    setIsUpdating(true);
    try {
      const newStatus = columnToStatus[activeColumnId];
      const result = await updateTaskPosition.mutateAsync({
        taskId: activeId,
        newPosition: overIndex,
        columnId: newStatus,
      });

      if (result?.error) {
        toast.error("Erreur: " + JSON.stringify(result.error));
        if (snapshot) setBoard(snapshot);
        return;
      }

      // Mettre à jour le board localement
      setBoard((currentBoard) => ({
        ...currentBoard,
        [activeColumnId]: arrayMove(columnTasks, activeIndex, overIndex),
      }));
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
      if (snapshot) setBoard(snapshot);
    } finally {
      setIsUpdating(false);
    }
  }

  function getColumnLabel(columnId: ColumnId): string {
    const column = columns.find((c) => c.id === columnId);
    return column?.title || columnId;
  }

  const confirmDelete = (taskId: string, taskTitle: string) => {
    toast.custom((t) => (
      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-lg border max-w-sm dark:bg-gray-900">
        <p className="font-medium">Confirmer la suppression</p>
        <p className="text-sm text-muted-foreground">
          Êtes-vous sûr de vouloir supprimer la tâche{" "}
          <strong>"{taskTitle}"</strong> ?
        </p>
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" size="sm" onClick={() => toast.dismiss(t)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              toast.dismiss(t);
              onDeleteTask(taskId);
            }}
          >
            Supprimer
          </Button>
        </div>
      </div>
    ));
  };

  const hasTasks = Object.values(board).some((tasks) => tasks.length > 0);

  return (
    <>
      <div className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col overflow-hidden">
        {/* Barre d'outils */}
        <div className="flex shrink-0 flex-col gap-3 border-b px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <Tabs defaultValue="board" className="min-w-0">
            <TabsList className="w-full *:data-[slot=tabs-trigger]:flex-1 sm:w-fit sm:*:data-[slot=tabs-trigger]:flex-none">
              <TabsTrigger value="board" className="gap-2">
                <KanbanIcon />
                Tableau
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="gap-2"
                onClick={() => router.push("/dashboard/tasks")}
              >
                <List />
                Liste
              </TabsTrigger>
              <TabsTrigger value="table" className="gap-2" disabled>
                <Table2 />
                Tableau
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center 2xl:justify-end">
            <InputGroup className="min-w-0 sm:w-64 2xl:w-48">
              <InputGroupInput
                type="search"
                placeholder="Rechercher une tâche"
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
            <Button variant="outline" className="w-full sm:w-auto">
              <SlidersHorizontal data-icon="inline-start" />
              Filtrer
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowUpDown data-icon="inline-start" />
              Trier
            </Button>
            <ButtonGroup className="w-full sm:w-fit">
              <Button
                className="flex-1 sm:flex-none bg-zeno-primary hover:bg-zeno-primary/90"
                onClick={() => onAddTask()}
              >
                <Plus data-icon="inline-start" />
                Ajouter une tâche
              </Button>
              <ButtonGroupSeparator />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Menu ajout"
                    className="bg-zeno-primary hover:bg-zeno-primary/90"
                  >
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onAddTask("todo")}>
                    <Plus />
                    Dans "À faire"
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddTask("in-progress")}>
                    <Plus />
                    Dans "En cours"
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Upload />
                    Importer CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LayoutTemplate />
                    Ajouter depuis modèle
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bot />
                    Créer automatisation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        </div>

        {/* Kanban Board avec scroll horizontal */}
        <div className="relative flex-1 min-h-0 overflow-hidden">
          {!hasTasks ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <div className="text-center">
                <KanbanIcon className="mx-auto size-12 opacity-30" />
                <p className="mt-2 text-sm">Aucune tâche dans le Kanban</p>
                <Button
                  variant="link"
                  className="mt-1 text-zeno-primary"
                  onClick={() => onAddTask()}
                >
                  Créer votre première tâche
                </Button>
              </div>
            </div>
          ) : (
            <DndContext
              id="kanban-board"
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <div className="h-full w-full overflow-x-auto overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-border scrollbar-track-transparent">
                <div className="inline-flex h-full min-w-full gap-4 pt-4">
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {orderedColumns.map((column) => (
                      <KanbanColumn
                        key={column.id}
                        column={column}
                        tasks={board[column.id] || []}
                        onAddTask={() => onAddTask(column.id)}
                        onEditTask={(task) => {
                          onEditTask(task);
                        }}
                        onDeleteTask={(taskId) => {
                          const task = (board[column.id] || []).find(
                            (t) => t.id === taskId,
                          );
                          if (task) {
                            confirmDelete(taskId, task.title);
                          }
                        }}
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
              <DragOverlay dropAnimation={null}>
                {activeTask ? (
                  <div className="w-[280px]">
                    <TaskCard
                      task={activeTask}
                      columnId={activeColumnId ?? undefined}
                      isOverlay
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultColumn={defaultColumn}
        onSuccess={onSaveTask}
      />
    </>
  );
}
