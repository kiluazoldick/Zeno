import { TrendingUp, AlertCircle, Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export function FinanceNotification() {
  return (
    <Item className="rounded-xl border-zeno-primary/20" variant="outline">
      <ItemMedia variant="icon">
        <Bell className="size-5 text-zeno-primary" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Budget mensuel à 78%</ItemTitle>
        <ItemDescription>
          Le budget du mois de{" "}
          {new Date().toLocaleDateString("fr-FR", { month: "long" })} a été
          utilisé à 78%. Reste 2 280 000 FCFA sur 10 500 000 FCFA.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          size="sm"
          variant="outline"
          className="border-zeno-primary/30 text-zeno-primary hover:bg-zeno-primary/10"
        >
          Voir les détails
        </Button>
      </ItemActions>
    </Item>
  );
}
