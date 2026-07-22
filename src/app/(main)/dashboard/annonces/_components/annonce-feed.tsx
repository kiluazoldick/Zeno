"use client";

import { useState } from "react";
import {
  Bell,
  Calendar,
  Tag,
  MessageSquare,
  Pin,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn, getInitials } from "@/lib/utils";
import type { Annonce } from "@/types/database";

import { importanceColors, fallbackAnnonces } from "./annonce-data";

interface AnnonceFeedProps {
  annonces: Annonce[];
}

export function AnnonceFeed({ annonces }: AnnonceFeedProps) {
  const [filter, setFilter] = useState<"all" | "Haute" | "Normale" | "Basse">(
    "all",
  );

  const data = annonces && annonces.length > 0 ? annonces : fallbackAnnonces;

  const filteredAnnonces =
    filter === "all"
      ? data
      : data.filter((a) => a.importance === filter && a.statut === "Publiée");

  const pinned = data.filter(
    (a) => a.importance === "Haute" && a.statut === "Publiée",
  );

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fil d'actualité</CardTitle>
          <CardDescription>Aucune annonce disponible</CardDescription>
        </CardHeader>
        <CardContent className="flex h-32 items-center justify-center text-muted-foreground">
          <p>Aucune annonce à afficher</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-zeno-primary" />
                <CardTitle>Fil d'actualité</CardTitle>
                <Badge variant="outline" className="ml-2">
                  {data.filter((a) => a.statut === "Publiée").length} nouvelles
                </Badge>
              </div>
              <div className="flex gap-1">
                {["all", "Haute", "Normale", "Basse"].map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={filter === f ? "default" : "ghost"}
                    className={cn(
                      "text-xs",
                      filter === f &&
                        "bg-zeno-primary hover:bg-zeno-primary/90",
                    )}
                    onClick={() => setFilter(f as any)}
                  >
                    {f === "all" ? "Tous" : f}
                  </Button>
                ))}
              </div>
            </div>
            <CardDescription>
              Communications officielles et informations importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Annonces épinglées */}
            {pinned.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Pin className="size-3.5" />
                  <span>Annonces importantes</span>
                </div>
                {pinned.map((annonce) => (
                  <AnnonceItem key={annonce.id} annonce={annonce} pinned />
                ))}
                <Separator />
              </div>
            )}

            {/* Liste des annonces */}
            {filteredAnnonces
              .filter((a) => a.importance !== "Haute")
              .map((annonce) => (
                <AnnonceItem key={annonce.id} annonce={annonce} />
              ))}

            {filteredAnnonces.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <Bell className="mx-auto size-8 mb-2 opacity-30" />
                <p>Aucune annonce à afficher</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total annonces</span>
              <span className="font-medium">{data.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm">
                <span className="size-2 rounded-full bg-destructive" />
                Haute importance
              </span>
              <span className="font-medium">
                {data.filter((a) => a.importance === "Haute").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm">
                <span className="size-2 rounded-full bg-zeno-primary" />
                Importance normale
              </span>
              <span className="font-medium">
                {data.filter((a) => a.importance === "Normale").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm">
                <span className="size-2 rounded-full bg-muted" />
                Importance basse
              </span>
              <span className="font-medium">
                {data.filter((a) => a.importance === "Basse").length}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Brouillons</span>
              <span className="font-medium">
                {data.filter((a) => a.statut === "Brouillon").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tags populaires</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {Array.from(new Set(data.flatMap((a) => a.tags || []))).map(
              (tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="px-2 py-1 text-xs"
                >
                  {tag}
                </Badge>
              ),
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnnonceItem({
  annonce,
  pinned = false,
}: {
  annonce: Annonce;
  pinned?: boolean;
}) {
  const colorClass = importanceColors[annonce.importance];
  const iconMap: Record<string, string> = {
    Haute: "🔴",
    Normale: "🟡",
    Basse: "🟢",
  };
  const icon = iconMap[annonce.importance];

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all hover:bg-muted/30",
        pinned && "border-zeno-primary/30 bg-zeno-primary/5",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-zeno-primary/10 text-zeno-primary text-xs">
            {annonce.auteur ? getInitials(annonce.auteur) : "AD"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{annonce.titre}</span>
            <Badge className={cn("text-xs font-normal", colorClass)}>
              {icon} {annonce.importance}
            </Badge>
            {pinned && (
              <Badge
                variant="outline"
                className="text-xs text-zeno-primary border-zeno-primary/30"
              >
                <Pin className="size-3 mr-1" />
                Épinglée
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {annonce.contenu}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-3.5" />
              {annonce.auteur || "Admin"}
            </span>
            <span>
              {new Date(annonce.date_annonce).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {annonce.date_reunion && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {new Date(annonce.date_reunion).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3.5" />
              {annonce.commentaires_count || 0}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {(annonce.tags || []).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-2 py-0.5"
              >
                <Tag className="size-2.5 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
