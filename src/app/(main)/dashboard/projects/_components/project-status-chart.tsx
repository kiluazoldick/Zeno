"use client";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const statusData = [
  { status: "En cours", value: 6, fill: "var(--chart-1)" },
  { status: "En attente", value: 3, fill: "var(--chart-3)" },
  { status: "Terminé", value: 12, fill: "var(--chart-2)" },
  { status: "Annulé", value: 1, fill: "var(--chart-4)" },
];

const chartConfig = {
  value: {
    label: "Projets",
  },
  "En cours": {
    color: "var(--chart-1)",
    label: "En cours",
  },
  "En attente": {
    color: "var(--chart-3)",
    label: "En attente",
  },
  Terminé: {
    color: "var(--chart-2)",
    label: "Terminé",
  },
  Annulé: {
    color: "var(--chart-4)",
    label: "Annulé",
  },
} satisfies ChartConfig;

const totalProjects = statusData.reduce((sum, item) => sum + item.value, 0);

export function ProjectStatusChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Répartition par statut</CardTitle>
        <CardAction>
          <div className="flex items-center gap-1 text-sm">
            <span className="font-medium">Total: {totalProjects}</span>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-52 w-full max-w-52">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="w-40" />} />
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="status"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (!(viewBox && "cx" in viewBox && "cy" in viewBox)) {
                    return null;
                  }

                  return (
                    <text dominantBaseline="middle" textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                      <tspan className="fill-muted-foreground text-xs" x={viewBox.cx} y={(viewBox.cy ?? 0) - 8}>
                        Total
                      </tspan>
                      <tspan className="fill-foreground font-medium text-lg" x={viewBox.cx} y={(viewBox.cy ?? 0) + 14}>
                        {totalProjects}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="grid grid-cols-2 gap-2 w-full mt-4">
          {statusData.map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-sm">{item.status}</span>
              <span className="text-sm font-medium ml-auto">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
