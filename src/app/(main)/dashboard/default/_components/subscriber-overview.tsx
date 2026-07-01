"use client";

import { Download, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import customersData from "./data.json";
import type { RecentCustomerRow } from "./recent-customers-table/schema";
import { RecentCustomersTable } from "./recent-customers-table/table";

const customers = customersData as RecentCustomerRow[];

export function SubscriberOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">Projets et clients récents</CardTitle>
        <CardDescription>Liste des derniers projets et clients avec leur statut et avancement.</CardDescription>
        <CardAction className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Exporter
          </Button>
          <Button size="sm" className="bg-zeno-primary hover:bg-zeno-primary/90">
            <Plus className="size-4" />
            Nouveau projet
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-0">
        <RecentCustomersTable data={customers} />
      </CardContent>
    </Card>
  );
}
