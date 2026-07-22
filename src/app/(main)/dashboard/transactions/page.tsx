"use client";

import {
  useTransactions,
  useCurrentMonthTransactions,
} from "@/hooks/queries/use-transactions";
import { Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TransactionKpi } from "./_components/transaction-kpi";
import { TransactionCard } from "./_components/transaction-card";
import { CashFlowOverview } from "./_components/cash-flow-overview";
import { SpendingBreakdown } from "./_components/spending-breakdown";
import { IncomeReliability } from "./_components/income-reliability";

export default function Page() {
  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useTransactions({
    includeProjet: true,
    includeResponsable: true,
  });

  const { data: currentMonthData, isLoading: monthLoading } =
    useCurrentMonthTransactions();

  const isLoading = transactionsLoading || monthLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (transactionsError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <span>
            Erreur lors du chargement des transactions:{" "}
            {transactionsError.message}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-1 mb-4">
        <h1 className="text-3xl tracking-tight">Transactions</h1>
        <p className="text-muted-foreground text-sm">
          Gérez vos paiements, cartes et transactions
        </p>
      </div>

      <Tabs className="gap-4" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger disabled value="activity">
            Activité
          </TabsTrigger>
          <TabsTrigger disabled value="insights">
            Analyses
          </TabsTrigger>
          <TabsTrigger disabled value="utilities">
            Utilitaires
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex flex-col gap-4 **:data-[slot=card]:shadow-xs">
            <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:gap-2 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              <TransactionKpi transactions={transactions || []} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="flex flex-col gap-4">
                <CashFlowOverview data={currentMonthData || []} />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <SpendingBreakdown transactions={transactions || []} />
                  <IncomeReliability transactions={transactions || []} />
                </div>
              </div>
              <TransactionCard transactions={transactions || []} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
