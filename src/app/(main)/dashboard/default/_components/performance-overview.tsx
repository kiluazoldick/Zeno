"use client";

import { useState, useMemo } from "react";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PerformanceOverviewProps {
  data?: {
    monthly: Array<{
      mois: string;
      entrees: number;
      sorties: number;
      solde: number;
    }>;
  };
  isLoading: boolean;
}

type PeriodeType = "yearly" | "quarterly" | "monthly";

// Formater en FCFA
const formatFCFA = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Transformer les données du backend vers le format du graphique
const transformData = (
  monthlyData?: PerformanceOverviewProps["data"]["monthly"],
) => {
  if (!monthlyData || monthlyData.length === 0) {
    return [];
  }

  // Trier par date
  const sorted = [...monthlyData].sort(
    (a, b) => new Date(a.mois).getTime() - new Date(b.mois).getTime(),
  );

  return sorted.map((item) => {
    const date = new Date(item.mois);
    const month = date.toLocaleString("fr-FR", { month: "short" });
    return {
      date: date,
      month: month,
      mois: item.mois,
      revenue: item.entrees || 0,
      expenses: item.sorties || 0,
      profit: item.solde || 0,
    };
  });
};

// Filtrer les données par période
const filterDataByPeriod = (data: any[], periode: PeriodeType) => {
  if (!data || data.length === 0) return [];

  const now = new Date();
  let filtered = [...data];

  switch (periode) {
    case "monthly": {
      // Dernier mois
      const lastMonth = subMonths(now, 1);
      const start = startOfMonth(lastMonth);
      const end = endOfMonth(lastMonth);
      filtered = data.filter((item) =>
        isWithinInterval(item.date, { start, end }),
      );
      break;
    }
    case "quarterly": {
      // Dernier trimestre (3 mois)
      const threeMonthsAgo = subMonths(now, 3);
      filtered = data.filter(
        (item) => item.date >= threeMonthsAgo && item.date <= now,
      );
      break;
    }
    case "yearly":
    default: {
      // Dernière année (12 mois)
      const twelveMonthsAgo = subMonths(now, 12);
      filtered = data.filter(
        (item) => item.date >= twelveMonthsAgo && item.date <= now,
      );
      break;
    }
  }

  // Si le filtre ne retourne rien, retourner toutes les données
  if (filtered.length === 0) {
    return data.slice(-12); // Derniers 12 mois maximum
  }

  return filtered;
};

// Agréger les données par mois pour le trimestre
const aggregateByMonth = (data: any[]) => {
  if (!data || data.length === 0) return [];

  const grouped: Record<string, any> = {};

  data.forEach((item) => {
    const key = format(item.date, "MMM yyyy");
    if (!grouped[key]) {
      grouped[key] = {
        month: format(item.date, "MMM"),
        revenue: 0,
        expenses: 0,
        profit: 0,
      };
    }
    grouped[key].revenue += item.revenue;
    grouped[key].expenses += item.expenses;
    grouped[key].profit += item.profit;
  });

  return Object.values(grouped);
};

const chartConfig = {
  revenue: {
    label: "Chiffre d'affaires",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Dépenses",
    color: "var(--chart-2)",
  },
  profit: {
    label: "Bénéfice",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function PerformanceOverview({
  data,
  isLoading,
}: PerformanceOverviewProps) {
  const [periode, setPeriode] = useState<PeriodeType>("yearly");

  // Transformer les données brutes
  const rawData = useMemo(() => transformData(data?.monthly), [data]);

  // Filtrer et agréger selon la période sélectionnée
  const chartData = useMemo(() => {
    if (rawData.length === 0) return [];

    // Filtrer par période
    let filtered = filterDataByPeriod(rawData, periode);

    // Pour trimestriel, agréger par mois
    if (periode === "quarterly") {
      filtered = aggregateByMonth(filtered);
    }

    return filtered;
  }, [rawData, periode]);

  const hasData = chartData.length > 0;
  const periodeLabel =
    periode === "yearly"
      ? "Annuel"
      : periode === "quarterly"
        ? "Trimestriel"
        : "Mensuel";

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">Performance financière</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="leading-none">
              Performance financière
            </CardTitle>
            <CardDescription>
              <span className="@[540px]/card:block hidden">
                Évolution du chiffre d'affaires, dépenses et bénéfices •{" "}
                {periodeLabel}
              </span>
              <span className="@[540px]/card:hidden">
                Performance financière • {periodeLabel}
              </span>
            </CardDescription>
          </div>
          <CardAction>
            <Select
              value={periode}
              onValueChange={(value) => setPeriode(value as PeriodeType)}
            >
              <SelectTrigger size="sm" className="w-32">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="yearly">Annuel</SelectItem>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        {!hasData ? (
          <div className="flex h-80 flex-col items-center justify-center text-muted-foreground">
            <p className="text-lg">Aucune donnée financière disponible</p>
            <p className="text-sm">
              Les transactions seront affichées ici une fois enregistrées
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-80 w-full"
          >
            <ComposedChart data={chartData} margin={{ top: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.36}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.04}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeOpacity={0.5} />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="w-60"
                    indicator="line"
                    formatter={(value) => formatFCFA(Number(value))}
                  />
                }
              />
              <ChartLegend
                verticalAlign="top"
                content={<ChartLegendContent className="mb-5 justify-end" />}
              />

              <Area
                dataKey="revenue"
                type="monotone"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="expenses"
                type="monotone"
                stroke="var(--color-expenses)"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                dataKey="profit"
                type="monotone"
                stroke="var(--color-profit)"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
