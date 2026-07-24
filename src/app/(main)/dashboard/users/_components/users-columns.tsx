// src/app/(main)/dashboard/users/_components/users-columns.tsx
"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";

import { statusMeta, type UserRow } from "./data";

function RoleCell({ role, team }: { role: string; team: string }) {
  const roleLabels: Record<string, string> = {
    direction: "Direction",
    finance: "Finance",
    commercial: "Commercial",
    terrain: "Terrain",
    bureau: "Bureau",
    admin: "Admin",
    membre: "Membre",
  };

  return (
    <div className="grid gap-0.5">
      <span className="whitespace-nowrap">{roleLabels[role] || role}</span>
      <span className="text-muted-foreground text-xs">{team}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: UserRow["status"] }) {
  const meta = statusMeta[status] || statusMeta["Actif"];

  return (
    <Badge
      className={cn("gap-1.5 border px-2 py-1 font-medium", meta.badgeClass)}
      variant="outline"
    >
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {status}
    </Badge>
  );
}

function getAvatarTone(name: string) {
  if (!name) {
    return "[&_[data-slot=avatar-fallback]]:bg-slate-100 [&_[data-slot=avatar-fallback]]:text-slate-700 after:border-slate-200 dark:[&_[data-slot=avatar-fallback]]:bg-slate-500/15 dark:[&_[data-slot=avatar-fallback]]:text-slate-300 dark:after:border-slate-500/20";
  }

  const tones = [
    "[&_[data-slot=avatar-fallback]]:bg-amber-100 [&_[data-slot=avatar-fallback]]:text-amber-700 after:border-amber-200 dark:[&_[data-slot=avatar-fallback]]:bg-amber-500/15 dark:[&_[data-slot=avatar-fallback]]:text-amber-300 dark:after:border-amber-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-orange-100 [&_[data-slot=avatar-fallback]]:text-orange-700 after:border-orange-200 dark:[&_[data-slot=avatar-fallback]]:bg-orange-500/15 dark:[&_[data-slot=avatar-fallback]]:text-orange-300 dark:after:border-orange-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-rose-100 [&_[data-slot=avatar-fallback]]:text-rose-700 after:border-rose-200 dark:[&_[data-slot=avatar-fallback]]:bg-rose-500/15 dark:[&_[data-slot=avatar-fallback]]:text-rose-300 dark:after:border-rose-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-pink-100 [&_[data-slot=avatar-fallback]]:text-pink-700 after:border-pink-200 dark:[&_[data-slot=avatar-fallback]]:bg-pink-500/15 dark:[&_[data-slot=avatar-fallback]]:text-pink-300 dark:after:border-pink-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-fuchsia-100 [&_[data-slot=avatar-fallback]]:text-fuchsia-700 after:border-fuchsia-200 dark:[&_[data-slot=avatar-fallback]]:bg-fuchsia-500/15 dark:[&_[data-slot=avatar-fallback]]:text-fuchsia-300 dark:after:border-fuchsia-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-purple-100 [&_[data-slot=avatar-fallback]]:text-purple-700 after:border-purple-200 dark:[&_[data-slot=avatar-fallback]]:bg-purple-500/15 dark:[&_[data-slot=avatar-fallback]]:text-purple-300 dark:after:border-purple-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-violet-100 [&_[data-slot=avatar-fallback]]:text-violet-700 after:border-violet-200 dark:[&_[data-slot=avatar-fallback]]:bg-violet-500/15 dark:[&_[data-slot=avatar-fallback]]:text-violet-300 dark:after:border-violet-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-indigo-100 [&_[data-slot=avatar-fallback]]:text-indigo-700 after:border-indigo-200 dark:[&_[data-slot=avatar-fallback]]:bg-indigo-500/15 dark:[&_[data-slot=avatar-fallback]]:text-indigo-300 dark:after:border-indigo-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-sky-100 [&_[data-slot=avatar-fallback]]:text-sky-700 after:border-sky-200 dark:[&_[data-slot=avatar-fallback]]:bg-sky-500/15 dark:[&_[data-slot=avatar-fallback]]:text-sky-300 dark:after:border-sky-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-emerald-100 [&_[data-slot=avatar-fallback]]:text-emerald-700 after:border-emerald-200 dark:[&_[data-slot=avatar-fallback]]:bg-emerald-500/15 dark:[&_[data-slot=avatar-fallback]]:text-emerald-300 dark:after:border-emerald-500/20",
  ];

  return tones[name.length % tones.length];
}

function AvatarCell({ name }: { name: string }) {
  const safeName = name || "Membre";

  return (
    <Avatar size="lg" className={cn("font-medium", getAvatarTone(safeName))}>
      <AvatarFallback>{getInitials(safeName)}</AvatarFallback>
      <AvatarBadge className="bg-emerald-600 text-emerald-950 [&>svg]:text-white">
        <CheckIcon />
      </AvatarBadge>
    </Avatar>
  );
}

// Icône Check simple
function CheckIcon() {
  return <span className="text-[8px] font-bold">✓</span>;
}

export const usersColumns: ColumnDef<UserRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label="Sélectionner tous les membres"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label={`Sélectionner ${row.original.name}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "search",
    accessorFn: (row) => `${row.name} ${row.email}`,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "Membre",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <AvatarCell name={row.original.name} />
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground text-sm">
            {row.original.name}
          </div>
          <div className="truncate text-muted-foreground text-sm">
            {row.original.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Rôle",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <RoleCell role={row.original.role} team={row.original.team} />
    ),
  },
  {
    accessorKey: "team",
    header: "Équipe",
    filterFn: "equalsString",
    cell: ({ row }) => <div className="text-sm">{row.original.team}</div>,
  },
  {
    accessorKey: "status",
    header: "Statut",
    filterFn: "equalsString",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "joinedDate",
    accessorKey: "joinedDate",
    header: "Date d'intégration",
    cell: ({ row }) => (
      <div className="text-foreground text-sm">{row.original.joinedDate}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={`Actions pour ${member.name}`}
                className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
                size="icon-sm"
                variant="ghost"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  const event = new CustomEvent("editMemberFromTable", {
                    detail: member,
                  });
                  document.dispatchEvent(event);
                }}
              >
                <Pencil className="size-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const event = new CustomEvent("deleteMemberFromTable", {
                    detail: member,
                  });
                  document.dispatchEvent(event);
                }}
                variant="destructive"
              >
                <Trash2 className="size-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
];
