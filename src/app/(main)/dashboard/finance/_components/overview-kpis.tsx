import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const kpiData = [
  {
    label: "Chiffre d'affaires",
    value: "18 450 000",
    change: "+8.4%",
    trend: "up",
    period: "+1 428 000 FCFA",
    description: "vs mois dernier",
  },
  {
    label: "Dépenses totales",
    value: "12 234 000",
    change: "-3.2%",
    trend: "down",
    period: "-392 000 FCFA",
    description: "vs mois dernier",
  },
  {
    label: "Bénéfice net",
    value: "6 216 000",
    change: "+12.5%",
    trend: "up",
    period: "+691 000 FCFA",
    description: "vs mois dernier",
  },
  {
    label: "Budget restant",
    value: "4 280 000",
    change: "+5.2%",
    trend: "up",
    period: "Budget: 10 500 000",
    description: "sur budget total",
  },
];

export function OverviewKpis() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiData.map((kpi) => (
        <Card key={kpi.label} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">
                  {kpi.value}
                </span>
                <span className="text-xs text-muted-foreground">FCFA</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {kpi.period}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-medium",
                    kpi.trend === "up"
                      ? "border-green-200 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                      : "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
                  )}
                >
                  {kpi.change}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
