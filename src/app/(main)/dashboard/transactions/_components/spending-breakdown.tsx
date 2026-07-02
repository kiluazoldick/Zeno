"use client";

import { Cell, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const spendingData = [
  {
    category: "Chantiers",
    amount: 5_000_000,
    percentage: 33,
    fill: "var(--chart-1)",
  },
  {
    category: "Salaires",
    amount: 4_200_000,
    percentage: 28,
    fill: "var(--chart-2)",
  },
  {
    category: "Fournitures",
    amount: 2_500_000,
    percentage: 17,
    fill: "var(--chart-3)",
  },
  {
    category: "Transport",
    amount: 1_500_000,
    percentage: 10,
    fill: "var(--chart-4)",
  },
  {
    category: "Services",
    amount: 1_200_000,
    percentage: 8,
    fill: "var(--chart-5)",
  },
  {
    category: "Autres",
    amount: 600_000,
    percentage: 4,
    fill: "var(--chart-6)",
  },
];

const totalSpending = spendingData.reduce((sum, d) => sum + d.amount, 0);

const chartConfig = {
  amount: {
    label: "Dépenses",
  },
} satisfies ChartConfig;

export function SpendingBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Répartition des dépenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <ChartContainer
            config={chartConfig}
            className="aspect-square h-44 w-full max-w-44"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => {
                      const numValue = Number(value);
                      return `${numValue.toLocaleString("fr-FR")} FCFA`;
                    }}
                  />
                }
              />
              <Pie
                data={spendingData}
                dataKey="amount"
                nameKey="category"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                strokeWidth={3}
              >
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="grid w-full grid-cols-2 gap-2">
            {spendingData.map((item) => (
              <div key={item.category} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-xs truncate flex-1">{item.category}</span>
                <span className="text-xs font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>

          <div className="mt-2 rounded-md bg-muted px-3 py-1.5 text-center text-xs">
            Total:{" "}
            <span className="font-medium">
              {totalSpending.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
