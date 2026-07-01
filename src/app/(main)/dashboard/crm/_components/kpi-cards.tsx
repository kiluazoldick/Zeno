import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

// Données KPI Zoldick en FCFA
const kpiData = {
  pipelineValue: {
    value: "284 500 000",
    change: "+12%",
    trend: "up",
    previous: "254 200 000",
    label: "Valeur du pipeline",
  },
  qualifiedRate: {
    value: "28.4%",
    change: "-2.5%",
    trend: "down",
    previous: "30.9%",
    label: "Taux de qualification",
  },
  openOpportunities: {
    value: "42",
    change: "+7",
    trend: "up",
    previous: "35",
    label: "Opportunités en cours",
  },
  conversionRate: {
    value: "18.1%",
    change: "+1.6%",
    trend: "up",
    previous: "16.5%",
    label: "Taux de conversion",
  },
};

export function KpiCards() {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-3xl tracking-tight">Portefeuille clients</h2>
        <p className="text-muted-foreground text-sm">
          Suivez la qualité des leads, les opportunités ouvertes et les taux de conversion.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>{kpiData.pipelineValue.label}</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">{kpiData.pipelineValue.value}</span>
              <span className="text-sm text-muted-foreground">FCFA</span>
              <Badge
                variant="outline"
                className="border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
              >
                <TrendingUp />
                {kpiData.pipelineValue.change}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">{kpiData.pipelineValue.previous}</span>{" "}
              <span className="text-muted-foreground">FCFA le mois dernier</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{kpiData.qualifiedRate.label}</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">{kpiData.qualifiedRate.value}</span>
              <Badge variant="outline" className="border-destructive/20 bg-destructive/10 text-destructive">
                <TrendingDown />
                {kpiData.qualifiedRate.change}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">{kpiData.qualifiedRate.previous}</span>{" "}
              <span className="text-muted-foreground">le mois dernier</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{kpiData.openOpportunities.label}</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">{kpiData.openOpportunities.value}</span>
              <Badge
                variant="outline"
                className="border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
              >
                <TrendingUp />
                {kpiData.openOpportunities.change}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">{kpiData.openOpportunities.previous}</span>{" "}
              <span className="text-muted-foreground">le mois dernier</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{kpiData.conversionRate.label}</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">{kpiData.conversionRate.value}</span>
              <Badge
                variant="outline"
                className="border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
              >
                <TrendingUp />
                {kpiData.conversionRate.change}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">{kpiData.conversionRate.previous}</span>{" "}
              <span className="text-muted-foreground">le mois dernier</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
