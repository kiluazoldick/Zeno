import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

const kpiData = [
  {
    label: "Devis en attente",
    value: "5",
    change: "+2",
    trend: "up",
    previous: "3",
    description: "En attente de réponse",
  },
  {
    label: "Devis acceptés",
    value: "12",
    change: "+4",
    trend: "up",
    previous: "8",
    description: "Derniers 6 mois",
  },
  {
    label: "Montant total",
    value: "235 500 000",
    change: "+15.2%",
    trend: "up",
    previous: "204 500 000",
    description: "FCFA en devis actifs",
  },
  {
    label: "Taux de conversion",
    value: "68.5%",
    change: "-2.1%",
    trend: "down",
    previous: "70.6%",
    description: "Devis → Contrat",
  },
];

export function DevisKpi() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpiData.map((kpi) => (
        <Card key={kpi.label}>
          <CardHeader>
            <CardDescription>{kpi.label}</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">{kpi.value}</span>
              {kpi.label === "Montant total" && <span className="text-sm text-muted-foreground">FCFA</span>}
              <Badge
                variant="outline"
                className={
                  kpi.trend === "up"
                    ? "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
                    : "border-destructive/20 bg-destructive/10 text-destructive"
                }
              >
                {kpi.trend === "up" ? <TrendingUp /> : <TrendingDown />}
                {kpi.change}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">{kpi.previous}</span>{" "}
              <span className="text-muted-foreground">{kpi.description}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
