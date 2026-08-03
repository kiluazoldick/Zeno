// src/lib/actions/devis/delete-devi.ts
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteDeviSchema = z.object({
  id: z.string().uuid("ID devis invalide"),
});

export async function deleteDevi(id: string) {
  const adminClient = await createAdminClient();

  console.log("🗑️ deleteDevi - ID reçu:", id);

  const validated = deleteDeviSchema.safeParse({ id });

  if (!validated.success) {
    console.error(
      "❌ Validation error:",
      validated.error.flatten().fieldErrors,
    );
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // 1. Vérifier que le devis existe
    const { data: devis, error: checkError } = await adminClient
      .from("devis")
      .select("id, statut, projet_id")
      .eq("id", id)
      .single();

    if (checkError || !devis) {
      console.error("❌ Devis non trouvé:", checkError);
      return {
        success: false,
        error: { notFound: ["Devis non trouvé"] },
      };
    }

    console.log("🗑️ Devis trouvé:", { id: devis.id, statut: devis.statut });

    // 2. Vérifier qu'on ne peut pas supprimer un devis accepté
    if (devis.statut === "Accepté") {
      console.log("⚠️ Devis accepté - suppression impossible");
      return {
        success: false,
        error: { statut: ["Un devis accepté ne peut pas être supprimé"] },
      };
    }

    // 3. Vérifier si le devis est lié à un contrat
    const { data: contrat, error: contratError } = await adminClient
      .from("contrats")
      .select("id")
      .eq("devis_id", id)
      .maybeSingle();

    if (contratError) {
      console.error("❌ Erreur vérification contrat:", contratError);
      return {
        success: false,
        error: { db: [contratError.message] },
      };
    }

    if (contrat) {
      console.log("⚠️ Devis lié à un contrat - suppression impossible");
      return {
        success: false,
        error: {
          relations: [
            "Ce devis est lié à un contrat et ne peut pas être supprimé",
          ],
        },
      };
    }

    // 4. Supprimer le devis
    console.log("🗑️ Suppression du devis:", id);
    const { error } = await adminClient.from("devis").delete().eq("id", id);

    if (error) {
      console.error("❌ Erreur suppression:", error);
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    console.log("✅ Devis supprimé avec succès:", id);

    revalidatePath("/dashboard/devis");
    if (devis.projet_id) {
      revalidatePath(`/dashboard/projects/${devis.projet_id}`);
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("❌ Erreur inattendue:", error);
    return {
      success: false,
      error: {
        unexpected: [error.message || "Une erreur inattendue s'est produite"],
      },
    };
  }
}
