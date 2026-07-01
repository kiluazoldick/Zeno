import { ArrowDownRight, ArrowUpRight, Ellipsis } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const kpiData = [
  {
    id: "revenue",
    title: "Chiffre d'affaires",
    value: "18,5 M",
    unit: "FCFA",
    change: "+12.5%",
    trend: "up",
    previous: "16,4 M",
    period: "dernier mois",
  },
  {
    id: "projects",
    title: "Projets actifs",
    value: "12",
    unit: "",
    change: "+2",
    trend: "up",
    previous: "10",
    period: "dernier mois",
  },
  {
    id: "tasks",
    title: "Tâches en cours",
    value: "45",
    unit: "",
    change: "-3",
    trend: "down",
    previous: "48",
    period: "dernière semaine",
  },
  {
    id: "productivity",
    title: "Productivité",
    value: "78",
    unit: "%",
    change: "+4.2%",
    trend: "up",
    previous: "73.8%",
    period: "dernier mois",
  },
  {
    id: "conversion",
    title: "Taux de conversion",
    value: "65",
    unit: "%",
    change: "-5.6%",
    trend: "down",
    previous: "70.6%",
    period: "dernier trimestre",
  },
  {
    id: "budget",
    title: "Budget utilisé",
    value: "92",
    unit: "%",
    change: "+8.4%",
    trend: "up",
    previous: "83.6%",
    period: "dernier mois",
  },
];

export function StatsKpiStrip() {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
      <div className="grid divide-y *:data-[slot=card]:rounded-none *:data-[slot=card]:ring-0 md:grid-cols-3 md:divide-x md:divide-y-0 xl:grid-cols-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.id}>
            <CardHeader>
              <CardTitle className="font-normal text-sm">{kpi.title}</CardTitle>
              <CardAction>
                <Ellipsis className="size-4" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl leading-none tracking-tight">{kpi.value}</span>
                  {kpi.unit && <span className="text-sm text-muted-foreground">{kpi.unit}</span>}
                </div>
                <Badge
                  className={
                    kpi.trend === "up"
                      ? "bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                      : "bg-destructive/10 text-destructive"
                  }
                >
                  {kpi.trend === "up" ? <ArrowUpRight /> : <ArrowDownRight />}
                  {kpi.change}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <span>
                  depuis <span className="text-foreground">{kpi.previous}</span>
                </span>
                <span>•</span>
                <span>{kpi.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
