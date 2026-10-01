"use client";

import * as React from "react";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import {
  INVOICE_PAPER_HEIGHT,
  INVOICE_PAPER_SCALE,
  INVOICE_PAPER_WIDTH,
  type InvoiceFormValues,
} from "./data";
import { InvoicePaper } from "./invoice-paper";
import { PrintInvoice } from "./print-invoice";
import { useVisibleCenterPosition } from "./use-visible-center-position";

function handlePrint() {
  window.print();
}

export function InvoicePreview({ invoice }: { invoice: InvoiceFormValues }) {
  const previewBodyRef = React.useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const paperLayout = useVisibleCenterPosition(previewBodyRef, {
    height: INVOICE_PAPER_HEIGHT,
    maxScale: INVOICE_PAPER_SCALE,
    width: INVOICE_PAPER_WIDTH,
  });

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const source = document.querySelector(
        "[data-print-paper]",
      ) as HTMLElement | null;

      if (!source) {
        toast.error("Unable to find invoice to export");
        return;
      }

      toast.info("Generating PDF...");

      const clone = source.cloneNode(true) as HTMLElement;
      clone.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: ${INVOICE_PAPER_WIDTH}px;
        height: auto;
        min-height: ${INVOICE_PAPER_HEIGHT}px;
        transform: none !important;
        scale: 1 !important;
        opacity: 1 !important;
        background-color: #ffffff;
        color: #000000;
        z-index: -1;
        pointer-events: none;
      `;

      clone.querySelectorAll("*").forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.transform = "none";
        htmlEl.style.scale = "1";
      });

      document.body.appendChild(clone);
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: INVOICE_PAPER_WIDTH,
        windowWidth: INVOICE_PAPER_WIDTH,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const numero =
        (invoice as any)?.numero ||
        (invoice as any)?.invoiceNumber ||
        (invoice as any)?.number ||
        "sans-numero";
      pdf.save(`invoice-${numero}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error: any) {
      console.error("PDF Error:", error);
      toast.error(
        "Error: " + (error.message || "Unable to generate PDF"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PrintInvoice invoice={invoice} />
      <div className="flex flex-col rounded-xl border bg-card">
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="font-medium text-lg">Preview</h2>
          <ButtonGroup>
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer data-icon="inline-start" />
              Print
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={isLoading}
            >
              {isLoading ? (
                "Generating..."
              ) : (
                <>
                  <Download data-icon="inline-start" />
                  Download PDF
                </>
              )}
            </Button>
          </ButtonGroup>
        </div>

        <div
          ref={previewBodyRef}
          className="@container/preview relative min-h-[calc(100svh-15rem)] flex-1 rounded-b-xl bg-stone-200 p-4 dark:bg-stone-800"
        >
          {paperLayout === null ? (
            <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">
              Loading Preview
            </div>
          ) : null}
          <div
            style={{
              height: paperLayout
                ? INVOICE_PAPER_HEIGHT * paperLayout.scale
                : INVOICE_PAPER_HEIGHT * INVOICE_PAPER_SCALE,
              top: paperLayout?.top ?? "50%",
              transform:
                paperLayout === null
                  ? "translate(-50%, -50%)"
                  : "translateX(-50%)",
              width: paperLayout
                ? INVOICE_PAPER_WIDTH * paperLayout.scale
                : INVOICE_PAPER_WIDTH * INVOICE_PAPER_SCALE,
            }}
            className="absolute left-1/2 opacity-0 data-[ready=true]:opacity-100"
            data-ready={paperLayout !== null}
          >
            <div
              style={{
                transform: `scale(${paperLayout?.scale ?? INVOICE_PAPER_SCALE})`,
              }}
              className="origin-top-left"
            >
              <InvoicePaper invoice={invoice} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}