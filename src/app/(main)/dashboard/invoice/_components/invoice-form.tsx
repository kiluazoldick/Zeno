import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInitials } from "@/lib/utils";
import { type InvoiceFormValues } from "@/lib/validations";
import { useProjects, useContrats } from "@/hooks/queries";
import { ClientSelector } from "./client-selector";
import { InvoiceDetails } from "./invoice-details";
import { InvoiceItems } from "./invoice-items";
import { Textarea } from "@/components/ui/textarea";


export function InvoiceForm({ isEditing, isPreview }: { isEditing?: boolean; isPreview?: boolean }) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border bg-card p-4">
      <Tabs defaultValue="invoice" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoice">
            Facture
          </TabsTrigger>

          <TabsTrigger value="payment">
            Paiement
          </TabsTrigger>

          <TabsTrigger value="business">
            Entreprise
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoice" className="mt-6">
          <div className="flex flex-col gap-6">
            <InvoiceDetails />

            <Separator />

            <ConditionsField />
          </div>
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <InvoiceItems />
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <div className="flex flex-col gap-6">
            <ClientSelector />

            <Separator />

            <ProjetSelector/>

            <Separator />

            <ContratSelector />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjetSelector() {
  const { control } = useFormContext<InvoiceFormValues>();

  const {
    data: projects = [],
    isLoading,
    error,
  } = useProjects();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">
          Sélectionnez le projet
        </h2>

        <Button type="button" variant="ghost" size="sm">
          <Plus data-icon="inline-start" />
          Ajouter un projet
        </Button>
      </div>

      <Controller
        control={control}
        name="projet_id"
        render={({ field }) => {
          const selectedProject = projects.find(
            (project) => project.id === field.value
          );

          return (
            <Field className="gap-1">
              <FieldLabel className="text-xs">
                Projet
              </FieldLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full data-[size=default]:h-auto">
                  <SelectValue placeholder="Sélectionner un projet">
                    {selectedProject && (
                      <div className="flex items-center gap-1.5">
                        <Avatar className="after:rounded-md">
                          <AvatarFallback className="rounded-md bg-card text-foreground">
                            {getInitials(
                              selectedProject.nom
                            ).slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="text-left text-xs">
                          <div>{selectedProject.nom}</div>

                          {selectedProject.description && (
                            <div className="text-muted-foreground">
                              {selectedProject.description}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent position="popper">
                  <SelectGroup>
                    {isLoading && (
                      <div className="p-2 text-sm text-muted-foreground">
                        Chargement des projets...
                      </div>
                    )}

                    {error && (
                      <div className="p-2 text-sm text-destructive">
                        Impossible de charger les projets
                      </div>
                    )}

                    {!isLoading &&
                      !error &&
                      projects.map((project) => (
                        <SelectItem
                          key={project.id}
                          value={project.id}
                        >
                          {project.nom}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          );
        }}
      />
    </section>
  );
}

function ContratSelector() {
  const { control } = useFormContext<InvoiceFormValues>();

  const {
    data: contrats = [],
    isLoading,
    error,
  } = useContrats();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">
          Sélectionnez le contrat
        </h2>

        <Button type="button" variant="ghost" size="sm">
          <Plus data-icon="inline-start" />
          Ajouter un contrat
        </Button>
      </div>

      <Controller
        control={control}
        name="contrat_id"
        render={({ field }) => {
          const selectedContrat = contrats.find(
            (contrat) => contrat.id === field.value
          );

          return (
            <Field className="gap-1">
              <FieldLabel className="text-xs">
                Contrat
              </FieldLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full data-[size=default]:h-auto">
                  <SelectValue placeholder="Sélectionner un contrat">
                    {selectedContrat && (
                      <div className="flex items-center gap-1.5">
                        <div className="text-left text-xs">
                          <div>
                            {selectedContrat.titre}
                          </div>
                        </div>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent position="popper">
                  <SelectGroup>
                    {isLoading && (
                      <div className="p-2 text-sm text-muted-foreground">
                        Chargement des contrats...
                      </div>
                    )}

                    {error && (
                      <div className="p-2 text-sm text-destructive">
                        Impossible de charger les contrats
                      </div>
                    )}

                    {!isLoading &&
                      !error &&
                      contrats.map((contrat) => (
                        <SelectItem
                          key={contrat.id}
                          value={contrat.id}
                        >
                          {contrat.titre}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          );
        }}
      />
    </section>
  );
} 

function ConditionsField() {
  const { control } = useFormContext<InvoiceFormValues>();

  return (
    <Controller
      control={control}
      name="conditions"
      render={({ field, fieldState }) => (
        <Field className="gap-2">
          <FieldLabel htmlFor="conditions">Conditions</FieldLabel>

          <Textarea
            id="conditions"
            placeholder="Ex : Paiement à effectuer dans un délai de 30 jours..."
            className="min-h-[120px] resize-none"
            {...field}
            value={field.value ?? ""} // ← obligatoire
          />

          {fieldState.error && (
            <p className="text-sm text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </Field>
      )}
    />
  );
}
