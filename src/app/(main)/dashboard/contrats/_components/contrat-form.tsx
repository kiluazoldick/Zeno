"use client";

import * as React from "react";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { format, parseISO } from "date-fns";
import { CalendarIcon, FileText, GripVertical, Hash, Plus, Settings, Trash2, User } from "lucide-react";
import { Controller, FormProvider, useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatCurrency, getInitials } from "@/lib/utils";

import {
  type ContratFormValues,
  type ContratLineItem,
  contratClients,
  contratTaxOptions,
  defaultContratValues,
  getLineAmount,
} from "./contrat-data";

interface ContratFormProps {
  onValuesChange?: (values: ContratFormValues) => void;
}

export function ContratForm({ onValuesChange }: ContratFormProps) {
  const form = useForm<ContratFormValues>({
    defaultValues: defaultContratValues,
  });
  const values = useWatch({ control: form.control }) as ContratFormValues;

  React.useEffect(() => {
    onValuesChange?.(values);
  }, [values, onValuesChange]);

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-4 rounded-xl border bg-card p-4"
        noValidate
        onSubmit={(e) => e.preventDefault()}
      >
        <Tabs defaultValue="contrat">
          <TabsList className="w-full">
            <TabsTrigger value="contrat" className="gap-2">
              <FileText className="size-4" />
              Contrat
            </TabsTrigger>
            <TabsTrigger value="client" className="gap-2">
              <User className="size-4" />
              Client
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-2">
              <Settings className="size-4" />
              Détails
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ContratDetails />
        <Separator />
        <ClientSelector />
        <Separator />
        <ContratItems />
        <Separator />
        <ContratAdjustments />
        <Separator />
        <ContratClauses />
      </form>
    </FormProvider>
  );
}

// ============ SOUS-COMPOSANTS ============

function ContratDetails() {
  const { control, register } = useFormContext<ContratFormValues>();

  return (
    <section className="flex flex-col gap-3">
      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel className="text-xs" htmlFor="numero">
            Numéro de contrat
          </FieldLabel>
          <InputGroup>
            <InputGroupInput id="numero" {...register("numero")} />
            <InputGroupAddon align="inline-end">
              <Hash className="size-4" />
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <DatePickerField name="issuedDate" label="Date d'émission" id="issued-date" />
          <DatePickerField name="signatureDate" label="Date de signature" id="signature-date" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <DatePickerField name="dateDebut" label="Date de début" id="date-debut" />
          <DatePickerField name="dateFin" label="Date de fin" id="date-fin" />
        </div>
      </FieldGroup>
    </section>
  );
}

function DatePickerField({
  name,
  label,
  id,
}: {
  name: "issuedDate" | "signatureDate" | "dateDebut" | "dateFin";
  label: string;
  id: string;
}) {
  const { control } = useFormContext<ContratFormValues>();
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

function ClientSelector() {
  const { control } = useFormContext<ContratFormValues>();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">Client</h2>
        <Button type="button" variant="ghost" size="sm">
          <Plus className="size-4" />
          Nouveau client
        </Button>
      </div>

      <Controller
        control={control}
        name="to"
        render={({ field }) => {
          const selectedClient = field.value;
          return (
            <Field className="gap-1">
              <FieldLabel className="text-xs">Sélectionner un client</FieldLabel>
              <Select
                value={selectedClient?.id}
                onValueChange={(clientId) => {
                  const nextClient = contratClients.find((item) => item.id === clientId);
                  if (nextClient) field.onChange(nextClient);
                }}
              >
                <SelectTrigger className="w-full data-[size=default]:h-auto">
                  <SelectValue placeholder="Sélectionner un client">
                    {selectedClient && (
                      <div className="flex items-center gap-1.5">
                        <Avatar className="after:rounded-md">
                          <AvatarFallback className="rounded-md bg-card text-foreground">
                            {getInitials(selectedClient.name).slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left text-xs">
                          <div>{selectedClient.name}</div>
                          <div className="text-muted-foreground">{selectedClient.email}</div>
                        </div>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {contratClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
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

function ContratItems() {
  const { control, register } = useFormContext<ContratFormValues>();
  const { append, fields, move, remove } = useFieldArray({
    control,
    name: "items",
    keyName: "fieldKey",
  });
  const items = useWatch({ control, name: "items" }) ?? [];
  const sortableItemIds = fields.map((field) => field.id);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((field) => field.id === active.id);
    const newIndex = fields.findIndex((field) => field.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    move(oldIndex, newIndex);
  }

  function handleAddItem() {
    append({
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">Prestations du contrat</h2>
        <Button type="button" variant="ghost" size="sm" onClick={handleAddItem}>
          <Plus className="size-4" />
          Ajouter une prestation
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="hidden items-center gap-2 px-1 font-medium text-muted-foreground text-xs md:grid md:grid-cols-[24px_minmax(0,1fr)_64px_112px_112px_32px]">
          <span />
          <span>Description</span>
          <span className="px-2">Qté</span>
          <span className="px-2">Prix unitaire</span>
          <span className="text-right">Total</span>
          <span />
        </div>

        <DndContext
          id="contrat-items"
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortableItemIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <SortableContratItemRow
                  key={field.id}
                  id={field.id}
                  index={index}
                  item={items[index]}
                  register={register}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}

function SortableContratItemRow({
  id,
  index,
  item,
  register,
  onRemove,
}: {
  id: string;
  index: number;
  item?: ContratLineItem;
  register: any;
  onRemove: () => void;
}) {
  const { attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef, transform, transition } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
      className={cn(
        "grid min-w-0 grid-cols-[24px_minmax(0,0.8fr)_minmax(0,1fr)_32px] items-center gap-2 rounded-lg md:grid-cols-[24px_minmax(0,1fr)_64px_112px_112px_32px]",
        isDragging && "relative z-10 opacity-50",
      )}
    >
      <Button
        ref={setActivatorNodeRef}
        type="button"
        variant="ghost"
        size="icon-sm"
        className="-ml-2 cursor-grab text-muted-foreground active:cursor-grabbing"
        aria-label={`Réorganiser ${id}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </Button>
      <Input
        className="min-w-0 text-sm max-md:col-span-3"
        aria-label={`Prestation ${index + 1} description`}
        {...register(`items.${index}.description` as const)}
      />
      <Input
        type="number"
        step="1"
        className="text-sm max-md:col-start-2 max-md:row-start-2"
        aria-label={`Prestation ${index + 1} quantité`}
        {...register(`items.${index}.quantity` as const, {
          valueAsNumber: true,
        })}
      />
      <Input
        type="number"
        step="0.01"
        className="text-sm max-md:col-start-3 max-md:row-start-2"
        aria-label={`Prestation ${index + 1} prix unitaire`}
        {...register(`items.${index}.unitPrice` as const, {
          valueAsNumber: true,
        })}
      />
      <div className="min-w-0 text-right font-medium text-sm max-md:col-span-3 max-md:col-start-2 max-md:row-start-3 max-md:flex max-md:items-center max-md:justify-between max-md:text-left">
        <span className="hidden text-muted-foreground max-md:inline">Total</span>
        <span>
          {formatCurrency(getLineAmount(item), {
            currency: "XAF",
            noDecimals: true,
          })}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="max-md:col-start-4 max-md:row-start-2"
        aria-label={`Supprimer la prestation ${index + 1}`}
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function ContratAdjustments() {
  const { control, register } = useFormContext<ContratFormValues>();
  const discountType = useWatch({ control, name: "discountType" });

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium tracking-tight">Ajustements</h2>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <Controller
          control={control}
          name="taxId"
          render={({ field }) => (
            <Field className="gap-1">
              <FieldLabel className="text-xs">Taxe</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Sélectionner une taxe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {contratTaxOptions.map((taxOption) => (
                      <SelectItem key={taxOption.id} value={taxOption.id}>
                        {taxOption.name} ({taxOption.rate}%)
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <div className="grid grid-cols-[1fr_112px] gap-4">
          <Controller
            control={control}
            name="discountType"
            render={({ field }) => (
              <Field className="gap-1">
                <FieldLabel className="text-xs">Remise</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Type de remise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="fixed">Montant fixe</SelectItem>
                      <SelectItem value="percent">Pourcentage</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Field className="gap-1">
            <FieldLabel className="text-xs opacity-0">Valeur</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="number"
                step="0.01"
                aria-label="Valeur de la remise"
                {...register("discountValue", { valueAsNumber: true })}
              />
              <InputGroupAddon align="inline-end">{discountType === "fixed" ? "FCFA" : "%"}</InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
      </div>
    </section>
  );
}

function ContratClauses() {
  const { register } = useFormContext<ContratFormValues>();

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-medium tracking-tight">Clauses et conditions</h2>
      <div className="grid gap-4">
        <Field className="gap-1">
          <FieldLabel className="text-xs">Clauses particulières</FieldLabel>
          <Textarea
            className="min-h-20 resize-none text-sm"
            {...register("clauses")}
            placeholder="Clauses spécifiques du contrat..."
          />
        </Field>
        <Field className="gap-1">
          <FieldLabel className="text-xs">Conditions générales</FieldLabel>
          <Textarea
            className="min-h-20 resize-none text-sm"
            {...register("conditions")}
            placeholder="Conditions générales du contrat..."
          />
        </Field>
        <Field className="gap-1">
          <FieldLabel className="text-xs">Notes</FieldLabel>
          <Textarea
            className="min-h-20 resize-none text-sm"
            {...register("notes")}
            placeholder="Notes supplémentaires..."
          />
        </Field>
      </div>
    </section>
  );
}

// ============ UTILITAIRES ============
function parseDateValue(value: string) {
  if (!value) return undefined;
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}
