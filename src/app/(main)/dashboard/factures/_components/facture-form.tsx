"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface FactureFormProps {
  onSuccess?: () => void;
}

export function FactureForm({ onSuccess }: FactureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    client_id: "",
    montant: "",
    statut: "Brouillon",
    date_emission: new Date().toISOString().split("T")[0],
    date_echeance: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Implement API call
      console.log("Form submitted:", formData);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une facture</CardTitle>
        <CardDescription>
          Remplissez les informations ci-dessous pour créer une nouvelle facture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Numéro de facture</label>
              <Input
                placeholder="FAC-001"
                value={formData.numero}
                onChange={(e) =>
                  setFormData({ ...formData, numero: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Client</label>
              <Select
                value={formData.client_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, client_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">Client 1</SelectItem>
                  <SelectItem value="client2">Client 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Montant (FCFA)</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.montant}
                onChange={(e) =>
                  setFormData({ ...formData, montant: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={formData.statut}
                onValueChange={(value) =>
                  setFormData({ ...formData, statut: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brouillon">Brouillon</SelectItem>
                  <SelectItem value="Envoyée">Envoyée</SelectItem>
                  <SelectItem value="Payée">Payée</SelectItem>
                  <SelectItem value="En retard">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date d'émission</label>
              <Input
                type="date"
                value={formData.date_emission}
                onChange={(e) =>
                  setFormData({ ...formData, date_emission: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date d'échéance</label>
              <Input
                type="date"
                value={formData.date_echeance}
                onChange={(e) =>
                  setFormData({ ...formData, date_echeance: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Détails de la facture..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button">
              Annuler
            </Button>
            <Button
              className="bg-zeno-primary hover:bg-zeno-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Création..." : "Créer la facture"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
