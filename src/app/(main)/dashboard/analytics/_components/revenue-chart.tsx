"use client";

import { useState, useMemo } from "react";
import { subMonths, isWithinInterval } from "date-fns";
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

interface RevenueChartProps {
  data?: Array<{
    mois: string;
    entrees: number;
    sorties: number;
    solde: number;
  }>;
  isLoading?: boolean;
}

type PeriodeType = "yearly" | "quarterly" | "monthly";

const formatFCFA = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const transformData = (monthlyData?: RevenueChartProps["data"]) => {
  if (!monthlyData || monthlyData.length === 0) {
    return [];
  }

  const sorted = [...monthlyData].sort(
    (a, b) => new Date(a.mois).getTime() - new Date(b.mois).getTime(),
  );

  return sorted.map((item) => {
    const date = new Date(item.mois);
    return {
      date: date,
      month: date.toLocaleString("fr-FR", { month: "short" }),
      revenue: item.entrees || 0,
      expenses: item.sorties || 0,
      profit: item.solde || 0,
    };
  });
};

const filterDataByPeriod = (data: any[], periode: PeriodeType) => {
  if (!data || data.length === 0) return [];

  const now = new Date();
  let filtered = [...data];

  switch (periode) {
    case "monthly": {
      const lastMonth = subMonths(now, 1);
      filtered = data.filter(
        (item) => item.date >= lastMonth && item.date <= now,
      );
      break;
    }
    case "quarterly": {
      const threeMonthsAgo = subMonths(now, 3);
      filtered = data.filter(
        (item) => item.date >= threeMonthsAgo && item.date <= now,
      );
      break;
    }
    case "yearly":
    default: {
      const twelveMonthsAgo = subMonths(now, 12);
      filtered = data.filter(
        (item) => item.date >= twelveMonthsAgo && item.date <= now,
      );
      break;
    }
  }

  if (filtered.length === 0) {
    return data.slice(-12);
  }
  return filtered;
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

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const [periode, setPeriode] = useState<PeriodeType>("yearly");

  const rawData = useMemo(() => transformData(data), [data]);
  const chartData = useMemo(
    () => filterDataByPeriod(rawData, periode),
    [rawData, periode],
  );
  const hasData = chartData.length > 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement...</CardTitle>
        </CardHeader>
        <CardContent className="flex h-72 items-center justify-center">
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
              Évolution du chiffre d'affaires
            </CardTitle>
            <CardDescription>
              <span className="@[540px]/card:block hidden">
                Revenus, dépenses et bénéfices mensuels en FCFA
              </span>
              <span className="@[540px]/card:hidden">
                Performance mensuelle
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
          <div className="flex h-72 flex-col items-center justify-center text-muted-foreground">
            <p>Aucune donnée disponible</p>
            <p className="text-sm">Les transactions seront affichées ici</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-72 w-full"
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
