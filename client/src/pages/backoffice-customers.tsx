import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, ArrowLeft, User, Mail, Phone } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@shared/schema";

export default function CustomersManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: customers, isLoading } = useQuery<Customer[]>({
        queryKey: ["/api/customers"],
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Erreur lors de la création");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
            queryClient.invalidateQueries({ queryKey: ["/api/shop/stats"] });
            toast({ title: "Client créé avec succès" });
            setIsDialogOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await fetch(`/api/customers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Erreur lors de la mise à jour");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
            toast({ title: "Client mis à jour avec succès" });
            setIsDialogOpen(false);
            setEditingCustomer(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erreur lors de la suppression");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
            queryClient.invalidateQueries({ queryKey: ["/api/shop/stats"] });
            toast({ title: "Client supprimé avec succès" });
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get("email") as string,
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            phone: formData.get("phone") as string || null,
            company: formData.get("company") as string || null,
            address: formData.get("address") as string || null,
            city: formData.get("city") as string || null,
            postalCode: formData.get("postalCode") as string || null,
            country: formData.get("country") as string || "France",
            notes: formData.get("notes") as string || null,
        };

        if (editingCustomer) {
            updateMutation.mutate({ id: editingCustomer.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const openEditDialog = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingCustomer(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/backoffice">
                                <a className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <ArrowLeft className="h-5 w-5" />
                                </a>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                    Gestion des Clients
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    {customers?.length || 0} client(s) au total
                                </p>
                            </div>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setEditingCustomer(null)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Nouveau Client
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingCustomer ? "Modifier le client" : "Nouveau client"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Remplissez les informations du client
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName">Prénom *</Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                defaultValue={editingCustomer?.firstName}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Nom *</Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                defaultValue={editingCustomer?.lastName}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                defaultValue={editingCustomer?.email}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                defaultValue={editingCustomer?.phone || ""}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="company">Entreprise</Label>
                                            <Input
                                                id="company"
                                                name="company"
                                                defaultValue={editingCustomer?.company || ""}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label htmlFor="address">Adresse</Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                defaultValue={editingCustomer?.address || ""}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="city">Ville</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                defaultValue={editingCustomer?.city || ""}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="postalCode">Code postal</Label>
                                            <Input
                                                id="postalCode"
                                                name="postalCode"
                                                defaultValue={editingCustomer?.postalCode || ""}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label htmlFor="country">Pays</Label>
                                            <Input
                                                id="country"
                                                name="country"
                                                defaultValue={editingCustomer?.country || "France"}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label htmlFor="notes">Notes</Label>
                                            <Textarea
                                                id="notes"
                                                name="notes"
                                                defaultValue={editingCustomer?.notes || ""}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button type="button" variant="outline" onClick={closeDialog}>
                                            Annuler
                                        </Button>
                                        <Button type="submit">
                                            {editingCustomer ? "Mettre à jour" : "Créer"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des clients</CardTitle>
                        <CardDescription>Gérez vos clients et leurs informations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Téléphone</TableHead>
                                    <TableHead>Ville</TableHead>
                                    <TableHead>Date d'inscription</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers && customers.length > 0 ? (
                                    customers.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-orange-600" />
                                                    {customer.firstName} {customer.lastName}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Mail className="h-3 w-3" />
                                                    {customer.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {customer.phone ? (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Phone className="h-3 w-3" />
                                                        {customer.phone}
                                                    </div>
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                            <TableCell>{customer.city || "-"}</TableCell>
                                            <TableCell>
                                                {new Date(customer.createdAt).toLocaleDateString("fr-FR")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditDialog(customer)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (
                                                                confirm("Êtes-vous sûr de vouloir supprimer ce client ?")
                                                            ) {
                                                                deleteMutation.mutate(customer.id);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-slate-600">
                                            Aucun client. Créez votre premier client !
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
