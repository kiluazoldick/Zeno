"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMember(data: any) {
  const adminClient = await createAdminClient();

  console.log("Tentative de création du membre:", data);

  try {
    // Vérifier que le rôle est valide
    const validRoles = [
      "direction",
      "finance",
      "commercial",
      "terrain",
      "bureau",
      "admin",
    ];
    const role = data.role?.toLowerCase() || "terrain";

    if (!validRoles.includes(role)) {
      console.error("Rôle invalide:", role);
      return {
        success: false,
        error: `Rôle invalide. Valeurs autorisées: ${validRoles.join(", ")}`,
      };
    }

    const { data: member, error } = await adminClient
      .from("members")
      .insert({
        id: crypto.randomUUID(),
        email: data.email,
        nom: data.name,
        prenom: data.prenom || null,
        role: role,
        equipe: data.team || null,
        status: data.status || "Actif",
        joined_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur insertion membre:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("Membre créé avec succès:", member);

    revalidatePath("/dashboard/users");

    return {
      success: true,
      data: member,
    };
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
    };
  }
}
