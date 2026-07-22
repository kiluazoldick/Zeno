"use client";

import * as React from "react";
import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
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
import type { Client } from "@/types/database";
import { ClientDialog } from "./client-dialog";
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks/queries/use-clients";

const FALLBACK_CLIENTS: Client[] = [
  {
    id: "cli-001",
    nom: "Zoldick Enterprises",
    email: "contact@zoldick.cm",
    telephone: "+237 6XX XXX XXX",
    adresse: "Douala, Cameroon",
    type: "B2B",
    secteur_activite: "Technology",
    notes: "Client principal",
    created_at: "",
    updated_at: "",
  },
];

interface ClientsListProps {
  clients?: Client[];
  isLoading?: boolean;
}

export function ClientsList({ clients, isLoading }: ClientsListProps) {
  const { data: queriedClients, isLoading: queryLoading } = useClients();
  const data = clients || queriedClients || FALLBACK_CLIENTS;

  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(
      (client) =>
        client.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, data]);

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${client.nom}" ?`)) {
      deleteClient.mutate({ id: client.id });
    }
  };

  const handleCreateClient = () => {
    setEditingClient(null);
    setDialogOpen(true);
  };

  const handleDialogSave = (formData: any) => {
    if (editingClient) {
      updateClient.mutate({ id: editingClient.id, data: formData });
    } else {
      createClient.mutate(formData);
    }
    setDialogOpen(false);
  };

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "nom",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          Nom du client
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{row.original.nom}</span>
          {row.original.adresse && (
            <span className="text-sm text-muted-foreground">
              {row.original.adresse}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <a
          href={`mailto:${row.original.email}`}
          className="text-zeno-primary hover:underline"
        >
          {row.original.email}
        </a>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant={row.original.type === "B2B" ? "default" : "secondary"}
        >
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "secteur_activite",
      header: "Secteur",
      cell: ({ row }) => row.original.secteur_activite || "-",
    },
    {
      accessorKey: "telephone",
      header: "Téléphone",
      cell: ({ row }) => row.original.telephone || "-",
    },
    {
      id: "actions",
      cell: ({ row }) => (
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
            <DropdownMenuItem onClick={() => handleEditClient(row.original)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClient(row.original)}
              className="text-destructive"
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Clients</CardTitle>
            <CardDescription>
              Gérez vos clients et contacts commerciaux
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="bg-zeno-primary hover:bg-zeno-primary/90"
            onClick={handleCreateClient}
          >
            <Plus className="size-4" />
            Nouveau client
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Rechercher par nom, email ou ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination({ pageIndex: 0, pageSize: 10 });
              }}
            />
          </InputGroup>

          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) =>
              setPagination((prev) => ({
                ...prev,
                pageSize: parseInt(value),
              }))
            }
          >
            <SelectTrigger className="w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 lignes</SelectItem>
              <SelectItem value="10">10 lignes</SelectItem>
              <SelectItem value="20">20 lignes</SelectItem>
              <SelectItem value="50">50 lignes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
                  <TableCell colSpan={columns.length} className="text-center">
                    Aucun client trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} sur {totalPages}
            </span>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => table.previousPage()}
                    className={cn(
                      !table.getCanPreviousPage() && "opacity-50 cursor-not-allowed",
                    )}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: i,
                        }))
                      }
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => table.nextPage()}
                    className={cn(
                      !table.getCanNextPage() && "opacity-50 cursor-not-allowed",
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          0 sélectionné(s)
        </div>
      </CardContent>

      {/* Dialogue de création/édition */}
      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={editingClient}
        onSave={handleDialogSave}
      />
    </Card>
  );
}
