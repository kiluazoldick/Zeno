"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import {
  addMinutes,
  differenceInCalendarDays,
  endOfToday,
  format,
  parseISO,
} from "date-fns";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  Clock3Icon,
  LoaderIcon,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import type { RecentCustomerRow } from "./schema";

// Icônes pour les statuts des projets
function statusIcon(status: string) {
  switch (status) {
    case "En cours":
      return <Clock className="size-4 text-zeno-primary" />;
    case "Terminé":
      return <CheckCircle2 className="size-4 text-green-500" />;
    case "En attente":
      return <AlertCircle className="size-4 text-zeno-accent" />;
    case "Annulé":
      return <XCircle className="size-4 text-destructive" />;
    default:
      return null;
  }
}

// Icônes pour le statut de paiement
function billingIcon(billing: string) {
  switch (billing) {
    case "Payé":
      return (
        <CircleCheckIcon className="fill-green-500 stroke-primary-foreground dark:fill-green-600" />
      );
    case "En attente":
      return <LoaderIcon className="text-zeno-accent" />;
    case "Non payé":
      return <CircleAlertIcon className="text-destructive" />;
    case "Partiel":
      return <Clock3Icon className="text-zeno-secondary" />;
    case "Annulé":
      return <XCircle className="text-muted-foreground" />;
    default:
      return null;
  }
}

// Fonction sécurisée pour formater la date
function formatDateSafely(dateValue: string) {
  if (!dateValue || dateValue === "-" || dateValue === "Non défini") {
    return { date: "-", time: "" };
  }

  try {
    const baseDate = parseISO(dateValue);
    if (isNaN(baseDate.getTime())) {
      return { date: "-", time: "" };
    }

    const joinedAt = addMinutes(
      baseDate,
      9 * 60 + Math.floor(Math.random() * 12) * 17,
    );
    return {
      date: format(joinedAt, "dd MMMM yyyy"),
      time: `à ${format(joinedAt, "HH:mm")}`,
    };
  } catch (e) {
    return { date: "-", time: "" };
  }
}

export const recentCustomersColumns: ColumnDef<RecentCustomerRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Sélectionner tous les projets"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Sélectionner ${row.original.name}`}
        />
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Projet / Client",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-md border bg-muted">
          <Building2 className="size-4 text-muted-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-end justify-between gap-3">
            <div className="grid min-w-0 gap-0.5">
              <span className="truncate font-medium text-sm leading-none">
                {row.original.name}
              </span>
              <span className="truncate text-muted-foreground text-xs leading-none">
                #{row.original.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    id: "search",
    accessorFn: (row) => `${row.id} ${row.name} ${row.email}`,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: "Statut",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2 py-1 gap-1">
        {statusIcon(row.original.status)}
        <span className="text-xs">{row.original.status}</span>
      </Badge>
    ),
  },
  {
    accessorKey: "billing",
    header: "Paiement",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2 py-1 gap-1">
        {billingIcon(row.original.billing)}
        <span className="text-xs">{row.original.billing}</span>
      </Badge>
    ),
  },
  {
    accessorKey: "plan",
    header: "Type de projet",
    cell: ({ row }) => {
      const planColors: Record<string, string> = {
        "Projet Premium": "border-zeno-primary text-zeno-primary",
        "Projet Standard": "border-zeno-secondary text-zeno-secondary",
        "Projet Public": "border-zeno-accent text-zeno-accent",
      };
      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs ${planColors[row.original.plan] || ""}`}
        >
          {row.original.plan}
        </Badge>
      );
    },
  },
  {
    id: "joinedWindow",
    accessorFn: (row) => {
      if (!row.joined || row.joined === "-") return [];
      try {
        const daysSinceJoined = differenceInCalendarDays(
          endOfToday(),
          parseISO(row.joined),
        );
        if (daysSinceJoined <= 30) return ["30", "90"];
        if (daysSinceJoined <= 90) return ["90"];
        return [];
      } catch (e) {
        return [];
      }
    },
    filterFn: "arrIncludes",
    enableHiding: true,
  },
  {
    accessorKey: "joined",
    header: "Date de début",
    cell: ({ row }) => {
      const { date, time } = formatDateSafely(row.original.joined);

      return (
        <div className="grid gap-0.5">
          <span className="text-sm">{date}</span>
          {time && (
            <span className="text-muted-foreground text-xs">{time}</span>
          )}
        </div>
      );
    },
  },
];
