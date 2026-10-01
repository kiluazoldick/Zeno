// print-contrat.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { ContratPaper } from "./contrat-paper";
import { ContratInput } from "@/lib/validations/contrat.schema";
import { CONTRAT_PAPER_WIDTH } from "./contrat-data";

export function PrintContrat({ contrat }: { contrat: ContratInput }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      data-print-root
      style={{
        // Caché à l'écran, visible à l'impression / pour le PDF
        position: "fixed",
        left: "-9999px",
        top: 0,
        width: CONTRAT_PAPER_WIDTH,
        backgroundColor: "#ffffff",
        color: "#000000",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <ContratPaper contrat={contrat} />
    </div>,
    document.body,
  );
}