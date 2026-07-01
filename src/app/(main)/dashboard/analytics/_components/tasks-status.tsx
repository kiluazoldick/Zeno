"use client";

import { Ellipsis } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const tasksData = [
  { status: "À faire", value: 8, color: "var(--chart-4)" },
  { status: "En cours", value: 12, color: "var(--chart-1)" },
  { status: "Bloqué", value: 3, color: "var(--chart-3)" },
  { status: "Terminé", value: 22, color: "var(--chart-2)" },
];

const chartConfig = {
  value: {
    label: "Tâches",
  },
} satisfies ChartConfig;

export function TasksStatus() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Tâches par statut</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-52 w-full max-w-52">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="w-40" />} />
            <Pie
              data={tasksData}
              dataKey="value"
              nameKey="status"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              strokeWidth={4}
            >
              {tasksData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          {tasksData.map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm">{item.status}</span>
              <span className="text-sm font-medium ml-auto">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
