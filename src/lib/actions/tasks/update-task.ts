// src/lib/actions/tasks/update-task.ts
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTask(id: string, data: any) {
  try {
    const supabase = await createAdminClient();

    console.log("📝 updateTask - ID:", id);
    console.log("📝 updateTask - Data:", JSON.stringify(data, null, 2));

    // Nettoyer les données : supprimer les champs undefined
    const cleanData: any = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        // Si c'est une chaîne vide, on la garde si c'est un champ texte
        if (data[key] === "" && (key === "description" || key === "lieu")) {
          cleanData[key] = null;
        } else if (data[key] !== "") {
          cleanData[key] = data[key];
        }
      }
    });

    console.log(
      "📝 updateTask - CleanData:",
      JSON.stringify(cleanData, null, 2),
    );

    const { error } = await supabase
      .from("tasks")
      .update(cleanData)
      .eq("id", id);

    if (error) {
      console.error("❌ Erreur updateTask:", error);
      return { error: error.message };
    }

    // Revalider les chemins
    revalidatePath("/dashboard/kanban");
    revalidatePath("/dashboard/tasks");

    console.log("✅ updateTask - Succès pour l'ID:", id);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Erreur updateTask catch:", error);
    return { error: error.message };
  }
}
