"use client";

import {
  WalletMinimal,
  SaudiRiyal,
  Calendar,
  HandCoins,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types/database";

interface TransactionKpiProps {
  transactions: Transaction[];
}

// KPI 1 : Compte principal
export function PrimaryAccount() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <WalletMinimal className="size-5" />
            </span>
            Compte principal
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0.5">
          <p className="font-medium text-xl tabular-nums">12 450 000 FCFA</p>
          <p className="text-muted-foreground text-xs">Solde disponible</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="flex-1 bg-zeno-primary hover:bg-zeno-primary/90"
            size="sm"
          >
            Payer
          </Button>
          <Button className="flex-1" size="sm" variant="outline">
            Demander
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// KPI 2 : Patrimoine net
export function NetWorth({ transactions }: TransactionKpiProps) {
  const totalEntrees = transactions
    .filter((t) => t.type === "Entrée Réalisée" && t.statut === "Réalisée")
    .reduce((sum, t) => sum + t.montant, 0);

  const totalSorties = transactions
    .filter((t) => t.type === "Dépense Réalisé" && t.statut === "Réalisée")
    .reduce((sum, t) => sum + t.montant, 0);

  const netWorth = totalEntrees - totalSorties;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <SaudiRiyal className="size-5" />
            </span>
            Patrimoine net
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-xl tabular-nums">
              {formatCurrency(netWorth || 84_250_000, {
                currency: "XAF",
                noDecimals: true,
              })}{" "}
              FCFA
            </p>
            <span className="text-xs text-green-600">+1 680 000 FCFA MoM</span>
          </div>
          <p className="text-muted-foreground text-xs">Ce mois-ci</p>
        </div>

        <Separator />
        <p className="text-muted-foreground text-xs">Tous les comptes liés</p>
      </CardContent>
    </Card>
  );
}

// KPI 3 : Flux de trésorerie mensuel
export function MonthlyCashFlow({ transactions }: TransactionKpiProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthTransactions = transactions.filter((t) => {
    const date = new Date(t.date_transaction);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const entries = monthTransactions
    .filter((t) => t.type === "Entrée Réalisée" && t.statut === "Réalisée")
    .reduce((sum, t) => sum + t.montant, 0);

  const expenses = monthTransactions
    .filter((t) => t.type === "Dépense Réalisé" && t.statut === "Réalisée")
    .reduce((sum, t) => sum + t.montant, 0);

  const cashFlow = entries - expenses;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <Calendar className="size-5" />
            </span>
            Flux de trésorerie
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0.5">
          <p
            className={`font-medium text-xl tabular-nums ${cashFlow >= 0 ? "text-green-600" : "text-destructive"}`}
          >
            {cashFlow >= 0 ? "+" : ""}
            {formatCurrency(cashFlow || 2_780_000, {
              currency: "XAF",
              noDecimals: true,
            })}{" "}
            FCFA
          </p>
          <p className="text-muted-foreground text-xs">Ce mois-ci · Net</p>
        </div>

        <Separator />
        <p className="flex items-center text-muted-foreground text-xs">
          <span
            className={cashFlow >= 0 ? "text-green-600" : "text-destructive"}
          >
            {cashFlow >= 0 ? "↑" : "↓"}
          </span>{" "}
          4.1% vs mois dernier
        </p>
      </CardContent>
    </Card>
  );
}

// KPI 4 : Taux d'épargne
export function SavingsRate({ transactions }: TransactionKpiProps) {
  const totalEntries = transactions
    .filter((t) => t.type === "Entrée Réalisée" && t.statut === "Réalisée")
    .reduce((sum, t) => sum + t.montant, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "Dépense Réalisé" && t.statut === "Réalisée")
    .reduce((sum, t) => sum + t.montant, 0);

  const savingsRate =
    totalEntries > 0
      ? ((totalEntries - totalExpenses) / totalEntries) * 100
      : 32;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <HandCoins className="size-5" />
            </span>
            Taux d'épargne
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-xl tabular-nums">
              {Math.round(savingsRate)}%
            </p>
            <span className="text-xs text-green-600">+3.5% MoM</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Ce mois-ci · Après dépenses
          </p>
        </div>

        <Separator />
        <p className="text-muted-foreground text-xs">
          Au-dessus de votre moyenne
        </p>
      </CardContent>
    </Card>
  );
}

// Composant principal qui regroupe les 4 KPI
export function TransactionKpi({ transactions }: TransactionKpiProps) {
  return (
    <>
      <PrimaryAccount />
      <NetWorth transactions={transactions} />
      <MonthlyCashFlow transactions={transactions} />
      <SavingsRate transactions={transactions} />
    </>
  );
}
