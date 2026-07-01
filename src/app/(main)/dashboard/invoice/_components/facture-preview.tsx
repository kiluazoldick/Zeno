"use client";

import * as React from "react";

import { Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { FACTURE_PAPER_HEIGHT, FACTURE_PAPER_SCALE, FACTURE_PAPER_WIDTH, type FactureFormValues } from "./facture-data";
import { FacturePaper } from "./facture-paper";
import { PrintFacture } from "./print-facture";
import { useVisibleCenterPosition } from "./use-visible-center-position";

function handlePrint() {
  window.print();
}

export function FacturePreview({ facture }: { facture: FactureFormValues }) {
  const previewBodyRef = React.useRef<HTMLDivElement>(null);
  const paperLayout = useVisibleCenterPosition(previewBodyRef, {
    height: FACTURE_PAPER_HEIGHT,
    maxScale: FACTURE_PAPER_SCALE,
    width: FACTURE_PAPER_WIDTH,
  });

  return (
    <>
      <PrintFacture facture={facture} />
      <div className="flex flex-col rounded-xl border bg-card">
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="font-medium text-lg">Aperçu de la facture</h2>
          <ButtonGroup>
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="size-4" />
              Imprimer
            </Button>
            <Button type="button" variant="outline">
              <Download className="size-4" />
              Télécharger PDF
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
                ? FACTURE_PAPER_HEIGHT * paperLayout.scale
                : FACTURE_PAPER_HEIGHT * FACTURE_PAPER_SCALE,
              top: paperLayout?.top ?? "50%",
              transform: paperLayout === null ? "translate(-50%, -50%)" : "translateX(-50%)",
              width: paperLayout ? FACTURE_PAPER_WIDTH * paperLayout.scale : FACTURE_PAPER_WIDTH * FACTURE_PAPER_SCALE,
            }}
            className="absolute left-1/2 opacity-0 data-[ready=true]:opacity-100"
            data-ready={paperLayout !== null}
          >
            <div
              style={{
                transform: `scale(${paperLayout?.scale ?? FACTURE_PAPER_SCALE})`,
              }}
              className="origin-top-left"
            >
              <FacturePaper facture={facture} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
