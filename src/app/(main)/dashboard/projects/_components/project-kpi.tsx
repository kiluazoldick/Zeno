import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

const kpiData = [
  {
    label: "Projets actifs",
    value: "6",
    change: "+2",
    trend: "up",
    previous: "4",
    description: "Projets en cours",
  },
  {
    label: "Projets terminés",
    value: "12",
    change: "+3",
    trend: "up",
    previous: "9",
    description: "Derniers 6 mois",
  },
  {
    label: "Budget total",
    value: "612 000 000",
    change: "+8.5%",
    trend: "up",
    previous: "564 000 000",
    description: "FCFA engagés",
  },
  {
    label: "Délai moyen",
    value: "4.2",
    change: "-0.8",
    trend: "down",
    previous: "5.0",
    description: "mois par projet",
  },
];

export function ProjectKpi() {
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
              {kpi.label === "Budget total" && <span className="text-sm text-muted-foreground">FCFA</span>}
              {kpi.label === "Délai moyen" && <span className="text-sm text-muted-foreground">mois</span>}
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
