// src/app/(main)/dashboard/devis/_components/devis-form.tsx
"use client";

import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClients } from "@/hooks/queries/use-clients";
import { useProjects } from "@/hooks/queries/use-projects";

const statuts = [
  { label: "Brouillon", value: "Brouillon" },
  { label: "Envoyé", value: "Envoyé" },
  { label: "Accepté", value: "Accepté" },
  { label: "Refusé", value: "Refusé" },
];

const priorites = [
  { label: "Haute", value: "Haute" },
  { label: "Moyenne", value: "Moyenne" },
  { label: "Basse", value: "Basse" },
];

export function DevisForm() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const {
    fields: contenuFields,
    append: appendContenu,
    remove: removeContenu,
  } = useFieldArray({
    control,
    name: "contenu",
  });

  const {
    fields: prestationsFields,
    append: appendPrestation,
    remove: removePrestation,
  } = useFieldArray({
    control,
    name: "prestations",
  });

  const {
    fields: planningFields,
    append: appendPlanning,
    remove: removePlanning,
  } = useFieldArray({
    control,
    name: "planning",
  });

  const contenu = watch("contenu");

  const calculateTotal = () => {
    const total =
      contenu?.reduce((sum: number, item: any) => {
        return sum + (item.quantite || 0) * (item.prix_unitaire || 0);
      }, 0) || 0;
    return total;
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="prestations">Prestations</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general" className="space-y-4 pt-4">
          <Field>
            <FieldLabel>Numéro</FieldLabel>
            <Controller
              name="numero"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled
                  placeholder="Auto-généré"
                  className="bg-muted/50"
                />
              )}
            />
            <p className="text-xs text-muted-foreground">
              Auto-généré lors de la création
            </p>
          </Field>

          <Field>
            <FieldLabel>
              Titre <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="titre"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ex: Développement application mobile"
                />
              )}
            />
            {errors.titre?.message && (
              <p className="text-sm text-destructive">{String(errors.titre.message)}</p>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Client</FieldLabel>
              <Controller
                name="client_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) => field.onChange(val || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {clientsLoading ? (
                          <SelectItem value="loading" disabled>
                            Chargement...
                          </SelectItem>
                        ) : (
                          clients?.map((client: any) => (
                            <SelectItem key={client.id} value={client.id} >
                              {client.nom}
                            </SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Projet</FieldLabel>
              <Controller
                name="projet_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) => field.onChange(val || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {projectsLoading ? (
                          <SelectItem value="loading" disabled>
                            Chargement...
                          </SelectItem>
                        ) : (
                          projects?.map((project: any) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.nom}
                            </SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Statut</FieldLabel>
              <Controller
                name="statut"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {statuts.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Priorité</FieldLabel>
              <Controller
                name="priorite"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {priorites.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Date d'émission</FieldLabel>
              <Controller
                name="date_emission"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="date" value={field.value || ""} />
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Date de validité</FieldLabel>
              <Controller
                name="date_validite"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="date" value={field.value || ""} />
                )}
              />
            </Field>
          </div>
        </TabsContent>

        {/* Onglet Détails */}
        <TabsContent value="details" className="space-y-4 pt-4">
          <Field>
            <FieldLabel>Contexte du projet</FieldLabel>
            <Controller
              name="contexte"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Présentation du projet..."
                  className="min-h-24 resize-none"
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Objectifs du projet</FieldLabel>
            <Controller
              name="objectifs"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Objectifs du projet..."
                  className="min-h-24 resize-none"
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Architecture & Technologies</FieldLabel>
            <Controller
              name="architecture"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Stack technique..."
                  className="min-h-24 resize-none"
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Modalités de paiement</FieldLabel>
            <Controller
              name="modalites_paiement"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Modalités de paiement..."
                  className="min-h-20 resize-none"
                  value={field.value || ""}
                />
              )}
            />
          </Field>
        </TabsContent>

        {/* Onglet Prestations */}
        <TabsContent value="prestations" className="space-y-4 pt-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Prestations</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendPrestation({ titre: "", description: "" })}
              >
                <Plus className="size-4 mr-1" /> Ajouter une prestation
              </Button>
            </div>

            {prestationsFields.map((field, index) => (
              <div
                key={field.id}
                className="p-3 border rounded-lg space-y-2 mb-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    Prestation {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => removePrestation(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <Controller
                  name={`prestations.${index}.titre`}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Titre de la prestation" />
                  )}
                />
                <Controller
                  name={`prestations.${index}.description`}
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Description..."
                      className="min-h-16 resize-none"
                      value={field.value || ""}
                    />
                  )}
                />
              </div>
            ))}
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Planning</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendPlanning({ semaine: "", taches: "" })}
              >
                <Plus className="size-4 mr-1" /> Ajouter une ligne
              </Button>
            </div>

            {planningFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 p-3 border rounded-lg mb-2"
              >
                <div className="col-span-3">
                  <Controller
                    name={`planning.${index}.semaine`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Semaine X" />
                    )}
                  />
                </div>
                <div className="col-span-8">
                  <Controller
                    name={`planning.${index}.taches`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Tâches..." />
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => removePlanning(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Financier */}
        <TabsContent value="financial" className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Lignes du devis</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendContenu({
                    description: "",
                    quantite: 1,
                    prix_unitaire: 0,
                  })
                }
              >
                <Plus className="size-4 mr-1" /> Ajouter une ligne
              </Button>
            </div>

            {contenuFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg"
              >
                <div className="col-span-5">
                  <Controller
                    name={`contenu.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Description" />
                    )}
                  />
                </div>
                <div className="col-span-3">
                  <Controller
                    name={`contenu.${index}.quantite`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Qté"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value || ""}
                      />
                    )}
                  />
                </div>
                <div className="col-span-3">
                  <Controller
                    name={`contenu.${index}.prix_unitaire`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Prix unit."
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value || ""}
                      />
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => removeContenu(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2 border-t">
              <div className="text-right">
                <span className="text-muted-foreground text-sm">Total : </span>
                <span className="font-bold text-lg">
                  {new Intl.NumberFormat("fr-FR").format(calculateTotal())} FCFA
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <Field>
            <FieldLabel>Conditions</FieldLabel>
            <Controller
              name="conditions"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Conditions générales..."
                  className="min-h-20 resize-none"
                  value={field.value || ""}
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Notes</FieldLabel>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Notes internes..."
                  className="min-h-20 resize-none"
                  value={field.value || ""}
                />
              )}
            />
          </Field>
        </TabsContent>
      </Tabs>
    </div>
  );
}
