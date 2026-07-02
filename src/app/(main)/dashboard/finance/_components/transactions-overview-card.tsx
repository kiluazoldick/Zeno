"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

// Données en FCFA pour Zoldick
const chartData = [
  { day: "Lun", entree: 1250000, sortie: 850000 },
  { day: "Mar", entree: 1800000, sortie: 920000 },
  { day: "Mer", entree: 1500000, sortie: 780000 },
  { day: "Jeu", entree: 2200000, sortie: 1050000 },
  { day: "Ven", entree: 1950000, sortie: 980000 },
  { day: "Sam", entree: 1650000, sortie: 890000 },
  { day: "Dim", entree: 2400000, sortie: 1150000 },
];

const formatFCFA = (value: number) => {
  return formatCurrency(value, { currency: "XAF", noDecimals: true });
};

const chartConfig = {
  sortie: {
    color: "var(--chart-4)",
    label: "Sorties",
  },
  entree: {
    color: "var(--chart-2)",
    label: "Entrées",
  },
} satisfies ChartConfig;

export function TransactionsOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Aperçu des transactions</CardTitle>
        <CardAction>
          <Select defaultValue="weekly">
            <SelectTrigger className="w-28" size="sm">
              <SelectValue placeholder="Hebdomadaire" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
                <SelectItem value="yearly">Annuel</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-50 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              hide
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  hideLabel
                  label={label}
                  payload={payload?.map((item) => ({
                    ...item,
                    value:
                      typeof item.value === "number"
                        ? formatFCFA(item.value)
                        : item.value,
                  }))}
                />
              )}
            />
            <Line
              dataKey="entree"
              dot={false}
              stroke="var(--color-entree)"
              strokeLinecap="round"
              strokeWidth={3}
              type="linear"
            />
            <Line
              dataKey="sortie"
              dot={false}
              stroke="var(--color-sortie)"
              strokeDasharray="5 5"
              strokeLinecap="round"
              strokeWidth={2}
              type="linear"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
