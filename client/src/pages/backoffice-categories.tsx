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
import { Plus, Edit, Trash2, ArrowLeft, FolderOpen } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@shared/schema";

export default function CategoriesManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: categories, isLoading } = useQuery<Category[]>({
        queryKey: ["/api/categories"],
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Erreur lors de la création");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            toast({ title: "Catégorie créée avec succès" });
            setIsDialogOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await fetch(`/api/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Erreur lors de la mise à jour");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            toast({ title: "Catégorie mise à jour avec succès" });
            setIsDialogOpen(false);
            setEditingCategory(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erreur lors de la suppression");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            toast({ title: "Catégorie supprimée avec succès" });
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            slug: formData.get("slug") as string,
            description: formData.get("description") as string || null,
            image: formData.get("image") as string || null,
            parentId: formData.get("parentId") as string || null,
        };

        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingCategory(null);
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
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Gestion des Catégories
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    {categories?.length || 0} catégorie(s) au total
                                </p>
                            </div>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setEditingCategory(null)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Nouvelle Catégorie
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Remplissez les informations de la catégorie
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Nom de la catégorie *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={editingCategory?.name}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="slug">Slug (URL) *</Label>
                                        <Input
                                            id="slug"
                                            name="slug"
                                            defaultValue={editingCategory?.slug}
                                            required
                                            placeholder="ma-categorie"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            defaultValue={editingCategory?.description || ""}
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="image">URL de l'image</Label>
                                        <Input
                                            id="image"
                                            name="image"
                                            type="url"
                                            defaultValue={editingCategory?.image || ""}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="parentId">Catégorie parente</Label>
                                        <select
                                            id="parentId"
                                            name="parentId"
                                            defaultValue={editingCategory?.parentId || ""}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                                        >
                                            <option value="">Aucune (catégorie principale)</option>
                                            {categories
                                                ?.filter((cat) => cat.id !== editingCategory?.id)
                                                .map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button type="button" variant="outline" onClick={closeDialog}>
                                            Annuler
                                        </Button>
                                        <Button type="submit">
                                            {editingCategory ? "Mettre à jour" : "Créer"}
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
                        <CardTitle>Liste des catégories</CardTitle>
                        <CardDescription>Organisez vos produits par catégories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Catégorie parente</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories && categories.length > 0 ? (
                                    categories.map((category) => {
                                        const parentCategory = categories.find(
                                            (cat) => cat.id === category.parentId
                                        );
                                        return (
                                            <TableRow key={category.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <FolderOpen className="h-4 w-4 text-blue-600" />
                                                        {category.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    {category.slug}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {category.description || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {parentCategory ? parentCategory.name : "-"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEditDialog(category)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        "Êtes-vous sûr de vouloir supprimer cette catégorie ?"
                                                                    )
                                                                ) {
                                                                    deleteMutation.mutate(category.id);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-slate-600">
                                            Aucune catégorie. Créez votre première catégorie !
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
