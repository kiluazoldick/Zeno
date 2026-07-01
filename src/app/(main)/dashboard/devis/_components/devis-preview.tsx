"use client";

import * as React from "react";

import { Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { DEVIS_PAPER_HEIGHT, DEVIS_PAPER_SCALE, DEVIS_PAPER_WIDTH, type DevisFormValues } from "./devis-data";
import { DevisPaper } from "./devis-paper";
import { PrintDevis } from "./print-devis";
import { useVisibleCenterPosition } from "./use-visible-center-position";

function handlePrint() {
  window.print();
}

export function DevisPreview({ devis }: { devis: DevisFormValues }) {
  const previewBodyRef = React.useRef<HTMLDivElement>(null);
  const paperLayout = useVisibleCenterPosition(previewBodyRef, {
    height: DEVIS_PAPER_HEIGHT,
    maxScale: DEVIS_PAPER_SCALE,
    width: DEVIS_PAPER_WIDTH,
  });

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
              height: paperLayout ? DEVIS_PAPER_HEIGHT * paperLayout.scale : DEVIS_PAPER_HEIGHT * DEVIS_PAPER_SCALE,
              top: paperLayout?.top ?? "50%",
              transform: paperLayout === null ? "translate(-50%, -50%)" : "translateX(-50%)",
              width: paperLayout ? DEVIS_PAPER_WIDTH * paperLayout.scale : DEVIS_PAPER_WIDTH * DEVIS_PAPER_SCALE,
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
