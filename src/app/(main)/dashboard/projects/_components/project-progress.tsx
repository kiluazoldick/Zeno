"use client";

import { Ellipsis } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const progressData = [
  { name: "Banto", progress: 68, color: "var(--chart-1)" },
  { name: "Hôtel Royal", progress: 45, color: "var(--chart-2)" },
  { name: "Hôpital Central", progress: 35, color: "var(--chart-3)" },
  { name: "Complexe Sportif", progress: 25, color: "var(--chart-4)" },
  { name: "Aéroport", progress: 15, color: "var(--chart-5)" },
];

const chartConfig = {
  progress: {
    label: "Avancement",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ProjectProgress() {
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
            data={progressData}
            margin={{
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" formatter={(value) => `${value}%`} />}
            />
            <Bar dataKey="progress" fill="var(--color-progress)" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
