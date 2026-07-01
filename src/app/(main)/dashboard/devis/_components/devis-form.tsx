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
import { CalendarIcon, GripVertical, Hash, Plus, Trash2 } from "lucide-react";
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
  type DevisFormValues,
  type DevisLineItem,
  defaultDevisValues,
  devisClients,
  devisTaxOptions,
  getLineAmount,
} from "./devis-data";

interface DevisFormProps {
  onValuesChange?: (values: DevisFormValues) => void;
}

export function DevisForm({ onValuesChange }: DevisFormProps) {
  const form = useForm<DevisFormValues>({
    defaultValues: defaultDevisValues,
  });
  const values = useWatch({ control: form.control }) as DevisFormValues;

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
        <Tabs defaultValue="devis">
          <TabsList className="w-full">
            <TabsTrigger value="devis">Devis</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
          </TabsList>
        </Tabs>

        <DevisDetails />
        <Separator />
        <ClientSelector />
        <Separator />
        <DevisItems />
        <Separator />
        <DevisAdjustments />
        <Separator />
        <DevisNotes />
      </form>
    </FormProvider>
  );
}

// ============ SOUS-COMPOSANTS ============

function DevisDetails() {
  const { control, register } = useFormContext<DevisFormValues>();

  return (
    <section className="flex flex-col gap-3">
      <FieldGroup>
        <Field className="gap-1">
          <FieldLabel className="text-xs" htmlFor="numero">
            Numéro de devis
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
          <DatePickerField name="validiteDate" label="Date de validité" id="validite-date" />
        </div>
      </FieldGroup>
    </section>
  );
}

function DatePickerField({ name, label, id }: { name: "issuedDate" | "validiteDate"; label: string; id: string }) {
  const { control } = useFormContext<DevisFormValues>();
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
  const { control } = useFormContext<DevisFormValues>();

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
                  const nextClient = devisClients.find((item) => item.id === clientId);
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
                    {devisClients.map((client) => (
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

function DevisItems() {
  const { control, register } = useFormContext<DevisFormValues>();
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
        <h2 className="font-medium tracking-tight">Lignes du devis</h2>
        <Button type="button" variant="ghost" size="sm" onClick={handleAddItem}>
          <Plus className="size-4" />
          Ajouter une ligne
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
          id="devis-items"
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sortableItemIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <SortableDevisItemRow
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

function SortableDevisItemRow({
  id,
  index,
  item,
  register,
  onRemove,
}: {
  id: string;
  index: number;
  item?: DevisLineItem;
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
        aria-label={`Ligne ${index + 1} description`}
        {...register(`items.${index}.description` as const)}
      />
      <Input
        type="number"
        step="1"
        className="text-sm max-md:col-start-2 max-md:row-start-2"
        aria-label={`Ligne ${index + 1} quantité`}
        {...register(`items.${index}.quantity` as const, {
          valueAsNumber: true,
        })}
      />
      <Input
        type="number"
        step="0.01"
        className="text-sm max-md:col-start-3 max-md:row-start-2"
        aria-label={`Ligne ${index + 1} prix unitaire`}
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
        aria-label={`Supprimer la ligne ${index + 1}`}
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function DevisAdjustments() {
  const { control, register } = useFormContext<DevisFormValues>();
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
                    {devisTaxOptions.map((taxOption) => (
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

function DevisNotes() {
  const { register } = useFormContext<DevisFormValues>();

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-medium tracking-tight">Notes et conditions</h2>
      <div className="grid gap-4">
        <Field className="gap-1">
          <FieldLabel className="text-xs">Notes</FieldLabel>
          <Textarea
            className="min-h-20 resize-none text-sm"
            {...register("notes")}
            placeholder="Notes supplémentaires..."
          />
        </Field>
        <Field className="gap-1">
          <FieldLabel className="text-xs">Conditions</FieldLabel>
          <Textarea
            className="min-h-20 resize-none text-sm"
            {...register("conditions")}
            placeholder="Conditions générales..."
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
