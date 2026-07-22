"use client";

import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Client } from "@/types/database";

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSave: (data: any) => void;
}

export function ClientDialog({
  open,
  onOpenChange,
  client,
  onSave,
}: ClientDialogProps) {
  const isEditing = !!client;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: client?.nom || "",
    email: client?.email || "",
    telephone: client?.telephone || "",
    adresse: client?.adresse || "",
    type: (client?.type as "B2B" | "B2C") || "B2B",
    secteur_activite: client?.secteur_activite || "",
    notes: client?.notes || "",
  });

  React.useEffect(() => {
    if (open && client) {
      setFormData({
        nom: client.nom,
        email: client.email,
        telephone: client.telephone || "",
        adresse: client.adresse || "",
        type: client.type as "B2B" | "B2C",
        secteur_activite: client.secteur_activite || "",
        notes: client.notes || "",
      });
    } else if (open && !client) {
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        adresse: "",
        type: "B2B",
        secteur_activite: "",
        notes: "",
      });
    }
  }, [open, client]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le client" : "Ajouter un client"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mettez à jour les informations du client"
              : "Créez un nouveau client ou contact commercial"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nom du client</label>
            <Input
              placeholder="Nom ou raison sociale"
              value={formData.nom}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nom: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="contact@client.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Téléphone</label>
            <Input
              placeholder="+237 6XX XXX XXX"
              value={formData.telephone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, telephone: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Adresse</label>
            <Input
              placeholder="Adresse complète"
              value={formData.adresse}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, adresse: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Type de client</label>
            <Select value={formData.type} onValueChange={(value) => 
              setFormData((prev) => ({ ...prev, type: value as "B2B" | "B2C" }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B2B">Entreprise (B2B)</SelectItem>
                <SelectItem value="B2C">Particulier (B2C)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Secteur d'activité</label>
            <Input
              placeholder="Ex: Technologie, Finance..."
              value={formData.secteur_activite}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  secteur_activite: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              placeholder="Notes supplémentaires..."
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-zeno-primary hover:bg-zeno-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Enregistrement..."
                : isEditing
                  ? "Mettre à jour"
                  : "Créer le client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
