import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database";

// Client Supabase côté serveur (avec cookies)
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Les cookies en lecture seule sont ignorés
          }
        },
      },
    },
  );
}

// Client admin avec service role (pour les opérations serveur uniquement)
export async function createAdminClient() {
  const cookieStore = await cookies();

  // Vérifier que la clé service role est présente
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local");
    throw new Error("Configuration Supabase manquante");
  }

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Les cookies en lecture seule sont ignorés
          }
        },
      },
    },
  );
}
