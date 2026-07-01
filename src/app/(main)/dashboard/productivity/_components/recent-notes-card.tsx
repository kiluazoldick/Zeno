import { format, isToday, isYesterday, subDays } from "date-fns";
import { BookOpen, ClipboardList, FileText, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const today = new Date();

function formatNoteDate(date: Date) {
  if (isToday(date)) return "Aujourd'hui";
  if (isYesterday(date)) return "Hier";
  return format(date, "d MMM");
}

const recentNotes = [
  {
    title: "Compte rendu réunion chantier Banto",
    date: formatNoteDate(today),
    icon: ClipboardList,
  },
  {
    title: `Rapport mensuel - ${format(today, "MMMM")}`,
    date: formatNoteDate(subDays(today, 1)),
    icon: FileText,
  },
  {
    title: "Leçons apprises cette semaine",
    date: formatNoteDate(subDays(today, 4)),
    icon: BookOpen,
  },
  {
    title: "Annonce : nouveaux horaires",
    date: formatNoteDate(subDays(today, 5)),
    icon: Megaphone,
  },
] as const;

export function RecentNotesCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Notes récentes</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Voir tout
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {recentNotes.map((note) => (
          <div key={note.title} className="flex items-start gap-4">
            <note.icon className="size-5 text-zeno-primary" />
            <div className="min-w-0">
              <div className="truncate font-medium text-sm leading-none">{note.title}</div>
              <div className="text-muted-foreground text-xs">{note.date}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
