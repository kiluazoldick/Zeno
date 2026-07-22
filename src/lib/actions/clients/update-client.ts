"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  clientUpdateSchema,
  type ClientUpdateInput,
} from "@/lib/validations/client.schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateClientSchema = z.object({
  id: z.string().uuid("ID client invalide"),
  data: clientUpdateSchema,
});

export async function updateClient(id: string, data: ClientUpdateInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = updateClientSchema.safeParse({ id, data });

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le client existe
    const { data: existing, error: checkError } = await adminClient
      .from("clients")
      .select("id, email")
      .eq("id", id)
      .single();

    if (checkError || !existing) {
      return {
        success: false,
        error: { notFound: ["Client non trouvé"] },
      };
    }

    // Vérifier que l'email n'est pas déjà utilisé par un autre client
    if (validated.data.email && validated.data.email !== existing.email) {
      const { data: duplicate, error: dupError } = await adminClient
        .from("clients")
        .select("id")
        .eq("email", validated.data.email)
        .neq("id", id)
        .maybeSingle();

      if (dupError) {
        return {
          success: false,
          error: { db: [dupError.message] },
        };
      }

      if (duplicate) {
        return {
          success: false,
          error: { email: ["Un client avec cet email existe déjà"] },
        };
      }
    }

    // Mettre à jour le client
    const { data: client, error } = await adminClient
      .from("clients")
      .update({
        ...validated.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/crm");
    revalidatePath(`/dashboard/crm/${id}`);
    revalidatePath("/dashboard/projects");

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
