"use client";

import { useState } from "react";
import {
  Bell,
  Calendar,
  Tag,
  MessageSquare,
  MoreHorizontal,
  Pin,
  Eye,
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

import {
  annoncesData,
  importanceColors,
  importanceIcons,
} from "./annonce-data";

export function AnnonceFeed() {
  const [filter, setFilter] = useState<"all" | "Haute" | "Normale" | "Basse">(
    "all",
  );

  const filteredAnnonces =
    filter === "all"
      ? annoncesData
      : annoncesData.filter((a) => a.importance === filter);

  const pinned = annoncesData.filter(
    (a) => a.importance === "Haute" && a.status === "Publiée",
  );

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-4">
        {/* Fil d'actualité */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-zeno-primary" />
                <CardTitle>Fil d'actualité</CardTitle>
                <Badge variant="outline" className="ml-2">
                  {
                    filteredAnnonces.filter((a) => a.status === "Publiée")
                      .length
                  }{" "}
                  nouvelles
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
              .filter((a) => a.status === "Publiée" && a.importance !== "Haute")
              .map((annonce) => (
                <AnnonceItem key={annonce.id} annonce={annonce} />
              ))}

            {filteredAnnonces.filter((a) => a.status === "Publiée").length ===
              0 && (
              <div className="py-8 text-center text-muted-foreground">
                <Bell className="mx-auto size-8 mb-2 opacity-30" />
                <p>Aucune annonce à afficher</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Filtres et récapitulatif */}
      <div className="lg:col-span-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total annonces</span>
              <span className="font-medium">{annoncesData.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm">
                <span className="size-2 rounded-full bg-destructive" />
                Haute importance
              </span>
              <span className="font-medium">
                {annoncesData.filter((a) => a.importance === "Haute").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm">
                <span className="size-2 rounded-full bg-zeno-primary" />
                Importance normale
              </span>
              <span className="font-medium">
                {annoncesData.filter((a) => a.importance === "Normale").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm">
                <span className="size-2 rounded-full bg-muted" />
                Importance basse
              </span>
              <span className="font-medium">
                {annoncesData.filter((a) => a.importance === "Basse").length}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Brouillons</span>
              <span className="font-medium">
                {annoncesData.filter((a) => a.status === "Brouillon").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tags populaires</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {Array.from(new Set(annoncesData.flatMap((a) => a.tags))).map(
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
  annonce: (typeof annoncesData)[0];
  pinned?: boolean;
}) {
  const colorClass = importanceColors[annonce.importance];
  const icon = importanceIcons[annonce.importance];

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all hover:bg-muted/30",
        pinned && "border-zeno-primary/30 bg-zeno-primary/5",
        annonce.status === "Archivée" && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-zeno-primary/10 text-zeno-primary text-xs">
            {getInitials(annonce.auteur)}
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
            {annonce.status === "Archivée" && (
              <Badge variant="outline" className="text-xs">
                Archivée
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {annonce.contenu}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-3.5" />
              {annonce.auteur}
            </span>
            <span>{annonce.date}</span>
            {annonce.dateReunion && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {annonce.dateReunion}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3.5" />
              {annonce.commentaires}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {annonce.tags.map((tag) => (
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
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground shrink-0"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}
