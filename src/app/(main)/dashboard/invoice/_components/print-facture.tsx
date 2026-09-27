"use client";

import * as React from "react";

import { createPortal } from "react-dom";

import type { InvoiceFormValues } from "@/lib/validations/invoice.schema";
import { InvoicePaper } from "./invoice-paper";

export function PrintFacture({ facture }: { facture: InvoiceFormValues }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-print-root>
      <InvoicePaper invoice={facture} />
    </div>,
    document.body,
  );
}
