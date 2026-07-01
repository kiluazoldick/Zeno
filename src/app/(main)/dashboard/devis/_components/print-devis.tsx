"use client";

import * as React from "react";

import { createPortal } from "react-dom";

import type { DevisFormValues } from "./devis-data";
import { DevisPaper } from "./devis-paper";

export function PrintDevis({ devis }: { devis: DevisFormValues }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-print-root>
      <DevisPaper devis={devis} />
    </div>,
    document.body,
  );
}
