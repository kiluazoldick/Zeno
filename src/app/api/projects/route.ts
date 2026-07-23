import { NextRequest, NextResponse } from "next/server";

let mockProjects = [
  {
    id: "proj_001",
    nom: "Application Mobile UBA",
    client_id: "client_001",
    description: "Développement d'une application mobile",
    statut: "En cours",
    priorite: "Haute",
    budget: 55000000,
    lieu: "Douala",
    date_debut: "2025-01-15",
  },
  {
    id: "proj_002",
    nom: "Plateforme E-commerce",
    client_id: "client_002",
    description: "Plateforme de vente en ligne",
    statut: "En attente",
    priorite: "Moyenne",
    budget: 25000000,
    lieu: "Yaoundé",
    date_debut: "2025-02-01",
  },
];

export async function GET(request: NextRequest) {
  return NextResponse.json(mockProjects);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProject = {
      id: `proj_${Date.now()}`,
      ...body,
    };
    mockProjects.push(newProject);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}


