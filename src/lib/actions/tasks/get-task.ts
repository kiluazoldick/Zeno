"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const getTaskSchema = z.object({
  id: z.string().uuid("ID tâche invalide"),
  includeProject: z.boolean().default(true),
  includeAssignee: z.boolean().default(true),
  includeReports: z.boolean().default(false),
});

export async function getTask(
  id: string,
  options?: {
    includeProject?: boolean;
    includeAssignee?: boolean;
    includeReports?: boolean;
  },
) {
  const supabase = await createServerClient();

  const validated = getTaskSchema.safeParse({
    id,
    includeProject: options?.includeProject ?? true,
    includeAssignee: options?.includeAssignee ?? true,
    includeReports: options?.includeReports ?? false,
  });

  if (!validated.success) {
    throw new Error(
      validated.error.flatten().fieldErrors.id?.join(", ") || "ID invalide",
    );
  }

  // Construire la sélection
  let select = "*";
  const relations = [];

  if (validated.data.includeProject) {
    relations.push("projet:projet_id (*, client:client_id (*))");
  }

  if (validated.data.includeAssignee) {
    relations.push("assigne:assigne_a (*)");
  }

  if (validated.data.includeReports) {
    relations.push("reports (*)");
  }

  if (relations.length > 0) {
    select = `*, ${relations.join(", ")}`;
  }

  const { data, error } = await supabase
    .from("tasks")
    .select(select)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Erreur lors de la récupération de la tâche: ${error.message}`,
    );
  }

  return data;
}
