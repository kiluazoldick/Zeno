// src/app/(main)/dashboard/users/_components/users.tsx
"use client";
"use no memo";

import * as React from "react";
import { useState, useEffect } from "react";

import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Grid, Plus, Rows3, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { filters, type UserRow } from "./data";
import { usersColumns } from "./users-columns";
import { UsersTable } from "./users-table";
import { MemberDialog } from "./member-dialog";

interface UsersProps {
  users: any[];
  onAddMember: () => void;
  onEditMember: (member: any) => void;
  onDeleteMember: (id: string) => void;
  onSaveMember: (data: any) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingMember: any;
  refetch: () => void;
}

export function Users({
  users,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onSaveMember,
  dialogOpen,
  setDialogOpen,
  editingMember,
  refetch,
}: UsersProps) {
  // Transformer les données Supabase vers le format attendu par le tableau
  const userData: UserRow[] = React.useMemo(() => {
    if (!users || users.length === 0) return [];

    return users.map((member: any) => ({
      id: member.id,
      name: member.nom || "Membre sans nom",
      email: member.email || "",
      role: member.role || "Membre",
      status: member.status || "Actif",
      team: member.equipe || "Non assigné",
      password: member.password || null,
      workspace: member.projets || ["Tous les projets"],
      joinedDate: member.joined_date
        ? new Date(member.joined_date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Date inconnue",
      joinedDateRaw: member.joined_date || null,
      lastActive: 0,
    }));
  }, [users]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "joinedDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      search: false,
      team: false,
    });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: userData,
    columns: usersColumns,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => row.id || row.email,
    autoResetPageIndex: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const searchQuery =
    (table.getColumn("search")?.getFilterValue() as string) ?? "";
  const roleFilter =
    (table.getColumn("role")?.getFilterValue() as string) ?? filters.role[0];
  const teamFilter =
    (table.getColumn("team")?.getFilterValue() as string) ?? filters.team[0];
  const statusFilter =
    (table.getColumn("status")?.getFilterValue() as string) ??
    filters.status[0];
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  function setColumnSelectFilter(columnId: string, value: string) {
    table
      .getColumn(columnId)
      ?.setFilterValue(value === "Tous" ? undefined : value);
    table.setPageIndex(0);
  }

  const handleEditFromTable = (member: UserRow) => {
    const originalMember = users.find((u: any) => u.id === member.id);
    if (originalMember) {
      onEditMember(originalMember);
    }
  };

  const handleDeleteFromTable = (member: UserRow) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer définitivement le membre "${member.name}" ?`,
      )
    ) {
      if (member.id) {
        onDeleteMember(member.id);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">
          Membres de l'équipe
        </CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          Gérez les membres de l'équipe Zoldick et leurs accès.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-7 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-7"
              placeholder="Rechercher un membre..."
              value={searchQuery}
              onChange={(event) => {
                table
                  .getColumn("search")
                  ?.setFilterValue(event.target.value || undefined);
                table.setPageIndex(0);
              }}
            />
            <InputGroupAddon align="inline-end">
              <Kbd className="h-4 text-[10px]">⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <Button
            size="sm"
            className="bg-zeno-primary hover:bg-zeno-primary/90"
            onClick={onAddMember}
          >
            <Plus /> Ajouter un membre
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={roleFilter}
              onValueChange={(value) => setColumnSelectFilter("role", value)}
            >
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Rôle:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {filters.role.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={teamFilter}
              onValueChange={(value) => setColumnSelectFilter("team", value)}
            >
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Équipe:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {filters.team.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) => setColumnSelectFilter("status", value)}
            >
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Statut:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {filters.status.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-4">
          <div className="text-muted-foreground text-sm tabular-nums">
            {selectedCount} sélectionné(s)
          </div>

          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list" aria-label="Vue liste">
                <Rows3 />
              </TabsTrigger>
              <TabsTrigger value="grid" aria-label="Vue grille">
                <Grid />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <UsersTable
          table={table}
          onEdit={handleEditFromTable}
          onDelete={handleDeleteFromTable}
        />
      </CardContent>

      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editingMember}
        onSave={onSaveMember}
        isEditing={!!editingMember}
      />
    </Card>
  );
}
