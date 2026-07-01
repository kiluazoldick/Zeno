import { Quote } from "lucide-react";

export function QuoteCard() {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="grid size-8 shrink-0 place-items-center text-zeno-primary">
          <Quote className="size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xl leading-none tracking-tight">
            "Les grands projets naissent de petites actions répétées."
          </p>
          <p className="text-muted-foreground">Chaque jour, un pas de plus vers l'excellence.</p>
        </div>
      </div>
    </section>
  );
}
