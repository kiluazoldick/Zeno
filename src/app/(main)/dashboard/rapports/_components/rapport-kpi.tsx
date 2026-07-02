import { FileText, CheckCircle, Clock, Archive } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { rapportsData } from "./rapport-data";

export function RapportKpi() {
  const total = rapportsData.length;
  const valides = rapportsData.filter((r) => r.statut === "Validé").length;
  const enCours = rapportsData.filter((r) => r.statut === "En cours").length;
  const brouillons = rapportsData.filter(
    (r) => r.statut === "Brouillon",
  ).length;

  const kpiData = [
    {
      label: "Total rapports",
      value: total,
      icon: FileText,
      color: "text-zeno-primary",
      bg: "bg-zeno-primary/10",
    },
    {
      label: "Validés",
      value: valides,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "En cours",
      value: enCours,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Brouillons",
      value: brouillons,
      icon: Archive,
      color: "text-muted-foreground",
      bg: "bg-muted/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-2xl font-bold">{kpi.value}</span>
              <div className={cn("rounded-full p-2", kpi.bg)}>
                <Icon className={cn("size-5", kpi.color)} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
