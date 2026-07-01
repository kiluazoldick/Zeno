"use client";

import { Ellipsis } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const productivityData = [
  { name: "Nanga D.", tasks: 12, productivity: 92 },
  { name: "Sarah M.", tasks: 10, productivity: 85 },
  { name: "Jean K.", tasks: 8, productivity: 78 },
  { name: "Marie L.", tasks: 7, productivity: 90 },
  { name: "Paul B.", tasks: 5, productivity: 65 },
  { name: "Claire R.", tasks: 3, productivity: 95 },
];

const chartConfig = {
  productivity: {
    color: "var(--chart-1)",
    label: "Productivité %",
  },
} satisfies ChartConfig;

export function ProductivityMembers() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Productivité par membre</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart
            accessibilityLayer
            data={productivityData}
            layout="vertical"
            margin={{
              left: 0,
              right: 40,
            }}
          >
            <CartesianGrid horizontal={false} vertical={false} />
            <YAxis dataKey="name" tickLine={false} tickMargin={10} type="category" width={80} />
            <XAxis dataKey="productivity" hide type="number" domain={[0, 100]} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(label) => `Membre: ${label}`}
                  valueFormatter={(value) => `${value}%`}
                />
              }
            />
            <Bar dataKey="productivity" fill="var(--color-productivity)" radius={4} barSize={28} fillOpacity={0.8}>
              <LabelList
                className="fill-foreground"
                dataKey="productivity"
                fontSize={14}
                formatter={(value: number) => `${value}%`}
                offset={8}
                position="right"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
