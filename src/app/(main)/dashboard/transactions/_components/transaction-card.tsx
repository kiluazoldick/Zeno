"use client";

import { addDays, format } from "date-fns";
import {
  Home,
  Receipt,
  Sparkles,
  Zap,
  Building2,
  Users,
  Wrench,
} from "lucide-react";
import { siApple, siMastercard } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const now = new Date();

// Transactions à venir adaptées à Zoldick
const upcomingPayments = [
  {
    id: 1,
    icon: Home,
    title: "Loyer bureau",
    amount: 1_200_000,
    date: `Échéance ${format(addDays(now, 2), "dd MMMM yyyy")}`,
  },
  {
    id: 2,
    icon: Zap,
    title: "Électricité chantier",
    amount: 750_000,
    date: `Échéance ${format(addDays(now, 2), "dd MMMM yyyy")}`,
  },
  {
    id: 3,
    icon: Building2,
    title: "Fournisseurs Banto",
    amount: 4_200_000,
    date: `Échéance ${format(addDays(now, 7), "dd MMMM yyyy")}`,
  },
  {
    id: 4,
    icon: Users,
    title: "Salaires mensuels",
    amount: 8_450_000,
    date: `Échéance ${format(addDays(now, 9), "dd MMMM yyyy")}`,
  },
  {
    id: 5,
    icon: Wrench,
    title: "Matériaux chantier",
    amount: 2_300_000,
    date: `Échéance ${format(addDays(now, 14), "dd MMMM yyyy")}`,
  },
];

export function TransactionCard() {
  const totalUpcoming = upcomingPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card className="shadow-xs">
      <CardHeader className="items-center">
        <CardTitle>Carte de paiement</CardTitle>
        <CardDescription>
          Carte principale · {upcomingPayments.length} paiements à venir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Carte bancaire - Dégradé Bleu vers Cyan avec cercles */}
          <div className="grid w-full place-items-center">
            <div className="relative flex aspect-8/5 w-full max-w-100 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-[#0B2B6B] via-[#02B3C4] to-[#0B2B6B] p-6 shadow-lg">
              {/* Cercles décoratifs */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/5" />
              <div className="absolute right-24 top-8 h-20 w-20 rounded-full bg-white/10" />
              <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />

              {/* Ligne décorative */}
              <div className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="relative z-10 flex items-start justify-between">
                <SimpleIcon
                  icon={siApple}
                  className="size-5 fill-white/90 sm:size-8"
                />
                <span className="text-xs font-bold text-white/90 tracking-wider">
                  ZOLDICK
                </span>
              </div>

              <div className="relative z-10 space-y-1">
                <p className="font-mono text-white/90 text-sm tracking-[0.15em] sm:text-lg">
                  •••• •••• •••• 2301
                </p>
              </div>

              <div className="relative z-10 flex items-end justify-between">
                <div className="space-y-2">
                  <p className="font-medium font-mono text-white text-sm uppercase tracking-wide">
                    Nanga Doumer
                  </p>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] text-white/80 uppercase tracking-wider">
                        Valable jusqu'à
                      </p>
                      <p className="font-mono text-white/80 text-xs">12/28</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/80 uppercase tracking-wider">
                        CVV
                      </p>
                      <p className="font-mono text-white/80 text-xs">•••</p>
                    </div>
                  </div>
                </div>
                <SimpleIcon
                  icon={siMastercard}
                  className="size-7 fill-white/80 sm:size-10"
                />
              </div>
            </div>
          </div>

          {/* Détails de la carte */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Type de carte</span>
              <span className="font-medium tabular-nums">Virtuelle</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Cycle de facturation
              </span>
              <span className="font-medium tabular-nums">
                Le 21 de chaque mois
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plafond</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(62_000_000, {
                  currency: "XAF",
                  noDecimals: true,
                })}{" "}
                FCFA
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Solde disponible</span>
              <span className="font-medium tabular-nums text-zeno-primary">
                {formatCurrency(13_100_000, {
                  currency: "XAF",
                  noDecimals: true,
                })}{" "}
                FCFA
              </span>
            </div>
          </div>

          {/* Boutons de gestion */}
          <div className="space-y-1">
            <Button
              className="w-full bg-zeno-primary hover:bg-zeno-primary/90"
              size="sm"
            >
              Gérer la carte
            </Button>
            <Button className="w-full" variant="outline" size="sm">
              Ajouter une carte
            </Button>
          </div>

          <Separator />

          {/* Paiements à venir */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h6 className="text-muted-foreground text-sm uppercase">
                Paiements à venir
              </h6>
              <span className="text-xs font-medium text-zeno-primary">
                Total:{" "}
                {formatCurrency(totalUpcoming, {
                  currency: "XAF",
                  noDecimals: true,
                })}{" "}
                FCFA
              </span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {upcomingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zeno-primary/10 text-zeno-primary">
                    <payment.icon className="size-4" />
                  </div>
                  <div className="flex w-full items-end justify-between">
                    <div>
                      <p className="font-medium text-sm">{payment.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {payment.date}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-destructive text-sm tabular-nums leading-none">
                        {formatCurrency(payment.amount, {
                          currency: "XAF",
                          noDecimals: true,
                        })}{" "}
                        FCFA
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full" size="sm" variant="outline">
              Voir tous les paiements
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
