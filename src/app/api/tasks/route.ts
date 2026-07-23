import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const mockTasks = [
    { id: "t1", titre: "Intégration API Stripe", description: "Mettre en place le paiement", statut: "À faire", priorite: "Haute", date_execution: "2025-02-15", projet_id: "proj_001" },
    { id: "t2", titre: "Design UI mobile", description: "Créer les maquettes", statut: "En cours", priorite: "Haute", date_execution: "2025-02-10", projet_id: "proj_001" },
    { id: "t3", titre: "Tests unitaires", description: "Couvrir 80% du code", statut: "À faire", priorite: "Moyenne", date_execution: "2025-02-20", projet_id: "proj_002" },
    { id: "t4", titre: "Documentation API", description: "Écrire la doc API REST", statut: "En cours", priorite: "Basse", date_execution: "2025-02-25", projet_id: "proj_001" },
    { id: "t5", titre: "Meeting client", description: "Présenter les livrables", statut: "Fait", priorite: "Haute", date_execution: "2025-02-05", projet_id: "proj_002" },
  ];
  
  return NextResponse.json(mockTasks);
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration" },
        { status: 500 }
      );
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
        },
      },
    });

    const body = await request.json();

    const { data, error } = await supabase
      .from("tasks")
      .insert([body])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
