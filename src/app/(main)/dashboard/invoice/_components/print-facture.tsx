"use client";

import * as React from "react";

import { createPortal } from "react-dom";

import type { FactureFormValues } from "./facture-data";
import { FacturePaper } from "./facture-paper";

export function PrintFacture({ facture }: { facture: FactureFormValues }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-print-root>
      <FacturePaper facture={facture} />
    </div>,
    document.body,
  );
}
