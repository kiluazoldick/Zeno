"use client";

import { Ellipsis, Loader2 } from "lucide-react";
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

interface ProjectProgressProps {
  data: Array<{
    nom: string;
    progression: number;
  }>;
  isLoading: boolean;
}

const chartConfig = {
  progression: {
    label: "Avancement",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ProjectProgress({ data, isLoading }: ProjectProgressProps) {
  // Si pas de données ou chargement, afficher un état vide
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="font-normal">Avancement des projets</CardTitle>
          <CardAction>
            <Ellipsis className="size-4" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Données mockées de fallback
  const fallbackData = [
    { nom: "Banto", progression: 68 },
    { nom: "Hôtel Royal", progression: 45 },
    { nom: "Hôpital Central", progression: 35 },
    { nom: "Complexe Sportif", progression: 25 },
    { nom: "Aéroport", progression: 15 },
  ];

  const chartData =
    data && data.length > 0
      ? data.slice(0, 8).map((item) => ({
          name:
            item.nom.length > 12 ? item.nom.substring(0, 12) + "..." : item.nom,
          progress: item.progression || 0,
        }))
      : fallbackData;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Avancement des projets</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => `${value}%`}
                />
              }
            />
            <Bar
              dataKey="progress"
              fill="var(--color-progression)"
              radius={[4, 4, 0, 0]}
              barSize={40}
              fillOpacity={0.8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
