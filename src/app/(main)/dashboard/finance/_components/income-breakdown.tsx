import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const incomeSources = [
  {
    label: "Projets BTP · 62%",
    value: "11 439 000",
    percent: 62,
    color: "bg-chart-1",
  },
  {
    label: "Rénovations · 25%",
    value: "4 612 500",
    percent: 25,
    color: "bg-chart-2",
  },
  {
    label: "Autres prestations · 13%",
    value: "2 398 500",
    percent: 13,
    color: "bg-chart-3",
  },
];

export function IncomeBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Répartition des revenus</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-1 md:grid-cols-3">
        {incomeSources.map((source) => (
          <section key={source.label} className="isolate flex gap-[0.5px]">
            <Separator
              orientation="vertical"
              className="mb-1 h-auto self-auto border-muted-foreground/50 border-l border-dashed bg-transparent"
            />
            <div className="flex min-h-24 flex-1 flex-col justify-between">
              <div className="flex min-w-0 flex-col gap-1 px-1">
                <p className="wrap-break-word text-muted-foreground text-xs leading-none">
                  {source.label}
                </p>
                <div className="text-lg leading-none tracking-tight">
                  {source.value} FCFA
                </div>
              </div>
              <div
                className={cn("-ml-0.5 h-5 rounded-sm", source.color)}
                style={{ opacity: source.percent / 100 }}
              />
            </div>
          </section>
        ))}
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
