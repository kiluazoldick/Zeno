import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, Landmark, Wallet as WalletIcon } from "lucide-react";

const walletAccounts = [
  {
    id: 1,
    bank: "Ecobank Cameroun",
    last4: "4182",
    balance: "42 450 600",
    icon: Building2,
  },
  {
    id: 2,
    bank: "Société Générale",
    last4: "1004",
    balance: "18 200 110",
    icon: Landmark,
  },
  {
    id: 3,
    bank: "BC-PME",
    last4: "9912",
    balance: "8 450 000",
    icon: WalletIcon,
  },
];

export function Wallet() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Comptes bancaires</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {walletAccounts.map((account) => {
            const Icon = account.icon;
            return (
              <div
                key={account.id}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-sm leading-none">
                      {account.bank} • **** {account.last4}
                    </span>
                  </div>
                  <span className="font-normal text-muted-foreground text-xs">
                    {account.balance} FCFA
                  </span>
                </div>
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-zeno-primary">
                  <Icon className="size-5" />
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Total disponible
            </span>
            <span className="font-medium text-sm">69 100 710 FCFA</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Dernière mise à jour
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
