import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const mockClients = [
    { id: "c1", nom: "UBA Cameroun", email: "contact@ubacam.com", telephone: "+237670123456", adresse: "Douala", type: "B2B", secteur_activite: "Finance", notes: "Banque majeure" },
    { id: "c2", nom: "MTN Cameroon", email: "business@mtn.cm", telephone: "+237699123456", adresse: "Yaoundé", type: "B2B", secteur_activite: "Télécommunications", notes: "Opérateur télécom" },
    { id: "c3", nom: "Nestlé Cameroun", email: "info@nestle.cm", telephone: "+237222123456", adresse: "Douala", type: "B2B", secteur_activite: "Agro-alimentaire", notes: "Industrie alimentaire" },
    { id: "c4", nom: "Jean Dupont", email: "jean.dupont@email.com", telephone: "+237675123456", adresse: "Yaoundé", type: "B2C", secteur_activite: "Particulier", notes: "Client particulier" },
    { id: "c5", nom: "Société SARL Tech", email: "tech@sarl.cm", telephone: "+237680123456", adresse: "Buea", type: "B2B", secteur_activite: "Technologie", notes: "Startup IT" },
    { id: "c6", nom: "Hôtel Hilton", email: "booking@hilton-cam.com", telephone: "+237222456789", adresse: "Yaoundé", type: "B2B", secteur_activite: "Hôtellerie", notes: "Chaîne hôtelière" },
    { id: "c7", nom: "École Privée ABC", email: "admin@ecoleabc.cm", telephone: "+237699789456", adresse: "Douala", type: "B2B", secteur_activite: "Éducation", notes: "Établissement scolaire" },
  ];
  
  return NextResponse.json(mockClients);
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
      .from("clients")
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
