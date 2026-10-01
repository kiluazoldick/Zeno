// print-invoice.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import type { InvoiceFormValues } from "./data";
import { InvoicePaper } from "./invoice-paper";
import { INVOICE_PAPER_WIDTH } from "./data";

export function PrintInvoice({ invoice }: { invoice: InvoiceFormValues }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      data-print-root
      style={{
        position: "fixed",
        left: "-9999px",
        top: 0,
        width: INVOICE_PAPER_WIDTH,
        backgroundColor: "#ffffff",
        color: "#000000",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <InvoicePaper invoice={invoice} />
    </div>,
    document.body,
  );
}