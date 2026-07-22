"use client";
"use no memo";

import * as React from "react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  MoreHorizontal,
  Search,
  Pin,
  Archive,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Annonce } from "@/types/database";

import {
  fallbackAnnonces,
  importanceColors,
  statusColors,
} from "./annonce-data";

interface AnnonceListProps {
  annonces: Annonce[];
  isLoading: boolean;
}

const importanceOptions = ["Tous", "Haute", "Normale", "Basse"];
const statusOptionsList = ["Tous", "Publiée", "Archivée", "Brouillon"];

function getPageNumbers(currentPage: number, pageCount: number) {
  if (pageCount <= 3) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1)
    return [pageCount - 2, pageCount - 1, pageCount];
  return [currentPage - 1, currentPage, currentPage + 1];
}

function preventPaginationNavigation(
  event: React.MouseEvent<HTMLAnchorElement>,
) {
  event.preventDefault();
}

export function AnnonceList({ annonces, isLoading }: AnnonceListProps) {
  const data = annonces && annonces.length > 0 ? annonces : fallbackAnnonces;

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(
      (annonce) =>
        annonce.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        annonce.contenu.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, data]);

  const columns: ColumnDef<Annonce>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Sélectionner tous"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Sélectionner ${row.original.titre}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm text-muted-foreground">
          {row.original.id.substring(0, 7)}
        </div>
      ),
    },
    {
      accessorKey: "titre",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 text-muted-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Titre
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-sm">
            {row.original.titre}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "importance",
      header: "Importance",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "gap-1 rounded-sm border font-medium",
            importanceColors[row.original.importance],
          )}
          variant="outline"
        >
          {row.original.importance}
        </Badge>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.statut;
        return (
          <Badge
            className={cn(
              "gap-1 rounded-sm border font-medium",
              statusColors[status],
            )}
            variant="outline"
          >
            {status}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "date_annonce",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.date_annonce).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      accessorKey: "commentaires_count",
      header: "Commentaires",
      cell: ({ row }) => (
        <div className="text-sm text-center">
          {row.original.commentaires_count || 0}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const annonce = row.original;
        const isDraft = annonce.statut === "Brouillon";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="size-4" />
                Voir l'annonce
              </DropdownMenuItem>
              {isDraft && (
                <>
                  <DropdownMenuItem>
                    <Pin className="size-4" />
                    Publier
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {annonce.statut === "Publiée" && (
                <DropdownMenuItem>
                  <Archive className="size-4" />
                  Archiver
                </DropdownMenuItem>
              )}
              {isDraft && (
                <DropdownMenuItem variant="destructive">
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      rowSelection,
      columnFilters,
      columnVisibility,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = Math.min(
    table.getState().pagination.pageIndex + 1,
    pageCount,
  );
  const pageNumbers = getPageNumbers(currentPage, pageCount);

  const importanceFilter =
    (table.getColumn("importance")?.getFilterValue() as string[]) ?? [];
  const statusFilter =
    (table.getColumn("statut")?.getFilterValue() as string[]) ?? [];

  function toggleImportanceFilter(value: string) {
    const current = importanceFilter;
    const newFilter = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    table
      .getColumn("importance")
      ?.setFilterValue(newFilter.length ? newFilter : undefined);
    table.setPageIndex(0);
  }

  function toggleStatusFilter(value: string) {
    const current = statusFilter;
    const newFilter = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    table
      .getColumn("statut")
      ?.setFilterValue(newFilter.length ? newFilter : undefined);
    table.setPageIndex(0);
  }

  function clearFilters() {
    table.getColumn("importance")?.setFilterValue(undefined);
    table.getColumn("statut")?.setFilterValue(undefined);
    setSearchQuery("");
    table.setPageIndex(0);
  }

  const isFiltered =
    importanceFilter.length > 0 ||
    statusFilter.length > 0 ||
    searchQuery.length > 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">Liste des annonces</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">Liste des annonces</CardTitle>
        <CardDescription>
          Toutes les communications officielles et informations
        </CardDescription>
        <CardAction>
          <div className="flex flex-wrap items-center gap-2">
            <InputGroup className="h-7 w-44 md:w-52">
              <InputGroupInput
                className="h-7"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon>
                <Search className="size-3.5" />
              </InputGroupAddon>
            </InputGroup>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Importance
                  <ChevronDown className="ml-1 size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {importanceOptions.map((importance) => (
                  <DropdownMenuCheckboxItem
                    key={importance}
                    checked={
                      importance === "Tous"
                        ? importanceFilter.length === 0
                        : importanceFilter.includes(importance)
                    }
                    onCheckedChange={() => {
                      if (importance === "Tous") {
                        table
                          .getColumn("importance")
                          ?.setFilterValue(undefined);
                        table.setPageIndex(0);
                      } else {
                        toggleImportanceFilter(importance);
                      }
                    }}
                  >
                    {importance}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Statut
                  <ChevronDown className="ml-1 size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {statusOptionsList.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={
                      status === "Tous"
                        ? statusFilter.length === 0
                        : statusFilter.includes(status)
                    }
                    onCheckedChange={() => {
                      if (status === "Tous") {
                        table.getColumn("statut")?.setFilterValue(undefined);
                        table.setPageIndex(0);
                      } else {
                        toggleStatusFilter(status);
                      }
                    }}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isFiltered && (
              <Button variant="destructive" size="sm" onClick={clearFilters}>
                Effacer les filtres
              </Button>
            )}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="overflow-hidden">
          <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4 **:data-[slot='table-cell']:py-3">
            <TableHeader className="border-t **:data-[slot='table-head']:h-10 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground **:data-[slot='table-head']:text-xs">
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
            <TableBody className="**:data-[slot='table-row']:border-border/50">
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
                    Aucune annonce trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between gap-4 px-4 pb-1">
          <p className="text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} sélectionné(s)
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Lignes</span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[10, 20, 30, 50].map((size) => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <span className="text-muted-foreground text-sm">
              Page {currentPage} sur {pageCount}
            </span>
          </div>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1">
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
              {pageNumbers[0] > 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {pageNumbers.map((pageNumber) => (
                <PaginationItem key={pageNumber}>
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
              {pageNumbers[pageNumbers.length - 1] < pageCount && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
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
  );
}
