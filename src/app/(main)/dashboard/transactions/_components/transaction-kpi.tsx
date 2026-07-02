"use client";

import { WalletMinimal, SaudiRiyal, Calendar, HandCoins } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

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
          <p className="font-medium text-xl tabular-nums">
            {formatCurrency(12450, { currency: "XAF", noDecimals: true })} FCFA
          </p>
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
export function NetWorth() {
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
              {formatCurrency(84250, { currency: "XAF", noDecimals: true })}{" "}
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
export function MonthlyCashFlow() {
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
          <p className="font-medium text-xl tabular-nums text-green-600">
            +{formatCurrency(2780, { currency: "XAF", noDecimals: true })} FCFA
          </p>
          <p className="text-muted-foreground text-xs">Ce mois-ci · Net</p>
        </div>

        <Separator />
        <p className="flex items-center text-muted-foreground text-xs">
          <span className="text-green-600">↑</span> 4.1% vs mois dernier
        </p>
      </CardContent>
    </Card>
  );
}

// KPI 4 : Taux d'épargne
export function SavingsRate() {
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
            <p className="font-medium text-xl tabular-nums">32%</p>
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
export function TransactionKpi() {
  return (
    <>
      <PrimaryAccount />
      <NetWorth />
      <MonthlyCashFlow />
      <SavingsRate />
    </>
  );
}
