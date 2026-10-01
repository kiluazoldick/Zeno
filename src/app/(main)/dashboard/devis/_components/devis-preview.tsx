// src/app/(main)/dashboard/devis/_components/devis-preview.tsx
"use client";

import * as React from "react";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import {
  DEVIS_PAPER_HEIGHT,
  DEVIS_PAPER_SCALE,
  DEVIS_PAPER_WIDTH,
  type DevisFormValues,
} from "./devis-data";
import { DevisPaper } from "./devis-paper";
import { PrintDevis } from "./print-devis";
import { useVisibleCenterPosition } from "./use-visible-center-position";
import html2canvas from "html2canvas-pro";

function handlePrint() {
  window.print();
}

export function DevisPreview({ devis }: { devis: DevisFormValues }) {
  const previewBodyRef = React.useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const paperLayout = useVisibleCenterPosition(previewBodyRef, {
    height: DEVIS_PAPER_HEIGHT,
    maxScale: DEVIS_PAPER_SCALE,
    width: DEVIS_PAPER_WIDTH,
  });

  // const handleDownloadPDF = async () => {
  //   setIsLoading(true);
  //   try {
  //     const html2canvas = (await import("html2canvas-pro")).default;
  //     const { jsPDF } = await import("jspdf");

  //     const element = document.querySelector(
  //       "[data-print-paper]",
  //     ) as HTMLElement;
  //     if (!element) {
  //       toast.error("Impossible de générer le PDF");
  //       return;
  //     }

  //     toast.info("Génération du PDF en cours...");

  //     const canvas = await html2canvas(element, {
  //       scale: 2,
  //       useCORS: true,
  //       logging: false,
  //       backgroundColor: "#ffffff",
  //       width: DEVIS_PAPER_WIDTH,
  //       height: DEVIS_PAPER_HEIGHT,
  //     });

  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save(`devis-${devis.numero || "sans-numero"}.pdf`);
  //     toast.success("PDF téléchargé avec succès");
  //   } catch (error: any) {
  //     console.error("Erreur PDF:", error);
  //     toast.error(
  //       "Erreur: " + (error.message || "Impossible de générer le PDF"),
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleDownloadPDF = async () => {
  setIsLoading(true);
  try {
    const html2canvas = (await import("html2canvas-pro")).default;
    const { jsPDF } = await import("jspdf");

    const source = document.querySelector(
      "[data-print-paper]",
    ) as HTMLElement | null;

    if (!source) {
      toast.error("Impossible de trouver le devis à exporter");
      return;
    }

    toast.info("Génération du PDF en cours...");

    // Clone propre, hors écran, SANS transform
    const clone = source.cloneNode(true) as HTMLElement;
    clone.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: ${DEVIS_PAPER_WIDTH}px;
      height: auto;
      min-height: ${DEVIS_PAPER_HEIGHT}px;
      transform: none !important;
      scale: 1 !important;
      opacity: 1 !important;
      background-color: #ffffff;
      color: #000000;
      z-index: -1;
      pointer-events: none;
    `;

    // Annule aussi les transforms sur les enfants
    clone.querySelectorAll("*").forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.transform = "none";
      htmlEl.style.scale = "1";
    });

    document.body.appendChild(clone);

    // Laisse le navigateur appliquer les styles
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: DEVIS_PAPER_WIDTH,
      windowWidth: DEVIS_PAPER_WIDTH,
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

    pdf.save(`devis-${devis.numero || "sans-numero"}.pdf`);
    toast.success("PDF téléchargé avec succès");
  } catch (error: any) {
    console.error("Erreur PDF:", error);
    toast.error(
      "Erreur: " + (error.message || "Impossible de générer le PDF"),
    );
  } finally {
    setIsLoading(false);
  }
};
  return (
    <>
      <PrintDevis devis={devis} />
      <div className="flex flex-col rounded-xl border bg-card">
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="font-medium text-lg">Aperçu du devis</h2>
          <ButtonGroup>
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="size-4" />
              Imprimer
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={isLoading}
            >
              {isLoading ? "Génération..." : <Download className="size-4" />}
              {isLoading ? "Génération..." : "PDF"}
            </Button>
          </ButtonGroup>
        </div>

        <div
          ref={previewBodyRef}
          className="@container/preview relative min-h-[calc(100svh-15rem)] flex-1 rounded-b-xl bg-stone-200 p-4 dark:bg-stone-800"
        >
          {paperLayout === null ? (
            <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">
              Chargement de l'aperçu
            </div>
          ) : null}
          <div
            style={{
              height: paperLayout
                ? DEVIS_PAPER_HEIGHT * paperLayout.scale
                : DEVIS_PAPER_HEIGHT * DEVIS_PAPER_SCALE,
              top: paperLayout?.top ?? "50%",
              transform:
                paperLayout === null
                  ? "translate(-50%, -50%)"
                  : "translateX(-50%)",
              width: paperLayout
                ? DEVIS_PAPER_WIDTH * paperLayout.scale
                : DEVIS_PAPER_WIDTH * DEVIS_PAPER_SCALE,
            }}
            className="absolute left-1/2 opacity-0 data-[ready=true]:opacity-100"
            data-ready={paperLayout !== null}
          >
            <div
              style={{
                transform: `scale(${paperLayout?.scale ?? DEVIS_PAPER_SCALE})`,
              }}
              className="origin-top-left"
            >
              <DevisPaper devis={devis} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
