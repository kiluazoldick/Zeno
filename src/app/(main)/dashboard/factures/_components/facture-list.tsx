"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2, Eye, FileDown } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Facture } from "@/types/database";

interface FactureListProps {
  factures: Facture[];
  isLoading: boolean;
}

export function FactureList({ factures, isLoading }: FactureListProps) {
  const [selectedFactures, setSelectedFactures] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFactures(factures.map((f) => f.id));
    } else {
      setSelectedFactures([]);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Brouillon": "bg-gray-100 text-gray-800",
      "Envoyée": "bg-blue-100 text-blue-800",
      "Payée": "bg-green-100 text-green-800",
      "En retard": "bg-red-100 text-red-800",
      "Annulée": "bg-gray-200 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Factures</CardTitle>
        <CardDescription>
          Total: {factures.length} facture{factures.length > 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedFactures.length === factures.length && factures.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border border-input"
                  />
                </TableHead>
                <TableHead>N° Facture</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'émission</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">Aucune facture</p>
                  </TableCell>
                </TableRow>
              ) : (
                factures.map((facture) => (
                  <TableRow key={facture.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedFactures.includes(facture.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFactures([...selectedFactures, facture.id]);
                          } else {
                            setSelectedFactures(
                              selectedFactures.filter((id) => id !== facture.id)
                            );
                          }
                        }}
                        className="rounded border border-input"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{facture.numero}</TableCell>
                    <TableCell>{facture.client_id || "N/A"}</TableCell>
                    <TableCell>{facture.montant} FCFA</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(facture.statut)}>
                        {facture.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(facture.date_emission).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      {new Date(facture.date_echeance).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="size-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileDown className="size-4 mr-2" />
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="size-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
