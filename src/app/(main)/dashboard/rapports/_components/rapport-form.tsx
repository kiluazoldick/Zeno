"use client";

import * as React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Save, Send, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { cn } from "@/lib/utils";
import { createReport } from "@/lib/actions/reports"; // adaptez le chemin si besoin
import type { ReportInput } from "@/lib/validations/report.schema";
import { useProjects } from "@/hooks/queries"; // ou le bon chemin de votre hook
import { getReport } from "@/lib/actions/reports"; // adaptez le chemin si besoin
import { updateReport } from "@/lib/actions/reports"; // adaptez le chemin si besoin

const defaultValues: ReportInput = {
  titre: "",
  type: "Hebdomadaire",
  projet_id: null,
  task_id: null,
  auteur: null,
  periode: "",
  date_rapport: format(new Date(), "yyyy-MM-dd"),
  statut: "Brouillon",
  description: "",
  contenu: "",
  metriques: {
    tachesCompletees: 0,
    budgetUtilise: 0,
    budgetTotal: 0,
    progression: 0,
  },
  prochaines_etapes: [],
  problemes: [],
};

const types = ["Quotidien", "Hebdomadaire", "Mensuel", "Réunion"] as const;

export function RapportForm({ onSuccess, rapportId }: { onSuccess?: () => void; rapportId: string | null;}) {
  const form = useForm<ReportInput>({
    defaultValues,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingRapport, setIsLoadingRapport] = React.useState(false);

  // Champs locaux pour les textareas qui doivent devenir des tableaux
  const [prochainesEtapesText, setProchainesEtapesText] = React.useState("");
  const [problemesText, setProblemesText] = React.useState("");

  const isEditMode = Boolean(rapportId);

  React.useEffect(() => {
    if (!rapportId) {
      form.reset(defaultValues);
      setProchainesEtapesText("");
      setProblemesText("");
      return;
    }

    async function loadRapport() {
      try {
        setIsLoadingRapport(true);
        const data = await getReport(rapportId!) as any;

        form.reset({
          titre: data.titre ?? "",
          type: data.type ?? "Hebdomadaire",
          projet_id: data.projet_id ?? null,
          task_id: data.task_id ?? null,
          periode: data.periode ?? "",
          date_rapport: data.date_rapport
            ? format(new Date(data.date_rapport), "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd"),
          statut: data.statut ?? "Brouillon",
          description: data.description ?? "",
          contenu: data.contenu ?? "",
          metriques: data.metriques ?? {
            tachesCompletees: 0,
            budgetUtilise: 0,
            budgetTotal: 0,
            progression: 0,
          },
          prochaines_etapes: data.prochaines_etapes ?? [],
          problemes: data.problemes ?? [],
        });

        setProchainesEtapesText(
          (data.prochaines_etapes ?? []).join("\n"),
        );
        setProblemesText((data.problemes ?? []).join("\n"));
      } catch (error) {
        console.error("Erreur chargement rapport :", error);
      } finally {
        setIsLoadingRapport(false);
      }
    }

    loadRapport();
  }, [rapportId, form]);

  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  async function onSubmit(data: ReportInput) {
  try {
    setIsSubmitting(true);

    const payload: ReportInput = {
      ...data,
      prochaines_etapes: prochainesEtapesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      problemes: problemesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      metriques: {
        tachesCompletees: Number(data.metriques?.tachesCompletees) || 0,
        budgetUtilise: Number(data.metriques?.budgetUtilise) || undefined,
        budgetTotal: Number(data.metriques?.budgetTotal) || undefined,
        progression: Number(data.metriques?.progression) || undefined,
      },
    };

    let result;

    if (isEditMode && rapportId) {
      result = await updateReport(rapportId, payload);
    } else {
      result = await createReport(payload);
    }

    if (!result.success) {
      console.error("Erreur :", result.error);
      return;
    }

    console.log(isEditMode ? "✅ Rapport mis à jour" : "✅ Rapport créé", result.data);

    form.reset(defaultValues);
    setProchainesEtapesText("");
    setProblemesText("");
    onSuccess?.();
  } catch (error) {
    console.error("Erreur inattendue :", error);
  } finally {
    setIsSubmitting(false);
  }
}

  if (isLoadingRapport) {
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
              {isEditMode ? "Voir / Modifier le rapport" : "Nouveau rapport"}
            </h2>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => {
                  form.setValue("statut", "Brouillon");
                  form.handleSubmit(onSubmit)();
                }}
              >
                <Save className="size-4" />
                {isEditMode ? "Enregistrer" : "Sauvegarder"}
              </Button>
              <Button
                type="submit"
                className="bg-zeno-primary hover:bg-zeno-primary/90"
                disabled={isSubmitting}
                onClick={() => form.setValue("statut", "En cours")}
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
            {/* Titre + Type */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field className="gap-1">
                <FieldLabel className="text-xs">Titre du rapport</FieldLabel>
                <Input
                  {...form.register("titre")}
                  placeholder="Ex: Rapport chantier Banto - Semaine 25"
                />
              </Field>

              <Field className="gap-1">
                <FieldLabel className="text-xs">Type de rapport</FieldLabel>
                <Select
                  value={form.watch("type")}
                  onValueChange={(value) =>
                    form.setValue("type", value as ReportInput["type"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Projet + Période */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field className="gap-1">
                <FieldLabel className="text-xs">Projet lié</FieldLabel>
                <Select
                  value={form.watch("projet_id") ?? ""}
                  onValueChange={(value) =>
                    form.setValue("projet_id", value || null)
                  }
                  disabled={projectsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {projects.map((project: any) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.nom}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="gap-1">
                <FieldLabel className="text-xs">Période concernée</FieldLabel>
                <Input
                  {...form.register("periode")}
                  placeholder="Ex: 15-21 Juin 2026"
                />
              </Field>
            </div>

            {/* Date */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field className="gap-1">
                <FieldLabel className="text-xs">Date</FieldLabel>
                <Controller
                  control={form.control}
                  name="date_rapport"
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

            <Separator />

            {/* Description + Contenu */}
            <Field className="gap-1">
              <FieldLabel className="text-xs">Description</FieldLabel>
              <Textarea
                {...form.register("description")}
                placeholder="Brève description du rapport..."
                className="min-h-16 resize-none"
              />
            </Field>

            <Field className="gap-1">
              <FieldLabel className="text-xs">Contenu</FieldLabel>
              <Textarea
                {...form.register("contenu")}
                placeholder="Détail du rapport..."
                className="min-h-32 resize-none"
              />
            </Field>

            <Separator />

            {/* Métriques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Field className="gap-1">
                <FieldLabel className="text-xs">Tâches complétées</FieldLabel>
                <Input
                  type="number"
                  {...form.register("metriques.tachesCompletees", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Field className="gap-1">
                <FieldLabel className="text-xs">
                  Budget utilisé (FCFA)
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    {...form.register("metriques.budgetUtilise", {
                      valueAsNumber: true,
                    })}
                  />
                  <InputGroupAddon align="inline-end">FCFA</InputGroupAddon>
                </InputGroup>
              </Field>

              <Field className="gap-1">
                <FieldLabel className="text-xs">Budget total (FCFA)</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    {...form.register("metriques.budgetTotal", {
                      valueAsNumber: true,
                    })}
                  />
                  <InputGroupAddon align="inline-end">FCFA</InputGroupAddon>
                </InputGroup>
              </Field>

              <Field className="gap-1">
                <FieldLabel className="text-xs">Progression (%)</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  {...form.register("metriques.progression", {
                    valueAsNumber: true,
                  })}
                />
              </Field>
            </div>

            <Separator />

            {/* Prochaines étapes & Problèmes (text → array) */}
            <Field className="gap-1">
              <FieldLabel className="text-xs">
                Prochaines étapes (une par ligne)
              </FieldLabel>
              <Textarea
                value={prochainesEtapesText}
                onChange={(e) => setProchainesEtapesText(e.target.value)}
                placeholder={"Coulage du béton - Semaine 26\nInstallation des armatures"}
                className="min-h-20 resize-none"
              />
            </Field>

            <Field className="gap-1">
              <FieldLabel className="text-xs">
                Problèmes rencontrés (un par ligne)
              </FieldLabel>
              <Textarea
                value={problemesText}
                onChange={(e) => setProblemesText(e.target.value)}
                placeholder={"Retard de livraison des ciments\nManque de main d'œuvre"}
                className="min-h-20 resize-none"
              />
            </Field>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}