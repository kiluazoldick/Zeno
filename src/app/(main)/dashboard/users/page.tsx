"use client";

import { Users } from "./_components/users";
import { useMembers } from "@/hooks/queries/use-members";
import { Loader2, AlertCircle } from "lucide-react";

export default function Page() {
  const { data: members, isLoading, error } = useMembers();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <span>Erreur lors du chargement des membres: {error.message}</span>
        </div>
      </div>
    );
  }

  return <Users users={members || []} />;
}
