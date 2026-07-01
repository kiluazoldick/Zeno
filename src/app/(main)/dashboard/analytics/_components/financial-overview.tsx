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

const financialData = [
  { month: "Jan", income: 1800000, expense: 950000 },
  { month: "Fév", income: 2100000, expense: 1020000 },
  { month: "Mar", income: 1950000, expense: 890000 },
  { month: "Avr", income: 2500000, expense: 1150000 },
  { month: "Mai", income: 2300000, expense: 1080000 },
  { month: "Juin", income: 2800000, expense: 1250000 },
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
  income: {
    label: "Entrées",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Sorties",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function FinancialOverview() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Entrées vs Sorties</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-52 w-full">
          <BarChart
            accessibilityLayer
            data={financialData}
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
              dataKey="income"
              fill="var(--color-income)"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="expense"
              fill="var(--color-expense)"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
