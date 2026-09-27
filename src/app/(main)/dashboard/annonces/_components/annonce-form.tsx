"use client";

import * as React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Save, Send, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createAnnonce } from "@/lib/actions/annonces";
import { updateAnnonce } from "@/lib/actions/annonces/update-annonce";
import { getAnnonce } from "@/lib/actions/annonces/get-annonce";
import type { AnnonceInput } from "@/lib/validations/annonce.schema";

const importanceOptions = [
  { value: "Haute", label: "🔴 Haute", color: "text-destructive" },
  { value: "Normale", label: "🟡 Normale", color: "text-zeno-primary" },
  { value: "Basse", label: "🟢 Basse", color: "text-muted-foreground" },
];

const statusOptions = [
  { value: "Brouillon", label: "Brouillon" },
  { value: "Publiée", label: "Publier directement" },
];

const defaultValues: AnnonceInput = {
  titre: "",
  contenu: "",
  importance: "Normale",
  statut: "Brouillon",
  date_annonce: format(new Date(), "yyyy-MM-dd"),
  date_reunion: "",
  tags: [],
};

const suggestedTags = [
  "Réunion",
  "Chantier",
  "Report",
  "Horaires",
  "Équipe",
  "Finances",
  "Rapport",
  "Projet",
  "Administratif",
  "Planning",
];

export function AnnonceForm({
  annonceId,
  onSuccess,
}: {
  annonceId?: string | null;
  onSuccess?: () => void;
}) {
  const form = useForm<AnnonceInput>({
    defaultValues,
  });

  const [tagInput, setTagInput] = React.useState("");
  const tags = form.watch("tags") ?? [];
  const [isLoadingAnnonce, setIsLoadingAnnonce] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEditMode = Boolean(annonceId);

  // Charger l'annonce quand on est en mode édition
  React.useEffect(() => {
    if (!annonceId) {
      form.reset(defaultValues);
      setTagInput("");
      return;
    }

    async function loadAnnonce() {
      try {
        setIsLoadingAnnonce(true);
        const data = await getAnnonce(annonceId!) as unknown as AnnonceInput;

        form.reset({
          titre: data.titre ?? "",
          contenu: data.contenu ?? "",
          importance: data.importance ?? "Normale",
          statut: data.statut ?? "Brouillon",
          date_annonce: data.date_annonce
            ? format(new Date(data.date_annonce), "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd"),
          date_reunion: data.date_reunion
            ? format(new Date(data.date_reunion), "yyyy-MM-dd")
            : "",
          tags: data.tags ?? [],
        });
      } catch (error) {
        console.error("Erreur chargement annonce :", error);
      } finally {
        setIsLoadingAnnonce(false);
      }
    }

    loadAnnonce();
  }, [annonceId, form]);

  async function onSubmit(data: AnnonceInput) {
    try {
      setIsSubmitting(true);

      let result;

      if (isEditMode && annonceId) {
        result = await updateAnnonce(annonceId, data);
      } else {
        result = await createAnnonce(data);
      }

      if (!result.success) {
        console.error(result.error);
        return;
      }

      console.log(isEditMode ? "Annonce mise à jour :" : "Annonce créée :", result.data);

      form.reset(defaultValues);
      setTagInput("");
      onSuccess?.();
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function addTag(tag: string) {
    if (tag.trim() && !tags.includes(tag.trim())) {
      form.setValue("tags", [...tags, tag.trim()]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tag),
    );
  }

  if (isLoadingAnnonce) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium tracking-tight">
              {isEditMode ? "Modifier l'annonce" : "Nouvelle annonce"}
            </h2>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                <Save className="size-4" />
                Sauvegarder
              </Button>

              <Button
                type="submit"
                className="bg-zeno-primary hover:bg-zeno-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {isEditMode ? "Mettre à jour" : "Publier"}
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Titre + Importance */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field className="gap-1">
                <FieldLabel className="text-xs">Titre de l'annonce</FieldLabel>
                <Input
                  {...form.register("titre")}
                  placeholder="Ex: Réunion générale - Planning mensuel"
                />
              </Field>

              <Field className="gap-1">
                <FieldLabel className="text-xs">Importance</FieldLabel>
                <Select
                  value={form.watch("importance")}
                  onValueChange={(value) =>
                    form.setValue(
                      "importance",
                      value as AnnonceInput["importance"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'importance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {importanceOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <span className={opt.color}>{opt.label}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field className="gap-1">
                <FieldLabel className="text-xs">Date</FieldLabel>
                <Controller
                  control={form.control}
                  name="date_annonce"
                  render={({ field }) => {
                    const date = field.value
                      ? new Date(field.value)
                      : undefined;
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 size-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Choisir une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => {
                              if (selectedDate) {
                                field.onChange(
                                  format(selectedDate, "yyyy-MM-dd"),
                                );
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </Field>

              <Field className="gap-1">
                <FieldLabel className="text-xs">
                  Date de réunion (optionnel)
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="date_reunion"
                  render={({ field }) => {
                    const date = field.value
                      ? new Date(field.value)
                      : undefined;
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 size-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Choisir une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => {
                              if (selectedDate) {
                                field.onChange(
                                  format(selectedDate, "yyyy-MM-dd"),
                                );
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </Field>
            </div>

            {/* Statut */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field className="gap-1">
                <FieldLabel className="text-xs">Statut</FieldLabel>
                <Select
                  value={form.watch("statut")}
                  onValueChange={(value) =>
                    form.setValue("statut", value as AnnonceInput["statut"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Separator />

            {/* Contenu */}
            <Field className="gap-1">
              <FieldLabel className="text-xs">Contenu</FieldLabel>
              <Textarea
                {...form.register("contenu")}
                placeholder="Détail de l'annonce..."
                className="min-h-32 resize-none"
              />
            </Field>

            <Separator />

            {/* Tags */}
            <Field className="gap-1">
              <FieldLabel className="text-xs">Tags</FieldLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2 py-1 text-xs gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="Ajouter un tag..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addTag(tagInput)}
                >
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs text-muted-foreground mr-1">
                  Suggestions:
                </span>
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}