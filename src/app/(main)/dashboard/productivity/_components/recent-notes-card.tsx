"use client";

import Link from "next/link";

import { format, isToday, isYesterday, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { BookOpen, ClipboardList, FileText, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const today = new Date();

function formatNoteDate(date: Date) {
  if (isToday(date)) return "Aujourd'hui";
  if (isYesterday(date)) return "Hier";
  return format(date, "d MMM", { locale: fr });
}

// Notes récentes (à connecter à une vraie API plus tard)
const recentNotes = [
  {
    id: "1",
    title: "Compte rendu réunion chantier",
    date: formatNoteDate(today),
    icon: ClipboardList,
    href: "/dashboard/rapports/1",
  },
  {
    id: "2",
    title: `Rapport mensuel - ${format(today, "MMMM", { locale: fr })}`,
    date: formatNoteDate(subDays(today, 1)),
    icon: FileText,
    href: "/dashboard/rapports/2",
  },
  {
    id: "3",
    title: "Leçons apprises cette semaine",
    date: formatNoteDate(subDays(today, 4)),
    icon: BookOpen,
    href: "/dashboard/rapports/3",
  },
  {
    id: "4",
    title: "Annonce : nouveaux horaires",
    date: formatNoteDate(subDays(today, 5)),
    icon: Megaphone,
    href: "/dashboard/annonces/1",
  },
] as const;

export function RecentNotesCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Notes récentes</CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            asChild
          >
            <Link href="/dashboard/rapports">Voir tout</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {recentNotes.map((note) => (
          <Link
            key={note.id}
            href={note.href}
            className="flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
          >
            <note.icon className="size-5 text-zeno-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="truncate font-medium text-sm leading-none">
                {note.title}
              </div>
              <div className="text-muted-foreground text-xs mt-1">
                {note.date}
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
