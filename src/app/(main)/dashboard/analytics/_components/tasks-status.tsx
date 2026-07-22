"use client";

import { Ellipsis } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

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

interface TasksStatusProps {
  data?: Array<{ statut: string; count: number }>;
  isLoading?: boolean;
}

// Données mockées de fallback
const fallbackData = [
  { status: "À faire", value: 8, color: "var(--chart-4)" },
  { status: "En cours", value: 12, color: "var(--chart-1)" },
  { status: "Bloqué", value: 3, color: "var(--chart-3)" },
  { status: "Terminé", value: 22, color: "var(--chart-2)" },
];

const statusColors: Record<string, string> = {
  "À faire": "var(--chart-4)",
  "En cours": "var(--chart-1)",
  Bloqué: "var(--chart-3)",
  Terminé: "var(--chart-2)",
  Annulé: "var(--chart-5)",
};

const chartConfig = {
  value: {
    label: "Tâches",
  },
} satisfies ChartConfig;

export function TasksStatus({ data, isLoading }: TasksStatusProps) {
  // Transformer les données ou utiliser le fallback
  const chartData =
    data && data.length > 0
      ? data.map((item) => ({
          status: item.statut,
          value: item.count,
          color: statusColors[item.statut] || "var(--chart-5)",
        }))
      : fallbackData;

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="font-normal">Tâches par statut</CardTitle>
          <CardAction>
            <Ellipsis className="size-4" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex h-52 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-zeno-primary border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Tâches par statut</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-52 w-full max-w-52"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="w-40" />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              strokeWidth={4}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          {chartData.map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm">{item.status}</span>
              <span className="text-sm font-medium ml-auto">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
