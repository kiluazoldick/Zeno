"use client";
"use no memo";

import * as React from "react";

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDownIcon, ListFilter, Loader2 } from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Client } from "@/types/database";

// Données mockées de fallback
const FALLBACK_OPPORTUNITIES = [
  {
    id: "OP-001",
    account: "Groupe Banto",
    stage: "Devis envoyé",
    priority: "Haute",
    health: "En bonne voie",
    value: "42 000 000 FCFA",
  },
  {
    id: "OP-002",
    account: "Hôtel Royal",
    stage: "Découverte",
    priority: "Haute",
    health: "En attente",
    value: "18 500 000 FCFA",
  },
  {
    id: "OP-003",
    account: "Hôpital Central",
    stage: "Négociation",
    priority: "Haute",
    health: "À risque",
    value: "63 000 000 FCFA",
  },
  {
    id: "OP-004",
    account: "Marché Municipal",
    stage: "Qualifié",
    priority: "Haute",
    health: "À risque",
    value: "26 400 000 FCFA",
  },
  {
    id: "OP-005",
    account: "Complexe Sportif",
    stage: "Devis envoyé",
    priority: "Haute",
    health: "À revoir",
    value: "58 900 000 FCFA",
  },
];

const stageOptions = [
  "all",
  "Devis envoyé",
  "Découverte",
  "Négociation",
  "Qualifié",
] as const;
const healthOptions = [
  "all",
  "En bonne voie",
  "À revoir",
  "À risque",
  "En attente",
] as const;

interface OpportunitiesSectionProps {
  clients: Client[];
}

export function OpportunitiesSection({ clients }: OpportunitiesSectionProps) {
  // Transformer les clients en opportunités
  const opportunities = React.useMemo(() => {
    if (!clients || clients.length === 0) {
      return FALLBACK_OPPORTUNITIES;
    }

    return clients.map((client, index) => {
      // Déterminer le stade en fonction des projets
      const hasProjects = client.projects && client.projects.length > 0;
      const hasAcceptedDevis = client.projects?.some((p) =>
        p.devis?.some((d) => d.statut === "Accepté"),
      );

      let stage = "Qualifié";
      if (hasAcceptedDevis) stage = "Négociation";
      else if (hasProjects) stage = "Devis envoyé";

      // Déterminer la santé
      let health = "En bonne voie";
      if (client.projects?.some((p) => p.statut === "Annulé"))
        health = "À risque";
      else if (!hasProjects) health = "En attente";

      return {
        id: `OP-${String(index + 1).padStart(3, "0")}`,
        account: client.nom,
        stage,
        priority: "Haute",
        health,
        value: `${new Intl.NumberFormat("fr-FR").format(client.projects?.reduce((sum, p) => sum + (p.budget_total || 0), 0) || 0)} FCFA`,
      };
    });
  }, [clients]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Colonnes du tableau
  const columns = [
    { id: "account", header: "Client", accessorKey: "account" },
    { id: "stage", header: "Étape", accessorKey: "stage" },
    { id: "priority", header: "Priorité", accessorKey: "priority" },
    { id: "health", header: "Santé", accessorKey: "health" },
    { id: "value", header: "Valeur", accessorKey: "value" },
  ];

  const table = useReactTable({
    data: opportunities,
    columns: columns as any,
    state: {
      rowSelection,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  const searchQuery = table.getState().globalFilter ?? "";
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const filteredOpportunityCount = table.getFilteredRowModel().rows.length;
  const visibleOpportunityCount = table.getRowModel().rows.length;

  const pageNumbers = React.useMemo(() => {
    if (pageCount <= 3) {
      return Array.from({ length: pageCount }, (_, index) => index + 1);
    }
    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= pageCount - 1)
      return [pageCount - 2, pageCount - 1, pageCount];
    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, pageCount]);

  function preventPaginationNavigation(
    event: React.MouseEvent<HTMLAnchorElement>,
  ) {
    event.preventDefault();
  }

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">
            Clients et opportunités
          </CardTitle>
          <CardDescription>
            Suivez les clients et leurs projets en cours
          </CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Input
                className="h-7 w-44 md:w-52"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(event) => {
                  table.setGlobalFilter(event.target.value || undefined);
                  table.setPageIndex(0);
                }}
              />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-0">
          <div className="overflow-hidden">
            <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4 **:data-[slot='table-cell']:py-4">
              <TableHeader className="border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground **:data-[slot='table-head']:text-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot='table-row']:border-border/50 **:data-[slot='table-row']:hover:bg-transparent">
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getVisibleLeafColumns().length}
                      className="h-24 text-center"
                    >
                      Aucun résultat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 pb-1">
            <p className="text-muted-foreground text-sm">
              Affichage de {visibleOpportunityCount} sur{" "}
              {filteredOpportunityCount.toLocaleString()} clients
            </p>

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent className="gap-1.5">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={
                      !table.getCanPreviousPage()
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                    onClick={(event) => {
                      preventPaginationNavigation(event);
                      table.previousPage();
                    }}
                  />
                </PaginationItem>
                {pageNumbers[0] > 1 ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
                {pageNumbers.map((pageNumber) => (
                  <PaginationItem key={`page-${pageNumber}`}>
                    <PaginationLink
                      href="#"
                      isActive={
                        table.getState().pagination.pageIndex === pageNumber - 1
                      }
                      onClick={(event) => {
                        preventPaginationNavigation(event);
                        table.setPageIndex(pageNumber - 1);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {pageNumbers[pageNumbers.length - 1] < pageCount ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={
                      !table.getCanNextPage()
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                    onClick={(event) => {
                      preventPaginationNavigation(event);
                      table.nextPage();
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
