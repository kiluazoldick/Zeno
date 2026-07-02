"use client";

import { addDays, format, set } from "date-fns";
import { ChevronRight, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

const transactions = [
  {
    id: 1,
    title: "Paiement fournisseurs - Banto",
    date: format(
      set(addDays(new Date(), 2), { hours: 14, minutes: 45 }),
      "HH:mm '•' dd MMMM yyyy",
    ),
    amount: "4 200 000 FCFA",
    type: "sortie",
  },
  {
    id: 2,
    title: "Facture client - Hôtel Royal",
    date: format(
      set(addDays(new Date(), 4), { hours: 7, minutes: 0 }),
      "HH:mm '•' dd MMMM yyyy",
    ),
    amount: "12 500 000 FCFA",
    type: "entree",
  },
  {
    id: 3,
    title: "Salaires mensuels",
    date: format(
      set(addDays(new Date(), 10), { hours: 7, minutes: 0 }),
      "HH:mm '•' dd MMMM yyyy",
    ),
    amount: "8 450 000 FCFA",
    type: "sortie",
  },
];

export function UpcomingTransactions() {
  const totalDue = transactions
    .filter((t) => t.type === "sortie")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/\D/g, "")), 0);

  const totalIncoming = transactions
    .filter((t) => t.type === "entree")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/\D/g, "")), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Transactions à venir</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="flex items-baseline text-3xl leading-none tracking-tight">
              <span className="font-normal">
                {(totalIncoming - totalDue).toLocaleString("fr-FR")}
              </span>
              <span className="text-muted-foreground text-xl"> FCFA</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-none">
              Solde net des transactions à venir
            </p>
          </div>
          <div className="flex w-max items-center gap-2 rounded-md border border-zeno-primary/20 bg-zeno-primary/5 px-2 py-1.5 text-sm">
            <Clock className="size-4 text-zeno-primary" />
            <span className="text-muted-foreground">
              <span className="font-medium text-zeno-primary">
                {transactions.length}
              </span>{" "}
              transactions prévues
            </span>
          </div>
        </div>

        <ItemGroup>
          {transactions.map((transaction) => (
            <Item key={transaction.id} variant="outline" size="xs">
              <ItemMedia>
                <div className="grid size-9 place-items-center rounded-md border bg-background">
                  <span
                    className={cn(
                      "text-xs font-bold",
                      transaction.type === "entree"
                        ? "text-green-600"
                        : "text-destructive",
                    )}
                  >
                    {transaction.type === "entree" ? "+" : "-"}
                  </span>
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{transaction.title}</ItemTitle>
                <ItemDescription>{transaction.date}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <span
                  className={cn(
                    "text-sm font-medium mr-2",
                    transaction.type === "entree"
                      ? "text-green-600"
                      : "text-destructive",
                  )}
                >
                  {transaction.amount}
                </span>
                <ChevronRight className="size-5 text-muted-foreground" />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
