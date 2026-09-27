import { Plus } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInitials } from "@/lib/utils";
import { type InvoiceFormValues } from "@/lib/validations";
import { useClients } from "@/hooks/queries";

export function ClientSelector() {
  const { control } = useFormContext<InvoiceFormValues>();

  const {
    data: clients = [],
    isLoading,
    error,
  } = useClients();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">Sélectionnez le client</h2>
        <Button type="button" variant="ghost" size="sm">
          <Plus data-icon="inline-start" />
          Ajouter un client
        </Button>
      </div>

      <Controller
        control={control}
        name="to"
        render={({ field }) => {
          const selectedClient = field.value;

          return (
            <Field className="gap-1">
              <FieldLabel className="text-xs">Client</FieldLabel>

              <Select
                value={selectedClient?.id ?? ""}
                onValueChange={(clientId) => {
                  const nextClient = clients.find(
                    (client) => client.id === clientId,
                  );

                  if (nextClient) {
                    // On stocke l'objet complet pour l'UI / preview
                    field.onChange(nextClient);
                  }
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full data-[size=default]:h-auto">
                  <SelectValue placeholder="Sélectionner un client">
                    {selectedClient ? (
                      <div className="flex items-center gap-1.5">
                        <Avatar className="after:rounded-md">
                          <AvatarFallback className="rounded-md bg-card text-foreground">
                            {getInitials(selectedClient.nom || "").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="text-left text-xs">
                          <div>{selectedClient.nom}</div>
                          <div className="text-muted-foreground">
                            {selectedClient.email}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent position="popper">
                  <SelectGroup>
                    {isLoading && (
                      <div className="p-2 text-sm text-muted-foreground">
                        Chargement des clients...
                      </div>
                    )}

                    {error && (
                      <div className="p-2 text-sm text-destructive">
                        Impossible de charger les clients
                      </div>
                    )}

                    {!isLoading &&
                      !error &&
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nom}
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