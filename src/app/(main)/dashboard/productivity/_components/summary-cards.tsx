import { ArrowRight, Clock3, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const summaryCards = [
  {
    title: "Tâches aujourd'hui",
    value: "8",
    description: "tâches planifiées",
    icon: Clock3,
  },
  {
    title: "Productivité",
    value: "78%",
    description: "taux d'achèvement",
    icon: TrendingUp,
  },
  {
    title: "Équipe active",
    value: "6",
    description: "membres en poste",
    icon: Users,
  },
] as const;

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summaryCards.map((item) => (
        <Card key={item.title} className="shadow-xs">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="grid size-7 place-items-center rounded-lg border bg-muted">
                  <item.icon className="size-4" />
                </div>
                {item.title}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-2xl leading-none tracking-tight">{item.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground tabular-nums leading-none">{item.description}</p>
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
