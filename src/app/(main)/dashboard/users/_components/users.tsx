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
import {
  Cog,
  Download,
  Grid,
  Plus,
  Rows3,
  Search,
  SlidersHorizontal,
} from "lucide-react";

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

import { filters, type UserRow, defaultUsers } from "./data";
import { usersColumns } from "./users-columns";
import { UsersTable } from "./users-table";
import { MemberDialog } from "./member-dialog";
import {
  useCreateMember,
  useUpdateMember,
  useDeleteMember,
} from "@/hooks/queries/use-members";

// Données mockées de fallback
const MOCK_USERS: UserRow[] = [
  {
    name: "Nanga Doumer",
    email: "nanga.doumer@zoldick.cm",
    role: "Directeur Général",
    status: "Actif",
    team: "Direction",
    workspace: ["Tous les projets"],
    joinedDate: "01 Jan 2020, 8:00 AM",
    lastActive: 0,
  },
  {
    name: "Sarah M.",
    email: "sarah.m@zoldick.cm",
    role: "Chef de chantier",
    status: "Actif",
    team: "Terrain",
    workspace: ["Banto", "Hôtel Royal"],
    joinedDate: "15 Mar 2022, 9:30 AM",
    lastActive: 5,
  },
  {
    name: "Jean K.",
    email: "jean.k@zoldick.cm",
    role: "Responsable Commercial",
    status: "Actif",
    team: "Commercial",
    workspace: ["Hôpital Central", "Marché Municipal"],
    joinedDate: "19 Mai 2022, 3:00 PM",
    lastActive: 20,
  },
  {
    name: "Marie L.",
    email: "marie.l@zoldick.cm",
    role: "Responsable Financier",
    status: "Actif",
    team: "Finance",
    workspace: ["Tous les projets"],
    joinedDate: "10 Avr 2022, 8:30 AM",
    lastActive: 15,
  },
];

export function Users({ users }: { users: UserRow[] }) {
  // Utiliser les données réelles ou le fallback
  const userData = users.length > 0 ? users : MOCK_USERS;

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

  // État pour les dialogues
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<UserRow | null>(null);
  const [deletingMember, setDeletingMember] = useState<UserRow | null>(null);

  // Mutations
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

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
    getRowId: (row) => row.email,
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
  const workspaceFilter =
    (table.getColumn("workspace")?.getFilterValue() as string) ??
    filters.workspace[0];
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  function setColumnSelectFilter(columnId: string, value: string) {
    table
      .getColumn(columnId)
      ?.setFilterValue(value === "Tous" ? undefined : value);
    table.setPageIndex(0);
  }

  // Écouter les événements pour l'édition et la suppression
  useEffect(() => {
    const handleEdit = (event: Event) => {
      const customEvent = event as CustomEvent;
      const member = customEvent.detail as UserRow;
      setEditingMember(member);
      setDialogOpen(true);
    };

    const handleDelete = (event: Event) => {
      const customEvent = event as CustomEvent;
      const member = customEvent.detail as UserRow;
      if (
        window.confirm(
          `Êtes-vous sûr de vouloir supprimer le membre "${member.name}" ?`,
        )
      ) {
        deleteMember.mutate({ id: member.email });
      }
    };

    document.addEventListener("editMember", handleEdit);
    document.addEventListener("deleteMember", handleDelete);

    return () => {
      document.removeEventListener("editMember", handleEdit);
      document.removeEventListener("deleteMember", handleDelete);
    };
  }, [deleteMember]);

  const handleCreateMember = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleDialogSave = (data: any) => {
    if (editingMember) {
      // Pour la modification, on utilise l'email comme ID
      updateMember.mutate({ id: editingMember.email, data });
    } else {
      createMember.mutate(data);
    }
    setDialogOpen(false);
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
          <Button variant="outline" size="sm">
            <SlidersHorizontal /> Masquer
          </Button>
          <Button variant="outline" size="sm">
            <Cog /> Personnaliser
          </Button>
          <Button variant="outline" size="sm">
            <Download /> Exporter
          </Button>
          <Button
            size="sm"
            className="bg-zeno-primary hover:bg-zeno-primary/90"
            onClick={handleCreateMember}
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

          <Select
            value={workspaceFilter}
            onValueChange={(value) => setColumnSelectFilter("workspace", value)}
          >
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Projets:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                {filters.workspace.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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

        <UsersTable table={table} />
      </CardContent>

      {/* Dialogue de création/édition */}
      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editingMember}
        onSave={handleDialogSave}
      />
    </Card>
  );
}
