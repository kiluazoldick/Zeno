import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function WeeklySummaryCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Cette semaine</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Voir tout
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground">Excellente progression cette semaine. Continuez sur cette lancée.</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Objectifs atteints</span>
            <span className="font-medium">12 / 15</span>
          </div>
          <Progress value={80} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
