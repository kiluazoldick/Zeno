import { Banknote, CheckSquare, Clock, FileText, FolderKanban, TrendingDown, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Données mockées pour les métriques Zeno
const metricsData = {
  revenue: {
    value: "15 234 500",
    currency: "FCFA",
    change: "+12.5%",
    trend: "up",
    description: "Chiffre d'affaires du mois",
    period: "vs mois dernier",
  },
  projects: {
    value: "8",
    change: "+2",
    trend: "up",
    description: "Projets en cours",
    period: "vs mois dernier",
  },
  tasks: {
    value: "23",
    change: "+5",
    trend: "up",
    description: "Tâches en cours",
    period: "vs semaine dernière",
  },
  quotes: {
    value: "5",
    change: "-1",
    trend: "down",
    description: "Devis en attente",
    period: "vs mois dernier",
  },
};

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Carte CA */}
      <Card className="border-l-4 border-zeno-primary">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-zeno-primary/10 text-zeno-primary">
              <Banknote className="size-4" />
            </div>
          </CardTitle>
          <Badge
            variant={metricsData.revenue.trend === "up" ? "default" : "destructive"}
            className="bg-zeno-primary/10 text-zeno-primary hover:bg-zeno-primary/20"
          >
            {metricsData.revenue.trend === "up" ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {metricsData.revenue.change}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
              <span className="font-medium text-2xl leading-none tracking-tight">{metricsData.revenue.value}</span>
              <span className="text-xs font-medium text-muted-foreground">{metricsData.revenue.currency}</span>
            </div>
            <p className="text-muted-foreground text-sm">{metricsData.revenue.description}</p>
            <p className="text-muted-foreground/60 text-xs">{metricsData.revenue.period}</p>
          </div>
        </CardContent>
      </Card>

      {/* Carte Projets */}
      <Card className="border-l-4 border-zeno-secondary">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-zeno-secondary/10 text-zeno-secondary">
              <FolderKanban className="size-4" />
            </div>
          </CardTitle>
          <Badge variant="default" className="bg-zeno-secondary/10 text-zeno-secondary hover:bg-zeno-secondary/20">
            <TrendingUp className="size-3" />
            {metricsData.projects.change}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <div className="font-medium text-2xl leading-none tracking-tight">{metricsData.projects.value}</div>
            <p className="text-muted-foreground text-sm">{metricsData.projects.description}</p>
            <p className="text-muted-foreground/60 text-xs">{metricsData.projects.period}</p>
          </div>
        </CardContent>
      </Card>

      {/* Carte Tâches */}
      <Card className="border-l-4 border-zeno-accent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-zeno-accent/10 text-zeno-accent">
              <CheckSquare className="size-4" />
            </div>
          </CardTitle>
          <Badge variant="default" className="bg-zeno-accent/10 text-zeno-accent hover:bg-zeno-accent/20">
            <TrendingUp className="size-3" />
            {metricsData.tasks.change}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <div className="font-medium text-2xl leading-none tracking-tight">{metricsData.tasks.value}</div>
            <p className="text-muted-foreground text-sm">{metricsData.tasks.description}</p>
            <p className="text-muted-foreground/60 text-xs">{metricsData.tasks.period}</p>
          </div>
        </CardContent>
      </Card>

      {/* Carte Devis */}
      <Card className="border-l-4 border-destructive">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <FileText className="size-4" />
            </div>
          </CardTitle>
          <Badge variant="destructive">
            <TrendingDown className="size-3" />
            {metricsData.quotes.change}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <div className="font-medium text-2xl leading-none tracking-tight">{metricsData.quotes.value}</div>
            <p className="text-muted-foreground text-sm">{metricsData.quotes.description}</p>
            <p className="text-muted-foreground/60 text-xs">{metricsData.quotes.period}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
