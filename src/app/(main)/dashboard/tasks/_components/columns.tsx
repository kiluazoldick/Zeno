"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, MapPin, MoreHorizontal, RotateCcw, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { labels, priorities, statuses, type Task } from "./data";

const statusStyles: Record<string, string> = {
  "À faire": "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  "En cours": "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Annulé: "border-muted-foreground/20 bg-muted text-muted-foreground",
  Terminé: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
};

function SortIcon({ sortDirection }: { sortDirection: false | "asc" | "desc" }) {
  if (sortDirection === "desc") {
    return <ArrowDown data-icon="inline-end" />;
  }

  if (sortDirection === "asc") {
    return <ArrowUp data-icon="inline-end" />;
  }

  return <ArrowUpDown data-icon="inline-end" />;
}

function TitleColumnHeader({ column }: { column: Column<Task, unknown> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground data-[state=open]:bg-accent">
          Titre
          <SortIcon sortDirection={column.getIsSorted()} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={() => column.toggleSorting(false)}>
          <ArrowUp />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => column.toggleSorting(true)}>
          <ArrowDown />
          Desc
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => column.clearSorting()}>
          <RotateCcw />
          Réinitialiser
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionner tout"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="w-20 font-mono text-muted-foreground text-sm">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <TitleColumnHeader column={column} />,
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex min-w-0 items-center gap-2">
          {label && (
            <Badge className="rounded-sm bg-transparent" variant="outline">
              {label.label}
            </Badge>
          )}
          <span className="max-w-lg truncate font-medium text-sm">{row.getValue("title")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: "Assigné à",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <User className="size-3.5 text-muted-foreground" />
        <span>{row.getValue("assignee")}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.getValue("status"));

      if (!status) {
        return null;
      }

      return (
        <Badge className={cn("gap-1.5 rounded-sm border font-medium", statusStyles[status.value])} variant="outline">
          {status.icon && <status.icon className="size-4" />}
          {status.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: "Priorité",
    cell: ({ row }) => {
      const priority = priorities.find((priority) => priority.value === row.getValue("priority"));

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center gap-2 text-sm">
          {priority.icon && <priority.icon className="size-4 text-muted-foreground" />}
          {priority.label}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="size-3.5 text-muted-foreground" />
        <span>{row.getValue("date")}</span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Lieu",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="size-3.5 text-muted-foreground" />
        <span>{row.getValue("location") || "-"}</span>
      </div>
    ),
  },
  {
    accessorKey: "reportDone",
    header: "Rapport",
    cell: ({ row }) => {
      const reportDone = row.getValue("reportDone") as boolean;
      return (
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            reportDone
              ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300"
              : "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
          )}
        >
          {reportDone ? "✅ Effectué" : "⏳ À faire"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original as Task;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground data-[state=open]:bg-muted">
                <MoreHorizontal />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>Modifier</DropdownMenuItem>
              <DropdownMenuItem>Dupliquer</DropdownMenuItem>
              <DropdownMenuItem>Favoris</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Étiquettes</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={task.label}>
                    {labels.map((label) => (
                      <DropdownMenuRadioItem key={label.value} value={label.value}>
                        {label.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Supprimer
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
