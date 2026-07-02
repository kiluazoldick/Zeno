import {
  Banknote,
  ChevronRight,
  FileText,
  History,
  MoreHorizontal,
  Plus,
  SendHorizontal,
  TrendingUp,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

const contacts = [
  { id: 1, initials: "ND", name: "Nanga D." },
  { id: 2, initials: "SM", name: "Sarah M." },
  { id: 3, initials: "JK", name: "Jean K." },
  { id: 4, initials: "ML", name: "Marie L." },
];

const shortcuts = [
  { id: 1, label: "Nouveau paiement", icon: Banknote },
  { id: 2, label: "Nouveau devis", icon: FileText },
  { id: 3, label: "Nouvelle facture", icon: Plus },
  { id: 4, label: "Transfert", icon: SendHorizontal },
  { id: 5, label: "Historique", icon: History },
  { id: 6, label: "Rapport mensuel", icon: TrendingUp },
  { id: 7, label: "Clients", icon: Users },
  { id: 8, label: "Plus", icon: MoreHorizontal },
];

export function QuickActions() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal">Transfert rapide</CardTitle>
          <CardAction>
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {contacts.map((contact) => (
                  <Avatar
                    key={contact.id}
                    className="size-7 border-2 border-background"
                  >
                    <AvatarFallback className="text-[10px]">
                      {contact.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <ChevronRight className="size-4" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Field orientation="horizontal">
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>FCFA</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput placeholder="0" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>XAF</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Button className="bg-zeno-primary hover:bg-zeno-primary/90">
              Envoyer
            </Button>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal">Raccourcis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <div
                  key={shortcut.id}
                  className="flex flex-col items-center gap-2.5"
                >
                  <Button
                    variant="outline"
                    className="size-12 rounded-full hover:border-zeno-primary hover:text-zeno-primary"
                  >
                    <Icon className="size-5" />
                  </Button>
                  <span className="text-center text-muted-foreground text-xs">
                    {shortcut.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
