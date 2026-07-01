"use client";

import * as React from "react";

import { createPortal } from "react-dom";

import type { ContratFormValues } from "./contrat-data";
import { ContratPaper } from "./contrat-paper";

export function PrintContrat({ contrat }: { contrat: ContratFormValues }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-print-root>
      <ContratPaper contrat={contrat} />
    </div>,
    document.body,
  );
}
