"use client";

import * as React from "react";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

type AccountKey = "projets" | "operations" | "reserve" | "tresorerie";

const balanceData: {
  account: string;
  amount: number;
  key: AccountKey;
  percentage: number;
}[] = [
  {
    account: "Comptes projets",
    amount: 122_540_000,
    key: "projets",
    percentage: 52.2,
  },
  {
    account: "Compte opérations",
    amount: 48_320_000,
    key: "operations",
    percentage: 20.6,
  },
  {
    account: "Réserve financière",
    amount: 36_780_000,
    key: "reserve",
    percentage: 15.7,
  },
  {
    account: "Trésorerie",
    amount: 27_256_000,
    key: "tresorerie",
    percentage: 11.5,
  },
];

const chartConfig = {
  amount: {
    label: "Solde",
  },
  projets: {
    color: "var(--chart-1)",
    label: "Comptes projets",
  },
  operations: {
    color: "var(--chart-2)",
    label: "Compte opérations",
  },
  reserve: {
    color: "var(--chart-3)",
    label: "Réserve financière",
  },
  tresorerie: {
    color: "var(--chart-4)",
    label: "Trésorerie",
  },
} satisfies ChartConfig;

const currencies = {
  XAF: {
    label: "Solde FCFA",
  },
  EUR: {
    label: "Solde Euro",
  },
  USD: {
    label: "Solde USD",
  },
} as const;

type Currency = keyof typeof currencies;

const getAccountColor = (key: AccountKey) => {
  const config = chartConfig[key];
  return "color" in config ? config.color : undefined;
};

const chartData = balanceData.map((item) => ({
  ...item,
  fill: getAccountColor(item.key),
}));
const totalBalance = balanceData.reduce(
  (total, item) => total + item.amount,
  0,
);

export function BalanceDistributionCard() {
  const [currency, setCurrency] = React.useState<Currency>("XAF");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Répartition des fonds</CardTitle>
        <CardAction>
          <Select
            onValueChange={(value) => setCurrency(value as Currency)}
            value={currency}
          >
            <SelectTrigger className="w-36" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(currencies).map(([value, item]) => (
                  <SelectItem key={value} value={value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="grid items-center gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-50"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="w-52"
                  nameKey="account"
                />
              }
            />
            <Pie
              cornerRadius={6}
              data={chartData}
              dataKey="amount"
              innerRadius={65}
              nameKey="account"
              outerRadius={90}
              paddingAngle={2}
              strokeWidth={5}
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
                        className="fill-foreground font-medium text-lg tabular-nums"
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 14}
                      >
                        {formatCurrency(totalBalance, {
                          currency,
                          noDecimals: true,
                        })}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex min-w-0 flex-col gap-3">
          {chartData.map((item) => (
            <div
              className="grid grid-cols-[1fr_auto] items-end gap-3"
              key={item.key}
            >
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1">
                  <span
                    aria-hidden="true"
                    className="h-2 w-1 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <p className="truncate text-muted-foreground text-xs">
                    {item.account}
                  </p>
                </div>
                <p className="font-medium tabular-nums">
                  {formatCurrency(item.amount, { currency, noDecimals: true })}
                </p>
              </div>
              <div className="font-medium tabular-nums">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
