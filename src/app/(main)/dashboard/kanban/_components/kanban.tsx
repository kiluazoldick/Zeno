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

// Importer directement les actions
import { updateTaskStatus } from "@/lib/actions/tasks/update-task-status";
import { deleteTask } from "@/lib/actions/tasks/delete-task";

// Définir les colonnes ici (plus d'import de data.ts)
const columns = [
  { id: "todo", title: "À faire" },
  { id: "in-progress", title: "En cours" },
  { id: "cancelled", title: "Annulé" },
  { id: "done", title: "Terminé" },
] as const;

const columnIds = columns.map((column) => column.id);

interface KanbanProps {
  initialBoard: BoardState;
  members?: any[];
  projects?: any[];
}

export function Kanban({
  initialBoard,
  members = [],
  projects = [],
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
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [defaultColumn, setDefaultColumn] = React.useState<ColumnId>("todo");
  const [isUpdating, setIsUpdating] = React.useState(false);

  const boardBeforeDrag = React.useRef<BoardState | null>(null);
  const orderedColumns = columnOrder.flatMap(
    (columnId) => columns.find((column) => column.id === columnId) ?? [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleCreateTask = (columnId?: ColumnId) => {
    setEditingTask(null);
    setDefaultColumn(columnId || "todo");
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;

    try {
      const result = await deleteTask(taskId);
      if (result.error) {
        toast.error("Erreur: " + result.error);
        return;
      }

      setBoard((current) => {
        const newBoard = { ...current };
        for (const colId of columnIds) {
          newBoard[colId] = newBoard[colId].filter((t) => t.id !== taskId);
        }
        return newBoard;
      });

      toast.success("Tâche supprimée avec succès");
      router.refresh();
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    }
  };

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "column") return;

    boardBeforeDrag.current = board;
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

      const activeItems = currentBoard[activeColId];
      const overItems = currentBoard[overColId];
      const activeIndex = activeItems.findIndex((task) => task.id === activeId);
      if (activeIndex === -1) return currentBoard;

      const overIndex = overItems.findIndex((task) => task.id === overId);
      const nextIndex = overIndex >= 0 ? overIndex : overItems.length;
      const activeItem = activeItems[activeIndex];

      return {
        ...currentBoard,
        [activeColId]: activeItems.filter((task) => task.id !== activeId),
        [overColId]: [
          ...overItems.slice(0, nextIndex),
          activeItem,
          ...overItems.slice(nextIndex),
        ],
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

    if (isUpdating) return;

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
    if (!task) return;

    const activeColumnId = findColumnId(board, activeId);
    const overColumnId = findColumnId(board, overId);

    if (!activeColumnId || !overColumnId) return;

    if (activeColumnId !== overColumnId) {
      const newStatus = getStatusFromColumn(overColumnId);

      setBoard((currentBoard) => {
        const activeItems = currentBoard[activeColumnId];
        const overItems = currentBoard[overColumnId];
        const activeIndex = activeItems.findIndex((t) => t.id === activeId);
        if (activeIndex === -1) return currentBoard;

        const overIndex = overItems.findIndex((t) => t.id === overId);
        const nextIndex = overIndex >= 0 ? overIndex : overItems.length;
        const activeItem = activeItems[activeIndex];

        return {
          ...currentBoard,
          [activeColumnId]: activeItems.filter((t) => t.id !== activeId),
          [overColumnId]: [
            ...overItems.slice(0, nextIndex),
            activeItem,
            ...overItems.slice(nextIndex),
          ],
        };
      });

      setIsUpdating(true);
      try {
        const result = await updateTaskStatus(activeId, newStatus);

        if (result.error) {
          toast.error("Erreur: " + result.error);
          if (snapshot) setBoard(snapshot);
          return;
        }

        toast.success("Statut mis à jour");
        router.refresh();
      } catch (error: any) {
        toast.error("Erreur: " + error.message);
        if (snapshot) setBoard(snapshot);
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    const columnTasks = board[activeColumnId];
    const activeIndex = columnTasks.findIndex((t) => t.id === activeId);
    const overIndex = columnTasks.findIndex((t) => t.id === overId);
    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex)
      return;

    setBoard((currentBoard) => ({
      ...currentBoard,
      [activeColumnId]: arrayMove(columnTasks, activeIndex, overIndex),
    }));
  }

  const hasTasks = Object.values(board).some((tasks) => tasks.length > 0);

  return (
    <>
      <div className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col overflow-hidden">
        <div className="flex shrink-0 flex-col gap-3 border-b px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <Tabs defaultValue="board" className="min-w-0">
            <TabsList className="w-full *:data-[slot=tabs-trigger]:flex-1 sm:w-fit sm:*:data-[slot=tabs-trigger]:flex-none">
              <TabsTrigger value="board" className="gap-2">
                <KanbanIcon />
                Tableau
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List />
                Liste
              </TabsTrigger>
              <TabsTrigger value="table" className="gap-2">
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
                onClick={() => handleCreateTask()}
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
                  <DropdownMenuItem onClick={() => handleCreateTask("todo")}>
                    <Plus />
                    Dans "À faire"
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleCreateTask("in-progress")}
                  >
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

        {!hasTasks ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <KanbanIcon className="mx-auto size-12 opacity-30" />
              <p className="mt-2 text-sm">Aucune tâche dans le Kanban</p>
              <Button
                variant="link"
                className="mt-1 text-zeno-primary"
                onClick={() => handleCreateTask()}
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
            <div className="scrollbar-thin min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden bg-muted/25 px-4 pt-4 pb-0 [scrollbar-color:var(--border)_transparent] lg:px-5 lg:pt-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1">
              <div className="inline-grid h-full min-w-full grid-cols-[repeat(4,minmax(20rem,1fr))] gap-4">
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {orderedColumns.map((column) => (
                    <KanbanColumn
                      key={column.id}
                      column={column}
                      tasks={board[column.id]}
                      onAddTask={() => handleCreateTask(column.id)}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
            <DragOverlay dropAnimation={null}>
              {activeTask ? (
                <TaskCard
                  task={activeTask}
                  columnId={activeColumnId ?? undefined}
                  isOverlay
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultColumn={defaultColumn}
        members={members}
        projects={projects}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
}
