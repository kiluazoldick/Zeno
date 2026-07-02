"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

// Données en FCFA
const cashFlowData = [
  { month: "Jan", income: 18_000_000, expenses: 12_500_000 },
  { month: "Fév", income: 22_000_000, expenses: 14_200_000 },
  { month: "Mar", income: 19_500_000, expenses: 11_800_000 },
  { month: "Avr", income: 25_000_000, expenses: 15_500_000 },
  { month: "Mai", income: 23_000_000, expenses: 14_800_000 },
  { month: "Juin", income: 28_000_000, expenses: 16_500_000 },
];

const totalIncome = cashFlowData.reduce((sum, d) => sum + d.income, 0);
const totalExpenses = cashFlowData.reduce((sum, d) => sum + d.expenses, 0);

const formatFCFA = (value: number) => {
  return formatCurrency(value, { currency: "XAF", noDecimals: true });
};

const chartConfig = {
  income: {
    label: "Entrées",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Sorties",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function CashFlowOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">Flux de trésorerie</CardTitle>
        <CardDescription>
          Entrées et sorties mensuelles avec impact net
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-muted-foreground text-xs">Entrées</p>
                <p className="font-medium text-lg tabular-nums text-green-600">
                  {formatFCFA(totalIncome)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Sorties</p>
                <p className="font-medium text-lg tabular-nums text-destructive">
                  {formatFCFA(totalExpenses)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1">
              <span className="text-xs text-muted-foreground">Net:</span>
              <span
                className={cn(
                  "font-medium text-sm",
                  totalIncome - totalExpenses >= 0
                    ? "text-green-600"
                    : "text-destructive",
                )}
              >
                {formatFCFA(totalIncome - totalExpenses)}
              </span>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="h-52 w-full">
            <BarChart
              accessibilityLayer
              data={cashFlowData}
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
                tickFormatter={(value) => `${value / 1_000_000}M`}
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
                barSize={28}
              />
              <Bar
                dataKey="expenses"
                fill="var(--color-expenses)"
                radius={[4, 4, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
