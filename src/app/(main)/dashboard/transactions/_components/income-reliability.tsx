"use client";

import { CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const incomeData = {
  reliability: 85,
  fixedIncome: 90_000_000,
  variableIncome: 46_500_000,
  trend: "stable",
};

export function IncomeReliability() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Fiabilité des revenus</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-green-500" />
          <span className="font-medium text-sm">Haute fiabilité</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {incomeData.reliability}%
          </span>
        </div>
        <Progress value={incomeData.reliability} className="h-2" />

        <p className="text-xs text-muted-foreground">
          Basé sur les 6 derniers mois de revenus
        </p>

        <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/50 p-3">
          <div>
            <p className="text-xs text-muted-foreground">Revenus fixes</p>
            <p className="font-medium text-sm">
              {incomeData.fixedIncome.toLocaleString("fr-FR")} FCFA
            </p>
            <p className="text-xs text-green-600">Récurrent · Prédictible</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Revenus variables</p>
            <p className="font-medium text-sm">
              {incomeData.variableIncome.toLocaleString("fr-FR")} FCFA
            </p>
            <p className="text-xs text-amber-600">Sources fluctuantes</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingUp className="size-3.5 text-green-500" />
            Tendance: {incomeData.trend === "stable" ? "Stable" : "En hausse"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
