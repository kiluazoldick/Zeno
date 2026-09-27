import * as React from "react";

import { format, parseISO } from "date-fns";
import { CalendarIcon, Hash } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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

import type { InvoiceFormValues } from "@/lib/validations";

const dateFields: Array<{
  id: string;
  label: string;
  name: "date_emission" | "date_paiement" | "date_echeance";
}> = [
  {
    id: "issued-date",
    label: "Date d'émission",
    name: "date_emission",
  },
  {
    id: "payment-date",
    label: "Date de paiement",
    name: "date_paiement",
  },
  {
    id: "due-date",
    label: "Date d'échéance",
    name: "date_echeance",
  },
];

export function InvoiceDetails() {
  const { control } = useFormContext<InvoiceFormValues>();

  const invoice = useWatch({
    control,
  });

  return (
    <section className="flex flex-col gap-3">
      <FieldGroup>
        {/* Titre de la facture */}
        <Controller
          control={control}
          name="titre"
          render={({ field, fieldState }) => (
            <Field className="gap-1">
              <FieldLabel className="text-xs" htmlFor="invoice-title">
                Titre de la facture
              </FieldLabel>

              <InputGroup>
                <InputGroupInput
                  id="invoice-title"
                  placeholder="Ex : Développement de l'application mobile"
                  {...field}
                  value={field.value ?? ""}
                />
              </InputGroup>

              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </Field>
          )}
        />

        {/* Numéro généré automatiquement */}
        {/* <Field className="gap-1">
          <FieldLabel className="text-xs" htmlFor="reference-number">
            Numéro de référence
          </FieldLabel>

          <InputGroup>
            <InputGroupInput
              id="reference-number"
              value={invoice. || "Généré automatiquement"}
              readOnly
            />

            <InputGroupAddon align="inline-end">
              <Hash />
            </InputGroupAddon>
          </InputGroup>
        </Field> */}

        {/* Dates */}
        <div className="grid gap-5 md:grid-cols-3">
          {dateFields.map((dateField) => (
            <Controller
              key={dateField.name}
              control={control}
              name={dateField.name}
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel
                    className="text-xs"
                    htmlFor={dateField.id}
                  >
                    {dateField.label}
                  </FieldLabel>

                  <DatePicker
                    id={dateField.id}
                    value={field.value}
                    onChange={field.onChange}
                  />

                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />
          ))}
        </div>
      </FieldGroup>
    </section>
  );
}

function DatePicker({
  id,
  value,
  onChange,
}: {
  id: string;
  value?: string | null;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const date = parseDateValue(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          data-empty={!date}
          className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "PPP") : <span>Choisissez une date</span>}

          <CalendarIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Calendar
          className="w-full"
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (!selectedDate) return;

            onChange(format(selectedDate, "yyyy-MM-dd"));
            setOpen(false);
          }}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}

function parseDateValue(value?: string | null) {
  if (!value) return undefined;

  const date = parseISO(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
}
