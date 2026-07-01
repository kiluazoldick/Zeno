import { Ellipsis, FileDown, RefreshCw, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StatsToolbar() {
  return (
    <div className="flex items-center gap-2">
      <Select defaultValue="last-3-months">
        <SelectTrigger className="w-34">
          <SelectValue placeholder="Sélectionner la période" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="last-7-days">7 derniers jours</SelectItem>
            <SelectItem value="last-4-weeks">4 dernières semaines</SelectItem>
            <SelectItem value="last-3-months">3 derniers mois</SelectItem>
            <SelectItem value="last-12-months">12 derniers mois</SelectItem>
            <SelectItem value="year-to-date">Depuis début année</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Actions statistiques">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <FileDown />
              Exporter le rapport
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 />
              Partager le tableau
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RefreshCw />
              Actualiser les données
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
