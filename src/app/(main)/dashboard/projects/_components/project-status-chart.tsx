"use client";

import { Label, Pie, PieChart } from "recharts";

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
import type { Project } from "@/types/database";

interface ProjectStatusChartProps {
  projects: Project[];
}

const statusColors: Record<string, string> = {
  "En cours": "var(--chart-1)",
  "En attente": "var(--chart-3)",
  Terminé: "var(--chart-2)",
  Annulé: "var(--chart-4)",
};

export function ProjectStatusChart({ projects }: ProjectStatusChartProps) {
  // Compter les projets par statut
  const statusCount = projects.reduce(
    (acc, project) => {
      const statut = project.statut || "En attente";
      acc[statut] = (acc[statut] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const statusData = Object.entries(statusCount).map(([status, value]) => ({
    status,
    value,
    fill: statusColors[status] || "var(--chart-5)",
  }));

  // Données de fallback si aucune donnée
  const fallbackData = [
    { status: "En cours", value: 6, fill: "var(--chart-1)" },
    { status: "En attente", value: 3, fill: "var(--chart-3)" },
    { status: "Terminé", value: 12, fill: "var(--chart-2)" },
    { status: "Annulé", value: 1, fill: "var(--chart-4)" },
  ];

  const chartData = statusData.length > 0 ? statusData : fallbackData;
  const totalProjects = chartData.reduce((sum, item) => sum + item.value, 0);

  const chartConfig = {
    value: {
      label: "Projets",
    },
  } satisfies ChartConfig;

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
              <Label
                content={({ viewBox }) => {
                  if (!(viewBox && "cx" in viewBox && "cy" in viewBox)) {
                    return null;
                  }

                  return (
                    <text
                      dominantBaseline="middle"
                      textAnchor="middle"
                      x={viewBox.cx}
                      y={viewBox.cy}
                    >
                      <tspan
                        className="fill-muted-foreground text-xs"
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) - 8}
                      >
                        Total
                      </tspan>
                      <tspan
                        className="fill-foreground font-medium text-lg"
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 14}
                      >
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
          {chartData.map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.fill }}
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
