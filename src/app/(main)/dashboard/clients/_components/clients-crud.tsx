"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  type?: "B2B" | "B2C";
  secteur_activite?: string;
  notes?: string;
}

interface ClientsCrudProps {
  initialClients: Client[];
  onRefresh: () => void;
}

export function ClientsCrud({ initialClients, onRefresh }: ClientsCrudProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    type: "B2B" as "B2B" | "B2C",
    secteur_activite: "",
    notes: "",
  });
  const { toast } = useToast();

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        nom: client.nom,
        email: client.email || "",
        telephone: client.telephone || "",
        adresse: client.adresse || "",
        type: client.type || "B2B",
        secteur_activite: client.secteur_activite || "",
        notes: client.notes || "",
      });
    } else {
      setEditingClient(null);
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        adresse: "",
        type: "B2B",
        secteur_activite: "",
        notes: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nom.trim()) {
      toast({ title: "Erreur", description: "Le nom est requis", variant: "destructive" });
      return;
    }

    try {
      if (editingClient) {
        const response = await fetch(`/api/clients/${editingClient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const updated = await response.json();
          setClients(clients.map((c) => (c.id === editingClient.id ? updated : c)));
          toast({ title: "Succès", description: "Client mis à jour" });
        }
      } else {
        const response = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const newClient = await response.json();
          setClients([...clients, newClient]);
          toast({ title: "Succès", description: "Client créé" });
        }
      }
      setDialogOpen(false);
      onRefresh();
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de l'enregistrement", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;

    try {
      const response = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (response.ok) {
        setClients(clients.filter((c) => c.id !== id));
        toast({ title: "Succès", description: "Client supprimé" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Clients</h3>
        <Button onClick={() => handleOpenDialog()} className="gap-2 bg-zeno-primary">
          <Plus className="h-4 w-4" />
          Nouveau client
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Secteur</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.nom}</TableCell>
                  <TableCell>{client.email || "-"}</TableCell>
                  <TableCell>{client.telephone || "-"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${client.type === "B2B" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                      {client.type}
                    </span>
                  </TableCell>
                  <TableCell>{client.secteur_activite || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleOpenDialog(client)} className="h-8 w-8 p-0">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(client.id)} className="h-8 w-8 p-0 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Aucun client trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? "Modifier le client" : "Nouveau client"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom *</label>
              <Input value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} placeholder="Nom du client" required />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" placeholder="Email" />
            </div>

            <div>
              <label className="text-sm font-medium">Téléphone</label>
              <Input value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} placeholder="Téléphone" />
            </div>

            <div>
              <label className="text-sm font-medium">Adresse</label>
              <Input value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} placeholder="Adresse" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as "B2B" | "B2C" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B">Entreprise (B2B)</SelectItem>
                    <SelectItem value="B2C">Particulier (B2C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Secteur</label>
                <Input value={formData.secteur_activite} onChange={(e) => setFormData({ ...formData, secteur_activite: e.target.value })} placeholder="Secteur" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-zeno-primary">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
