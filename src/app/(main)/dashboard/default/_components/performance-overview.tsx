"use client";

import { addHours, endOfToday, format, parseISO, subHours } from "date-fns";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

// Données mockées pour Zeno - Chiffre d'affaires en FCFA
const chartValues = [
  { revenue: 1250000, expenses: 850000, tasks: 45 },
  { revenue: 1800000, expenses: 920000, tasks: 52 },
  { revenue: 1500000, expenses: 780000, tasks: 38 },
  { revenue: 2200000, expenses: 1050000, tasks: 61 },
  { revenue: 1950000, expenses: 980000, tasks: 48 },
  { revenue: 1650000, expenses: 890000, tasks: 43 },
  { revenue: 2400000, expenses: 1150000, tasks: 67 },
  { revenue: 2100000, expenses: 1020000, tasks: 55 },
  { revenue: 1850000, expenses: 950000, tasks: 49 },
  { revenue: 2600000, expenses: 1250000, tasks: 72 },
  { revenue: 2300000, expenses: 1180000, tasks: 58 },
  { revenue: 2800000, expenses: 1320000, tasks: 79 },
  { revenue: 2500000, expenses: 1220000, tasks: 63 },
  { revenue: 3000000, expenses: 1450000, tasks: 85 },
  { revenue: 2700000, expenses: 1280000, tasks: 71 },
  { revenue: 3200000, expenses: 1550000, tasks: 92 },
  { revenue: 2900000, expenses: 1380000, tasks: 76 },
  { revenue: 3500000, expenses: 1680000, tasks: 98 },
  { revenue: 3100000, expenses: 1480000, tasks: 82 },
  { revenue: 3800000, expenses: 1750000, tasks: 105 },
  { revenue: 3400000, expenses: 1580000, tasks: 88 },
  { revenue: 4000000, expenses: 1850000, tasks: 112 },
  { revenue: 3600000, expenses: 1650000, tasks: 95 },
  { revenue: 4200000, expenses: 1920000, tasks: 118 },
];

const endDate = endOfToday();
const startDate = subHours(endDate, (chartValues.length - 1) * 12);

const chartData = chartValues.map((point, index) => ({
  date: format(addHours(startDate, index * 12), "yyyy-MM-dd"),
  ...point,
}));

// Formater en FCFA
const formatFCFA = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const chartConfig = {
  revenue: {
    label: "Chiffre d'affaires",
    color: "#02B3C4", // Couleur Zeno primaire
  },
  expenses: {
    label: "Dépenses",
    color: "#1D3F92", // Couleur Zeno secondaire
  },
  tasks: {
    label: "Tâches complétées",
    color: "#FFD50F", // Couleur Zeno accent
  },
} satisfies ChartConfig;

export function PerformanceOverview() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="leading-none">Performance financière</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Évolution du chiffre d'affaires, dépenses et productivité</span>
          <span className="@[540px]/card:hidden">Performance sur 3 mois</span>
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <Select defaultValue="quarter">
            <SelectTrigger size="sm" className="w-28">
              <SelectValue placeholder="3 mois" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Période</SelectLabel>
                <SelectItem value="quarter">3 mois</SelectItem>
                <SelectItem value="month">1 mois</SelectItem>
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
        <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
          <ComposedChart data={chartData} margin={{ top: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#02B3C4" stopOpacity={0.36} />
                <stop offset="95%" stopColor="#02B3C4" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.5} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={48}
              tickFormatter={(value) =>
                parseISO(value).toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-60"
                  indicator="line"
                  labelFormatter={(value) => format(parseISO(value), "d MMMM yyyy")}
                  valueFormatter={(value, name) => {
                    if (name === "revenue" || name === "expenses") {
                      return formatFCFA(Number(value));
                    }
                    return `${value} tâches`;
                  }}
                />
              }
            />
            <ChartLegend verticalAlign="top" content={<ChartLegendContent className="mb-5 justify-end" />} />

            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="#02B3C4"
              strokeWidth={2}
              dot={false}
              fillOpacity={1}
            />
            <Line dataKey="expenses" type="natural" stroke="#1D3F92" strokeWidth={2} dot={false} />
            <Line dataKey="tasks" type="natural" stroke="#FFD50F" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
