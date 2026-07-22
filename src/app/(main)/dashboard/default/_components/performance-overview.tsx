"use client";

import { format } from "date-fns";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";
import { Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  SelectLabel,
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

// Formater en FCFA
const formatFCFA = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Données mockées en cas d'erreur ou de chargement
const mockData = [
  { month: "Jan", revenue: 1250000, expenses: 850000, profit: 400000 },
  { month: "Fév", revenue: 1800000, expenses: 920000, profit: 880000 },
  { month: "Mar", revenue: 1500000, expenses: 780000, profit: 720000 },
  { month: "Avr", revenue: 2200000, expenses: 1050000, profit: 1150000 },
  { month: "Mai", revenue: 1950000, expenses: 980000, profit: 970000 },
  { month: "Juin", revenue: 1650000, expenses: 890000, profit: 760000 },
  { month: "Juil", revenue: 2400000, expenses: 1150000, profit: 1250000 },
  { month: "Août", revenue: 2100000, expenses: 1020000, profit: 1080000 },
  { month: "Sep", revenue: 1850000, expenses: 950000, profit: 900000 },
  { month: "Oct", revenue: 2600000, expenses: 1250000, profit: 1350000 },
  { month: "Nov", revenue: 2300000, expenses: 1180000, profit: 1120000 },
  { month: "Déc", revenue: 2800000, expenses: 1320000, profit: 1480000 },
];

// Transformer les données du backend vers le format du graphique
const transformData = (monthlyData?: typeof mockData) => {
  if (!monthlyData || monthlyData.length === 0) return mockData;

  return monthlyData.map((item) => ({
    month: item.mois ? format(new Date(item.mois), "MMM") : "Jan",
    revenue: item.entrees || 0,
    expenses: item.sorties || 0,
    profit: item.solde || 0,
  }));
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
  const chartData = transformData(data?.monthly);

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
        <CardTitle className="leading-none">Performance financière</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Évolution du chiffre d'affaires, dépenses et bénéfices
          </span>
          <span className="@[540px]/card:hidden">Performance financière</span>
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <Select defaultValue="yearly">
            <SelectTrigger size="sm" className="w-28">
              <SelectValue placeholder="Annuel" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Période</SelectLabel>
                <SelectItem value="yearly">Annuel</SelectItem>
                <SelectItem value="quarterly">Trimestriel</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="border-zeno-primary/30 text-zeno-primary hover:bg-zeno-primary/10"
          >
            Voir le rapport
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
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
      </CardContent>
    </Card>
  );
}
