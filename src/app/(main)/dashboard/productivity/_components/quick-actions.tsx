import { CheckSquare, FileText, FolderKanban, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

const quickActions = [
  { label: "Nouvelle note", icon: FileText },
  { label: "Nouvelle tâche", icon: CheckSquare },
  { label: "Nouveau projet", icon: FolderKanban },
  { label: "Nouveau rapport", icon: Plus },
  { label: "Importer", icon: Upload },
] as const;

export function QuickActions() {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl tracking-tight">Actions rapides</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="justify-start hover:border-zeno-primary hover:text-zeno-primary"
          >
            <action.icon data-icon="inline-start" />
            {action.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
