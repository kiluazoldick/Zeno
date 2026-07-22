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
  FileDown,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Trash2,
  CheckCircle,
  XCircle,
  Ban,
  CreditCard,
  Loader2,
  FileText,
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
import type { Invoice } from "@/types/database";

import { fallbackFactures, statusColors } from "./facture-data";

interface FactureListProps {
  factures: Invoice[];
  isLoading: boolean;
}

const priorityColors: Record<string, string> = {
  Haute: "text-destructive",
  Moyenne: "text-amber-500",
  Basse: "text-muted-foreground",
};

const statusOptions = [
  "Tous",
  "Brouillon",
  "Envoyée",
  "Payée",
  "Impayée",
  "Annulée",
];

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

export function FactureList({ factures, isLoading }: FactureListProps) {
  const data = factures && factures.length > 0 ? factures : fallbackFactures;

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
      (facture) =>
        facture.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (facture.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false),
    );
  }, [searchQuery, data]);

  const columns: ColumnDef<Invoice>[] = [
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
          aria-label={`Sélectionner ${row.original.numero}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "numero",
      header: "N° Facture",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium">
          {row.original.numero}
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
          Projet
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-sm">
            {row.original.titre || "Sans titre"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.statut;
        const iconMap: Record<string, React.ReactNode> = {
          Brouillon: <FileText className="size-3.5" />,
          Envoyée: <Send className="size-3.5" />,
          Payée: <CheckCircle className="size-3.5" />,
          Impayée: <XCircle className="size-3.5" />,
          Annulée: <Ban className="size-3.5" />,
        };
        return (
          <Badge
            className={cn(
              "gap-1.5 rounded-sm border font-medium",
              statusColors[status],
            )}
            variant="outline"
          >
            {iconMap[status]}
            {status}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "montant_total",
      header: "Montant",
      cell: ({ row }) => (
        <div className="font-medium tabular-nums text-sm">
          {row.original.montant_total
            ? new Intl.NumberFormat("fr-FR").format(row.original.montant_total)
            : "0"}
          <span className="text-muted-foreground text-xs"> FCFA</span>
        </div>
      ),
    },
    {
      accessorKey: "date_emission",
      header: "Émise le",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.date_emission
            ? new Date(row.original.date_emission).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "date_echeance",
      header: "Échéance",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.date_echeance
            ? new Date(row.original.date_echeance).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "priorite",
      header: "Priorité",
      cell: ({ row }) => (
        <div
          className={cn(
            "font-medium text-sm",
            priorityColors[row.original.priorite],
          )}
        >
          {row.original.priorite}
        </div>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const facture = row.original;
        const isDraft = facture.statut === "Brouillon";
        const isSent = facture.statut === "Envoyée";
        const isPaid = facture.statut === "Payée";

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
                Voir la facture
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="size-4" />
                Télécharger PDF
              </DropdownMenuItem>
              {isDraft && (
                <>
                  <DropdownMenuItem>
                    <Send className="size-4" />
                    Envoyer au client
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {isSent && !isPaid && (
                <DropdownMenuItem>
                  <CreditCard className="size-4" />
                  Marquer comme payée
                </DropdownMenuItem>
              )}
              {!isPaid && !isDraft && (
                <DropdownMenuItem>
                  <Plus className="size-4" />
                  Dupliquer
                </DropdownMenuItem>
              )}
              {isDraft && (
                <DropdownMenuItem variant="destructive">
                  <Trash2 className="size-4" />
                  Supprimer
                </DropdownMenuItem>
              )}
              {(isDraft || isSent) && (
                <DropdownMenuItem
                  variant="destructive"
                  className="text-destructive"
                >
                  <Ban className="size-4" />
                  Annuler la facture
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

  const statusFilter =
    (table.getColumn("statut")?.getFilterValue() as string[]) ?? [];
  const priorityFilter =
    (table.getColumn("priorite")?.getFilterValue() as string[]) ?? [];

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

  function togglePriorityFilter(value: string) {
    const current = priorityFilter;
    const newFilter = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    table
      .getColumn("priorite")
      ?.setFilterValue(newFilter.length ? newFilter : undefined);
    table.setPageIndex(0);
  }

  function clearFilters() {
    table.getColumn("statut")?.setFilterValue(undefined);
    table.getColumn("priorite")?.setFilterValue(undefined);
    setSearchQuery("");
    table.setPageIndex(0);
  }

  const isFiltered =
    statusFilter.length > 0 ||
    priorityFilter.length > 0 ||
    searchQuery.length > 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">Liste des factures</CardTitle>
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
        <CardTitle className="leading-none">Liste des factures</CardTitle>
        <CardDescription>
          Toutes les factures émises, envoyées, payées, impayées ou annulées
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
                  Statut
                  <ChevronDown className="ml-1 size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {statusOptions.map((status) => (
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Priorité
                  <ChevronDown className="ml-1 size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {["Haute", "Moyenne", "Basse"].map((priority) => (
                  <DropdownMenuCheckboxItem
                    key={priority}
                    checked={priorityFilter.includes(priority)}
                    onCheckedChange={() => togglePriorityFilter(priority)}
                  >
                    {priority}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isFiltered && (
              <Button variant="destructive" size="sm" onClick={clearFilters}>
                Effacer les filtres
              </Button>
            )}

            <Button
              size="sm"
              className="bg-zeno-primary hover:bg-zeno-primary/90"
            >
              <Plus className="size-4" />
              Nouvelle facture
            </Button>
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
                    Aucune facture trouvée.
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
