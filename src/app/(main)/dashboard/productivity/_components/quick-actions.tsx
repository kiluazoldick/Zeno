"use client";

import {
  CheckSquare,
  FileText,
  FolderKanban,
  Plus,
  Upload,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const quickActions = [
  { label: "Nouvelle note", icon: FileText, href: "/dashboard/rapports" },
  { label: "Nouvelle tâche", icon: CheckSquare, href: "/dashboard/kanban" },
  { label: "Nouveau projet", icon: FolderKanban, href: "/dashboard/projects" },
  { label: "Nouveau rapport", icon: Plus, href: "/dashboard/rapports" },
  { label: "Importer", icon: Upload, href: "#" },
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
            asChild
          >
            <Link href={action.href}>
              <action.icon data-icon="inline-start" />
              {action.label}
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}
