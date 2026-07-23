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
    console.error("Validation error:", validated.error.flatten().fieldErrors);
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
    if (
      validated.data.data.email &&
      validated.data.data.email !== existing.email
    ) {
      const { data: duplicate, error: dupError } = await adminClient
        .from("clients")
        .select("id")
        .eq("email", validated.data.data.email)
        .neq("id", id)
        .maybeSingle();

      if (dupError) {
        console.error("Erreur vérification email:", dupError);
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

    // Construire l'objet de mise à jour avec TOUS les champs
    const updateData: any = {};
    const fields = [
      "nom",
      "email",
      "telephone",
      "adresse",
      "secteur",
      "code_postal",
      "ville",
      "pays",
      "tax_id",
    ];

    for (const field of fields) {
      if (validated.data.data[field as keyof ClientUpdateInput] !== undefined) {
        updateData[field] =
          validated.data.data[field as keyof ClientUpdateInput];
      }
    }

    updateData.updated_at = new Date().toISOString();

    // Mettre à jour le client
    const { data: client, error } = await adminClient
      .from("clients")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erreur updateClient:", error);
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    // Revalider les chemins
    revalidatePath("/dashboard/crm");
    revalidatePath(`/dashboard/crm/${id}`);
    revalidatePath("/dashboard/projects");

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
