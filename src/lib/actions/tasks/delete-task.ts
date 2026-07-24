// src/lib/actions/tasks/delete-task.ts
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: string) {
  try {
    const supabase = await createAdminClient();

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Erreur deleteTask:", error);
      return { error: error.message };
    }

    // Revalider les chemins
    revalidatePath("/dashboard/kanban");
    revalidatePath("/dashboard/tasks");

    return { success: true };
  } catch (error: any) {
    console.error("Erreur deleteTask catch:", error);
    return { error: error.message };
  }
}
