"use client";

import * as React from "react";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import {
  CONTRAT_PAPER_HEIGHT,
  CONTRAT_PAPER_SCALE,
  CONTRAT_PAPER_WIDTH,
} from "./contrat-data";
import { ContratPaper } from "./contrat-paper";
import { PrintContrat } from "./print-contrat";
import { useVisibleCenterPosition } from "./use-visible-center-position";
import { ContratInput } from "@/lib/validations";

function handlePrint() {
  window.print();
}

export function ContratPreview({ contrat }: { contrat: ContratInput }) {
  const previewBodyRef = React.useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const paperLayout = useVisibleCenterPosition(previewBodyRef, {
    height: CONTRAT_PAPER_HEIGHT,
    maxScale: CONTRAT_PAPER_SCALE,
    width: CONTRAT_PAPER_WIDTH,
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
        toast.error("Impossible de trouver le contrat à exporter");
        return;
      }

      toast.info("Génération du PDF en cours...");

      // Clone propre, hors écran, SANS transform
      const clone = source.cloneNode(true) as HTMLElement;
      clone.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: ${CONTRAT_PAPER_WIDTH}px;
        height: auto;
        min-height: ${CONTRAT_PAPER_HEIGHT}px;
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
        width: CONTRAT_PAPER_WIDTH,
        windowWidth: CONTRAT_PAPER_WIDTH,
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
        (contrat as any)?.numero || (contrat as any)?.reference || "sans-numero";
      pdf.save(`contrat-${numero}.pdf`);
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
      <PrintContrat contrat={contrat} />
      <div className="flex flex-col rounded-xl border bg-card">
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="font-medium text-lg">Aperçu du contrat</h2>
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
              {isLoading ? (
                "Génération..."
              ) : (
                <>
                  <Download className="size-4" />
                  Télécharger PDF
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
              Chargement de l'aperçu
            </div>
          ) : null}
          <div
            style={{
              height: paperLayout
                ? CONTRAT_PAPER_HEIGHT * paperLayout.scale
                : CONTRAT_PAPER_HEIGHT * CONTRAT_PAPER_SCALE,
              top: paperLayout?.top ?? "50%",
              transform:
                paperLayout === null
                  ? "translate(-50%, -50%)"
                  : "translateX(-50%)",
              width: paperLayout
                ? CONTRAT_PAPER_WIDTH * paperLayout.scale
                : CONTRAT_PAPER_WIDTH * CONTRAT_PAPER_SCALE,
            }}
            className="absolute left-1/2 opacity-0 data-[ready=true]:opacity-100"
            data-ready={paperLayout !== null}
          >
            <div
              style={{
                transform: `scale(${paperLayout?.scale ?? CONTRAT_PAPER_SCALE})`,
              }}
              className="origin-top-left"
            >
              <ContratPaper contrat={contrat} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}