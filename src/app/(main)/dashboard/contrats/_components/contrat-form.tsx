"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import {
  CalendarIcon,
  FileText,
  Plus,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/lib/utils";
import { type ContratInput } from "@/lib/validations";
import { useClients } from "@/hooks/queries/use-clients";
import { useDevis } from "@/hooks/queries/use-devis";
import { useProjects } from "@/hooks/queries/use-projects";
import { defaultContratValues } from "./contrat-data";

interface ClientOption {
  id: string;
  nom: string;
  email: string | null;
}

interface ProjectOption {
  id: string;
  nom: string;
}

interface DevisOption {
  id: string;
  numero: string;
  titre?: string;
  montant_total: number;
}

// ============================================================
// 4. COMPOSANT PRINCIPAL
// ============================================================

interface ContratFormProps {
  onValuesChange?: (values: ContratInput) => void;
  onSubmit?: (data: ContratInput) => void;
}

export function ContratForm() {
  const { control, setValue } = useFormContext<ContratInput>();
  const clientId = useWatch({ control, name: "client_id" });
  const projectId = useWatch({ control, name: "project_id" });
  const devisId = useWatch({ control, name: "devis_id" });

  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: projects, isLoading: projectsLoading } = useProjects(
    clientId
      ? {
        client_id: clientId,
        includeClient: false,
        includeTasks: false,
      }
      : undefined,
  );
  const { data: devisData, isLoading: devisLoading } = useDevis(
    clientId
      ? {
        client_id: clientId,
        projet_id: projectId ?? undefined,
        includeClient: false,
        includeProjet: false,
        includeContrat: false,
      }
      : undefined,
  );
  const devis = devisData as DevisOption[] | undefined;

  React.useEffect(() => {
    if (!clientId) {
      setValue("project_id", undefined, {
        shouldDirty: false,
        shouldValidate: false,
      });

      setValue("devis_id", undefined, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [clientId, setValue]);

  React.useEffect(() => {
    if (!projectId) {
      setValue("devis_id", undefined, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [projectId, setValue]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <Tabs defaultValue="contrat" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="contrat" className="gap-2">
            <FileText className="size-4" />
            Contrat
          </TabsTrigger>
          <TabsTrigger value="relation" className="gap-2">
            <User className="size-4" />
            Client & projet
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <Settings className="size-4" />
            Détails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contrat" className="space-y-4 pt-4">
          <PrestationsSection />
          <Separator />
          <StatutPrioriteSection />
        </TabsContent>

        <TabsContent value="relation" className="space-y-4 pt-4">
          <ClientProjectDevisSection
            clients={clients}
            clientsLoading={clientsLoading}
            projects={projects}
            projectsLoading={projectsLoading}
            devis={devis}
            devisLoading={devisLoading}
            clientId={clientId}
            projectId={projectId}
            devisId={devisId}
          />
          <Separator />
          <EntrepriseSection />
        </TabsContent>

        <TabsContent value="details" className="space-y-4 pt-4">
          <DatesSection />
          <Separator />
          <LivrablesSection />
          <Separator />
          <PaiementSection />
          <Separator />
          <MontantTotalField />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// 5. SOUS-COMPOSANTS
// ============================================================

// ---- 5.2 Entreprise ----
function EntrepriseSection() {
  const { register } = useFormContext<ContratInput>();
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-medium tracking-tight">Entreprise</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel className="text-xs">Nom</FieldLabel>
          <Input {...register("from.name")} placeholder="Nom" />
        </Field>
        <Field>
          <FieldLabel className="text-xs">Adresse</FieldLabel>
          <Input {...register("from.addressLines")} placeholder="Adresse" />
        </Field>
        <Field>
          <FieldLabel className="text-xs">Téléphone</FieldLabel>
          <Input {...register("from.phone")} placeholder="Téléphone" />
        </Field>
        <Field>
          <FieldLabel className="text-xs">Email</FieldLabel>
          <Input {...register("from.email")} type="email" placeholder="Email" />
        </Field>
      </div>
    </section>
  );
}

// ---- 5.3 Prestations (avec titre + items) ----
function PrestationsSection() {
  const { control, register } = useFormContext<ContratInput>();

  const {
    fields,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "prestations",
  });

  const addPrestation = () => {
    append({
      title: "",
      items: [""],
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium tracking-tight">
          Prestations
        </h2>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addPrestation}
        >
          <Plus className="size-4" />
          Ajouter une prestation
        </Button>
      </div>

      {fields.map((field, pIndex) => (
        <PrestationGroup
          key={field.id}
          pIndex={pIndex}
          onRemove={() => remove(pIndex)}
        />
      ))}
    </section>
  );
}

function PrestationGroup({
  pIndex,
  onRemove,
}: {
  pIndex: number;
  onRemove: () => void;
}) {
  const { control, register } =
    useFormContext<ContratInput>();

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    // React Hook Form excludes arrays of primitives from FieldArrayPath.
    name: `prestations.${pIndex}.items` as any,
  });

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Field className="flex-1">
          <FieldLabel className="text-xs">
            Titre
          </FieldLabel>

          <Input
            {...register(
              `prestations.${pIndex}.title`
            )}
            placeholder="Ex: Développement web"
          />
        </Field>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="mt-3 space-y-2">
        {fields.map((field, iIndex) => (
          <div
            key={field.id}
            className="flex items-center gap-2"
          >
            <Field className="flex-1">
              <FieldLabel className="text-xs">
                Élément {iIndex + 1}
              </FieldLabel>

              <Input
                {...register(
                  `prestations.${pIndex}.items.${iIndex}`
                )}
                placeholder="Description"
              />
            </Field>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(iIndex)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append("")}
        >
          <Plus className="size-4" />
          Ajouter un élément
        </Button>
      </div>
    </div>
  );
}

// ---- 5.4 Section client / projet / devis ----
function ClientProjectDevisSection({
  clients,
  clientsLoading,
  projects,
  projectsLoading,
  devis,
  devisLoading,
  clientId,
  projectId,
  devisId,
}: {
  clients?: ClientOption[];
  clientsLoading: boolean;
  projects?: ProjectOption[];
  projectsLoading: boolean;
  devis?: DevisOption[];
  devisLoading: boolean;
  clientId?: string | null;
  projectId?: string | null;
  devisId?: string | null;
}) {
  const { control, setValue: formSetValue } = useFormContext<ContratInput>();

  const selectedClient = clients?.find((client) => client.id === clientId);
  const selectedProject = projects?.find((project) => project.id === projectId);

  function setValue(
    name: keyof ContratInput,
    value: string | number | null | undefined,
    options: { shouldDirty: boolean; shouldValidate: boolean },
  ) {
    formSetValue(name, value as never, options);
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">Client, projet et devis</h2>
        <Button type="button" variant="ghost" size="sm">
          <Plus className="size-4" />
          Nouveau devis
        </Button>
      </div>

      <Controller
        control={control}
        name="client_id"
        render={({ field }) => (
          <Field className="gap-1">
            <FieldLabel className="text-xs">Client</FieldLabel>
            <Select
              value={field.value ?? ""}
              onValueChange={(val) => field.onChange(val || null)}
            >
              <SelectTrigger className="w-full data-[size=default]:h-auto">
                <SelectValue placeholder="Sélectionner un client">
                  {selectedClient ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="after:rounded-md">
                        <AvatarFallback className="rounded-md bg-card text-foreground">
                          {getInitials(selectedClient.nom).slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left text-xs">
                        <div>{selectedClient.nom}</div>
                        <div className="text-muted-foreground">{selectedClient.email}</div>
                      </div>
                    </div>
                  ) : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {clientsLoading ? (
                    <SelectItem value="loading" disabled>
                      Chargement...
                    </SelectItem>
                  ) : (
                    clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.nom}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name="project_id"
          render={({ field }) => (
            <Field className="gap-1">
              <FieldLabel className="text-xs">Projet</FieldLabel>
              <Select
                value={field.value ?? ""}
                onValueChange={(val) => field.onChange(val || null)}
                disabled={!clientId}
              >
                <SelectTrigger className="w-full data-[size=default]:h-auto">
                  <SelectValue placeholder={clientId ? "Sélectionner un projet" : "Choisir un client d’abord"} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {!clientId ? (
                      <SelectItem value="disabled" disabled>
                        Sélectionnez un client d’abord
                      </SelectItem>
                    ) : projectsLoading ? (
                      <SelectItem value="loading" disabled>
                        Chargement...
                      </SelectItem>
                    ) : projects?.length ? (
                      projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.nom}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        Aucun projet trouvé
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="devis_id"
          render={({ field }) => (
            <Field className="gap-1">
              <FieldLabel className="text-xs">
                Devis
              </FieldLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={(value) => {
                  const selectedDevis = devis?.find(
                    (quote) => quote.id === value
                  );

                  field.onChange(value || null);

                  setValue(
                    "montant_total",
                    selectedDevis?.montant_total ?? undefined,
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    }
                  );
                }}
                disabled={!clientId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      clientId
                        ? "Sélectionner un devis"
                        : "Choisir un client d’abord"
                    }
                  />
                </SelectTrigger>

                <SelectContent position="popper">
                  <SelectGroup>
                    {!clientId ? (
                      <SelectItem value="disabled" disabled>
                        Sélectionnez un client d’abord
                      </SelectItem>
                    ) : devisLoading ? (
                      <SelectItem value="loading" disabled>
                        Chargement...
                      </SelectItem>
                    ) : devis?.length ? (
                      devis.map((quote) => (
                        <SelectItem
                          key={quote.id}
                          value={quote.id}
                        >
                          {quote.numero}
                          {quote.titre
                            ? ` - ${quote.titre}`
                            : ""}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        Aucun devis trouvé
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </div>

      {selectedProject && (
        <div className="rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
          Projet sélectionné: <span className="text-foreground">{selectedProject.nom}</span>
        </div>
      )}
    </section>
  );
}

// ---- 5.5 Dates ----
function DatesSection() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-medium tracking-tight">Période du contrat</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <DatePickerField name="date_debut" label="Date de début" id="date-debut" />
        <DatePickerField name="date_fin" label="Date de fin" id="date-fin" />
      </div>
    </section>
  );
}

// ---- 5.6 Livrables ----
function LivrablesSection() {
  const { control, register } = useFormContext<ContratInput>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "livrables",
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium tracking-tight">Livrables</h2>
        <Button type="button" variant="ghost" size="sm" onClick={() => append({ name: "" })}>
          <Plus className="size-4" /> Ajouter un livrable
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-4">
          <Field className="flex-1">
            <FieldLabel className="text-xs">Nom</FieldLabel>
            <Input {...register(`livrables.${index}.name`)} placeholder="Nom" />
          </Field>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(index)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </section>
  );
}

// ---- 5.7 Modalités de paiement ----
function PaiementSection() {
  const { control, register } = useFormContext<ContratInput>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "paiements",
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium tracking-tight">Modalités de paiement</h2>
        <Button type="button" variant="ghost" size="sm" onClick={() => append({ label: "", percentage: 0 })}>
          <Plus className="size-4" /> Ajouter une modalité
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-4">
          <Field className="flex-1">
            <FieldLabel className="text-xs">Libellé</FieldLabel>
            <Input {...register(`paiements.${index}.label`)} placeholder="Ex: Acompte" />
          </Field>
          <Field className="w-32">
            <FieldLabel className="text-xs">Pourcentage</FieldLabel>
            <Input
              type="number"
              {...register(`paiements.${index}.percentage`, {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              min={1}
              max={100}
            />
          </Field>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(index)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <p className="text-muted-foreground text-xs">
        Le total des pourcentages doit être égal à 100 %.
      </p>
    </section>
  );
}

// ---- 5.8 Montant total ----
function MontantTotalField() {
  const { watch } =
    useFormContext<ContratInput>();

  const total = watch("montant_total");

  return (
    <Field>
      <FieldLabel className="text-xs">
        Montant total (FCFA)
      </FieldLabel>

      <Input
        value={
          total != null
            ? new Intl.NumberFormat("fr-FR").format(total)
            : ""
        }
        readOnly
        placeholder="Sélectionnez un devis"
        className="bg-muted font-semibold"
      />
    </Field>
  );
}

// ---- 5.9 Statut / Priorité ----
function StatutPrioriteSection() {
  const { register } = useFormContext<ContratInput>();
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-medium tracking-tight">Statut et priorité</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel className="text-xs">Statut</FieldLabel>
          <Select {...register("statut")}>
            <SelectTrigger className="w-full data-[size=default]:h-auto">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Signé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel className="text-xs">Priorité</FieldLabel>
          <Select {...register("priorite")}>
            <SelectTrigger className="w-full data-[size=default]:h-auto">
              <SelectValue placeholder="Sélectionner une priorité" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="low">Basse</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>
    </section>
  );
}


// ---- 5.10 DatePickerField (réutilisable) ----
type DateFieldName = "date_debut" | "date_fin";

function DatePickerField({
  name,
  label,
  id,
}: {
  name: DateFieldName;
  label: string;
  id: string;
}) {
  const { control } = useFormContext<ContratInput>();
  const [open, setOpen] = React.useState(false);

  return (
    <Field className="gap-1">
      <FieldLabel className="text-xs" htmlFor={id}>
        {label}
      </FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const date = parseDateValue(field.value);
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={id}
                  variant="outline"
                  data-empty={!date}
                  className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                  {date ? format(date, "PPP") : <span>Choisir une date</span>}
                  <CalendarIcon className="text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Calendar
                  className="w-full"
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (!selectedDate) return;
                    field.onChange(format(selectedDate, "yyyy-MM-dd"));
                    setOpen(false);
                  }}
                  defaultMonth={date}
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </Field>
  );
}

// ============================================================
// 6. UTILITAIRES
// ============================================================

function parseDateValue(value: string | null | undefined) {
  if (!value) return undefined;
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}