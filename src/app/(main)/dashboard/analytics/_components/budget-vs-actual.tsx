"use client";

import { Ellipsis } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const budgetData = [
  { month: "Jan", budget: 1200000, actual: 1150000 },
  { month: "Fév", budget: 1300000, actual: 1280000 },
  { month: "Mar", budget: 1250000, actual: 1320000 },
  { month: "Avr", budget: 1400000, actual: 1350000 },
  { month: "Mai", budget: 1350000, actual: 1420000 },
  { month: "Juin", budget: 1500000, actual: 1480000 },
  { month: "Juil", budget: 1450000, actual: 1550000 },
  { month: "Août", budget: 1600000, actual: 1520000 },
  { month: "Sep", budget: 1550000, actual: 1580000 },
  { month: "Oct", budget: 1700000, actual: 1650000 },
  { month: "Nov", budget: 1650000, actual: 1720000 },
  { month: "Déc", budget: 1800000, actual: 1750000 },
];

const formatFCFA = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const chartConfig = {
  budget: {
    label: "Budget prévu",
    color: "var(--chart-1)",
  },
  actual: {
    label: "Dépenses réelles",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function BudgetVsActual() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">
          Budget vs Dépenses réelles
        </CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart
            accessibilityLayer
            data={budgetData}
            margin={{
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value / 1000000}M`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => formatFCFA(Number(value))}
                />
              }
            />
            <Bar
              dataKey="budget"
              fill="var(--color-budget)"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="actual"
              fill="var(--color-actual)"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
