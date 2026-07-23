"use client";

import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const quotes = [
  {
    text: "Les grands projets naissent de petites actions répétées.",
    author: "Proverbe zen",
  },
  {
    text: "La constance est la clé de la réussite en construction.",
    author: "Architecte",
  },
  {
    text: "Un projet bien planifié est déjà à moitié réalisé.",
    author: "Gestion de projet",
  },
  {
    text: "La qualité n'est pas un acte, c'est une habitude.",
    author: "Aristote",
  },
  {
    text: "Le succès d'un projet repose sur la collaboration.",
    author: "Travail d'équipe",
  },
  {
    text: "Chaque jour, un pas de plus vers l'excellence.",
    author: "Motivation",
  },
  {
    text: "La persévérance transforme l'impossible en possible.",
    author: "Détermination",
  },
  { text: "Un leader voit plus loin que les autres.", author: "Leadership" },
];

export function QuoteCard() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Changer la citation chaque jour
    const today = new Date().getDate();
    const index = today % quotes.length;
    setQuote(quotes[index]);

    // Ou changer toutes les 6 heures
    const interval = setInterval(
      () => {
        const newIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[newIndex]);
      },
      6 * 60 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="grid size-8 shrink-0 place-items-center text-zeno-primary">
          <Quote className="size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xl leading-none tracking-tight">"{quote.text}"</p>
          <p className="text-muted-foreground">— {quote.author}</p>
        </div>
      </div>
    </section>
  );
}
