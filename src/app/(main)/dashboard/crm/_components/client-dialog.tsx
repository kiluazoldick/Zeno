"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Schéma de validation
const clientSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().nullable(),
  telephone: z.string().optional().nullable(),
  adresse: z.string().optional().nullable(),
  secteur: z.string().optional().nullable(),
  ville: z.string().optional().nullable(),
  pays: z.string().default("Cameroun"),
  tax_id: z.string().optional().nullable(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: any;
  onSave: (data: any) => void;
  isEditing?: boolean;
}

export function ClientDialog({
  open,
  onOpenChange,
  client,
  onSave,
  isEditing,
}: ClientDialogProps) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nom: "",
      email: "",
      telephone: "",
      adresse: "",
      secteur: "",
      ville: "",
      pays: "Cameroun",
      tax_id: "",
    },
  });

  // Remplir le formulaire quand on modifie un client
  useEffect(() => {
    if (client) {
      reset({
        nom: client.nom || "",
        email: client.email || "",
        telephone: client.telephone || "",
        adresse: client.adresse || "",
        secteur: client.secteur || "",
        ville: client.ville || "",
        pays: client.pays || "Cameroun",
        tax_id: client.tax_id || "",
      });
    } else {
      reset({
        nom: "",
        email: "",
        telephone: "",
        adresse: "",
        secteur: "",
        ville: "",
        pays: "Cameroun",
        tax_id: "",
      });
    }
  }, [client, open, reset]);

  const onSubmit = async (data: ClientFormData) => {
    setLoading(true);
    try {
      // Nettoyer les données avant envoi (enlever les champs vides)
      const cleanData: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined && value !== "") {
          cleanData[key] = value;
        }
      }
      await onSave(cleanData);
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Erreur: " + (error.message || "Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le client" : "Ajouter un client"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom */}
          <Field>
            <FieldLabel>
              Nom <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="nom"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Nom du client" />
              )}
            />
            {errors.nom && (
              <p className="text-sm text-destructive">{errors.nom.message}</p>
            )}
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="client@exemple.com"
                  value={field.value || ""}
                />
              )}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </Field>

          {/* Téléphone */}
          <Field>
            <FieldLabel>Téléphone</FieldLabel>
            <Controller
              name="telephone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="+237 6XX XXX XXX"
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          {/* Secteur */}
          <Field>
            <FieldLabel>Secteur</FieldLabel>
            <Controller
              name="secteur"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Banque, Télécoms, etc."
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          {/* Ville */}
          <Field>
            <FieldLabel>Ville</FieldLabel>
            <Controller
              name="ville"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Douala, Yaoundé, etc."
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          {/* Pays */}
          <Field>
            <FieldLabel>Pays</FieldLabel>
            <Controller
              name="pays"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Cameroun"
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          {/* Adresse */}
          <Field>
            <FieldLabel>Adresse</FieldLabel>
            <Controller
              name="adresse"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Adresse complète..."
                  className="min-h-16 resize-none"
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          {/* Tax ID */}
          <Field>
            <FieldLabel>N° d'identification fiscale</FieldLabel>
            <Controller
              name="tax_id"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="RC-123456789"
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-zeno-primary hover:bg-zeno-primary/90"
            >
              {loading
                ? "Enregistrement..."
                : isEditing
                  ? "Modifier"
                  : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
