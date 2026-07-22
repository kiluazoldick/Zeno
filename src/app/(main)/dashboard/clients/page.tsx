"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { ClientsCrud } from "./_components/clients-crud";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clients");
      if (response.ok) {
        const data = await response.json();
        setClients(data || []);
      } else {
        setError("Erreur lors du chargement des clients");
      }
    } catch (err) {
      setError("Erreur lors du chargement des clients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">Gérez votre base de données CRM, créez, modifiez ou supprimez des clients</p>
      </div>

      <ClientsCrud initialClients={clients} onRefresh={loadClients} />
    </div>
  );
}
