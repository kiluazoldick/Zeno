"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteClientSchema = z.object({
  id: z.string().uuid("ID client invalide"),
  cascade: z.boolean().default(false),
});

export async function deleteClient(id: string, cascade: boolean = false) {
  const adminClient = await createAdminClient();

  const validated = deleteClientSchema.safeParse({ id, cascade });

  if (!validated.success) {
    console.error("Validation error:", validated.error.flatten().fieldErrors);
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Vérifier que le client existe
    const { data: client, error: checkError } = await adminClient
      .from("clients")
      .select("id, nom")
      .eq("id", id)
      .single();

    if (checkError || !client) {
      return {
        success: false,
        error: { notFound: ["Client non trouvé"] },
      };
    }

    // Vérifier les relations (projets)
    if (!cascade) {
      const { count: projectsCount, error: projectsError } = await adminClient
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("client_id", id);

      if (projectsError) {
        console.error("Erreur vérification projets:", projectsError);
        return {
          success: false,
          error: { db: [projectsError.message] },
        };
      }

      if (projectsCount && projectsCount > 0) {
        return {
          success: false,
          error: {
            relations: [`Le client a ${projectsCount} projet(s) associé(s).`],
          },
        };
      }
    }

    // Supprimer le client
    const { error } = await adminClient.from("clients").delete().eq("id", id);

    if (error) {
      console.error("Erreur deleteClient:", error);
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    // Revalider tous les chemins
    revalidatePath("/dashboard/crm");
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        id: client.id,
        nom: client.nom,
      },
    };
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
