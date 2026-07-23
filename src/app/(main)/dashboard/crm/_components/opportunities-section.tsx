"use client";
"use no memo";

import * as React from "react";
import { useMemo, useCallback } from "react";

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
import { MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";

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
import type { Client } from "@/types/database";
import { toast } from "sonner";

interface OpportunitiesSectionProps {
  clients: Client[];
  onEdit?: (client: Client) => void;
  onDelete?: (id: string) => void;
}

export function OpportunitiesSection({
  clients,
  onEdit,
  onDelete,
}: OpportunitiesSectionProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filtrer les clients par recherche (memoized)
  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.nom.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.ville?.toLowerCase().includes(query),
    );
  }, [clients, searchQuery]);

  // Transformer les clients en données de tableau (memoized)
  const tableData = useMemo(() => {
    return filteredClients.map((client) => ({
      id: client.id,
      nom: client.nom,
      email: client.email || "-",
      telephone: client.telephone || "-",
      ville: client.ville || "-",
      secteur: client.secteur || "-",
      projets: client.projects?.length || 0,
      client: client,
    }));
  }, [filteredClients]);

  // Colonnes du tableau (memoized)
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "nom",
        header: "Client",
        accessorKey: "nom",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.nom}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.email}
            </div>
          </div>
        ),
      },
      {
        id: "telephone",
        header: "Téléphone",
        accessorKey: "telephone",
      },
      {
        id: "ville",
        header: "Ville",
        accessorKey: "ville",
      },
      {
        id: "secteur",
        header: "Secteur",
        accessorKey: "secteur",
      },
      {
        id: "projets",
        header: "Projets",
        accessorKey: "projets",
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.projets} projet{row.original.projets > 1 ? "s" : ""}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const client = row.original.client;
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(client)}>
                    <Pencil className="size-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      toast.custom((t) => (
                        <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-lg border max-w-sm">
                          <p className="font-medium">
                            Confirmer la suppression
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Êtes-vous sûr de vouloir supprimer le client{" "}
                            <span className="font-semibold">
                              "{client.nom}"
                            </span>{" "}
                            ?
                          </p>
                          <div className="flex gap-2 justify-end mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.dismiss(t)}
                            >
                              Annuler
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                toast.dismiss(t);
                                if (onDelete) onDelete(client.id);
                              }}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      ));
                    }}
                    variant="destructive"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        enableHiding: false,
      },
    ],
    [onEdit, onDelete],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = Math.min(
    table.getState().pagination.pageIndex + 1,
    pageCount,
  );

  const pageNumbers = useMemo(() => {
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
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">Liste des clients</CardTitle>
        <CardDescription>Gérez vos clients et leurs projets</CardDescription>
        <CardAction>
          <div className="flex flex-wrap items-center gap-2">
            <InputGroup className="h-7 w-44 md:w-52">
              <InputGroupInput
                className="h-7"
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon>
                <Search className="size-3.5" />
              </InputGroupAddon>
            </InputGroup>
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
            <TableBody>
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
                    Aucun client trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between gap-4 px-4 pb-1">
          <p className="text-muted-foreground text-sm">
            {table.getFilteredRowModel().rows.length} client
            {filteredClients.length > 1 ? "s" : ""}
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
