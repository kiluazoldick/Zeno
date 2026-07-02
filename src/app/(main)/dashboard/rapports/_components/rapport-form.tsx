"use client";

import * as React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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

type RapportFormValues = {
  titre: string;
  type: string;
  projet: string;
  periode: string;
  date: string;
  description: string;
  contenu: string;
  tachesCompletees: number;
  budgetUtilise: number;
  budgetTotal: number;
  progression: number;
  prochainesEtapes: string;
  problemes: string;
};

const defaultValues: RapportFormValues = {
  titre: "",
  type: "Hebdomadaire",
  projet: "",
  periode: "",
  date: format(new Date(), "yyyy-MM-dd"),
  description: "",
  contenu: "",
  tachesCompletees: 0,
  budgetUtilise: 0,
  budgetTotal: 0,
  progression: 0,
  prochainesEtapes: "",
  problemes: "",
};

const projets = [
  "Construction Immeuble Banto",
  "Rénovation Hôtel Royal",
  "Extension Hôpital Central",
  "Complexe Sportif",
  "Aéroport International",
];
const types = ["Quotidien", "Hebdomadaire", "Mensuel", "Réunion"];

export function RapportForm() {
  const form = useForm<RapportFormValues>({
    defaultValues,
  });

  function onSubmit(data: RapportFormValues) {
    console.log("Rapport créé:", data);
    // Ici, on ajoutera la logique de sauvegarde
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
              Nouveau rapport
            </h2>
            <div className="flex gap-2">
              <Button type="button" variant="outline">
                <Save className="size-4" />
                Sauvegarder
              </Button>
              <Button
                type="submit"
                className="bg-zeno-primary hover:bg-zeno-primary/90"
              >
                <Send className="size-4" />
                Publier
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Informations générales */}
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
                  onValueChange={(value) => form.setValue("type", value)}
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

            <div className="grid gap-4 md:grid-cols-2">
              <Field className="gap-1">
                <FieldLabel className="text-xs">Projet lié</FieldLabel>
                <Select
                  value={form.watch("projet")}
                  onValueChange={(value) => form.setValue("projet", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {projets.map((projet) => (
                        <SelectItem key={projet} value={projet}>
                          {projet}
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

            <div className="grid gap-4 md:grid-cols-2">
              <Field className="gap-1">
                <FieldLabel className="text-xs">Date</FieldLabel>
                <Controller
                  control={form.control}
                  name="date"
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
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </Field>
            </div>

            <Separator />

            {/* Description et contenu */}
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
                  {...form.register("tachesCompletees", {
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
                    {...form.register("budgetUtilise", { valueAsNumber: true })}
                  />
                  <InputGroupAddon align="inline-end">FCFA</InputGroupAddon>
                </InputGroup>
              </Field>

              <Field className="gap-1">
                <FieldLabel className="text-xs">Budget total (FCFA)</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    {...form.register("budgetTotal", { valueAsNumber: true })}
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
                  {...form.register("progression", { valueAsNumber: true })}
                />
              </Field>
            </div>

            <Separator />

            {/* Prochaines étapes et problèmes */}
            <Field className="gap-1">
              <FieldLabel className="text-xs">Prochaines étapes</FieldLabel>
              <Textarea
                {...form.register("prochainesEtapes")}
                placeholder="Liste des prochaines actions à entreprendre..."
                className="min-h-20 resize-none"
              />
            </Field>

            <Field className="gap-1">
              <FieldLabel className="text-xs">Problèmes rencontrés</FieldLabel>
              <Textarea
                {...form.register("problemes")}
                placeholder="Difficultés, retards, obstacles..."
                className="min-h-20 resize-none"
              />
            </Field>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
