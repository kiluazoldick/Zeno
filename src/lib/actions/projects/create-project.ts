"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  projectSchema,
  type ProjectInput,
} from "@/lib/validations/project.schema";
import { revalidatePath } from "next/cache";

export async function createProject(data: ProjectInput) {
  const adminClient = await createAdminClient();

  // Valider les données
  const validated = projectSchema.safeParse(data);

  if (!validated.success) {
    console.error("Validation error:", validated.error.flatten().fieldErrors);
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const documents = data.documents ?? [];
    const oversizedDocument = documents.find(
      (document) => document.size > 10 * 1024 * 1024,
    );

    if (oversizedDocument) {
      return {
        success: false,
        error: {
          documents: [`${oversizedDocument.name} dépasse la limite de 10 Mo`],
        },
      };
    }

    const projectId = crypto.randomUUID();
    const uploadedDocuments: Array<{
      name: string;
      path: string;
      url: string;
      type: string;
    }> = [];

    for (const document of documents) {
      const extension = document.name.includes(".")
        ? document.name.split(".").pop()?.toLowerCase() || "bin"
        : "bin";
      const path = `${projectId}/${crypto.randomUUID()}.${extension}`;
      const fileBuffer = Buffer.from(await document.arrayBuffer());
      const { error: uploadError } = await adminClient.storage
        .from("project-documents")
        .upload(path, fileBuffer, {
          contentType: document.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        await adminClient.storage
          .from("project-documents")
          .remove(uploadedDocuments.map((uploaded) => uploaded.path));
        return { success: false, error: { documents: [uploadError.message] } };
      }

      const { data: publicUrl } = adminClient.storage
        .from("project-documents")
        .getPublicUrl(path);
      uploadedDocuments.push({
        name: document.name,
        path,
        url: publicUrl.publicUrl,
        type: document.type || "application/octet-stream",
      });
    }

    // Vérifier que le client existe si fourni
    if (validated.data.client_id) {
      const { data: client, error: clientError } = await adminClient
        .from("clients")
        .select("id")
        .eq("id", validated.data.client_id)
        .single();

      if (clientError || !client) {
        return {
          success: false,
          error: { client_id: ["Client non trouvé"] },
        };
      }
    }

    // Déterminer la progression initiale en fonction du statut
    let progression = 0;
    if (validated.data.statut === "Terminé") {
      progression = 100;
    } else if (validated.data.statut === "Annulé") {
      progression = 0;
    }

    // Créer le projet
    const { data: project, error } = await adminClient
      .from("projects")
      .insert({
        id: projectId,
        nom: validated.data.nom,
        client_id: validated.data.client_id || null,
        description: validated.data.description || null,
        statut: validated.data.statut || "En cours",
        priorite: validated.data.priorite || "Moyenne",
        budget_total: validated.data.budget_total || null,
        date_debut: validated.data.date_debut || null,
        date_fin: validated.data.date_fin || null,
        progression: progression,
        location: validated.data.location || null,
        documents: uploadedDocuments,
      })
      .select()
      .single();

    if (error) {
      await adminClient.storage
        .from("project-documents")
        .remove(uploadedDocuments.map((uploaded) => uploaded.path));
      console.error("Erreur createProject:", error);
      return {
        success: false,
        error: { db: [error.message] },
      };
    }

    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard/default");

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return {
      success: false,
      error: { unexpected: ["Une erreur inattendue s'est produite"] },
    };
  }
}
