import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Edit, Trash2, ArrowLeft, Image as ImageIcon, Upload, X, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Product, Category } from "@shared/schema";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://bkyhsfgkvprmtnsaattn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJreWhzZmdrdnBybXRuc2FhdHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzU0MTEsImV4cCI6MjA4Mjg1MTQxMX0.86prBjO5Suk6mMZ7l2XZjjIKnIuivV5NIFeK4ATcOs8";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProductsManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productImages, setProductImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery<Product[]>({
        queryKey: ["/api/products"],
    });

    const { data: categories } = useQuery<Category[]>({
        queryKey: ["/api/categories"],
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Erreur lors de la création");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/products"] });
            queryClient.invalidateQueries({ queryKey: ["/api/shop/stats"] });
            toast({ title: "Produit créé avec succès" });
            setIsDialogOpen(false);
            setProductImages([]);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Erreur lors de la mise à jour");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/products"] });
            queryClient.invalidateQueries({ queryKey: ["/api/shop/stats"] });
            toast({ title: "Produit mis à jour avec succès" });
            setIsDialogOpen(false);
            setEditingProduct(null);
            setProductImages([]);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erreur lors de la suppression");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/products"] });
            queryClient.invalidateQueries({ queryKey: ["/api/shop/stats"] });
            toast({ title: "Produit supprimé avec succès" });
        },
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newImages = [...productImages];

        for (const file of Array.from(files)) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `products/${fileName}`;

            try {
                const { data, error } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                newImages.push(publicUrl);
            } catch (error: any) {
                toast({
                    title: "Erreur d'upload",
                    description: error.message,
                    variant: "destructive"
                });
            }
        }

        setProductImages(newImages);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index: number) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            slug: formData.get("slug") as string,
            description: formData.get("description") as string,
            shortDescription: formData.get("shortDescription") as string,
            price: formData.get("price") as string,
            compareAtPrice: formData.get("compareAtPrice") as string || null,
            cost: formData.get("cost") as string || null,
            sku: formData.get("sku") as string,
            stock: parseInt(formData.get("stock") as string),
            lowStockThreshold: parseInt(formData.get("lowStockThreshold") as string) || 5,
            categoryId: formData.get("categoryId") as string || null,
            published: formData.get("published") === "on",
            featured: formData.get("featured") === "on",
            images: productImages,
        };

        if (editingProduct) {
            updateMutation.mutate({ id: editingProduct.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setProductImages(product.images || []);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingProduct(null);
        setProductImages([]);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/backoffice">
                                <a className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                                </a>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-amber-500" /> Gestion des Produits
                                </h1>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter">
                                    {products?.length || 0} articles en ligne
                                </p>
                            </div>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setEditingProduct(null); setProductImages([]); }} className="bg-amber-600 hover:bg-amber-700 shadow-md">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nouveau Produit
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-serif">
                                        {editingProduct ? "Modifier l'article" : "Créer un nouvel article"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Détails complets de votre produit pour la boutique
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column: Media */}
                                        <div className="space-y-4">
                                            <Label className="text-xs font-bold uppercase text-slate-500">Photos du produit</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {productImages.map((url, i) => (
                                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-slate-100 group">
                                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(i)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isUploading}
                                                    className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:border-amber-500 hover:bg-amber-50 transition-all group"
                                                >
                                                    {isUploading ? (
                                                        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                                                    ) : (
                                                        <>
                                                            <Upload className="h-6 w-6 text-slate-400 group-hover:text-amber-500" />
                                                            <span className="text-[10px] text-slate-500 group-hover:text-amber-600 mt-1 uppercase font-bold">Ajouter</span>
                                                        </>
                                                    )}
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    multiple
                                                    accept="image/*"
                                                />
                                            </div>

                                            <div className="space-y-4 pt-4">
                                                <div>
                                                    <Label htmlFor="name">Nom de l'article *</Label>
                                                    <Input id="name" name="name" defaultValue={editingProduct?.name} required />
                                                </div>
                                                <div>
                                                    <Label htmlFor="slug">Identifiant URL (Slug) *</Label>
                                                    <Input id="slug" name="slug" defaultValue={editingProduct?.slug} required placeholder="ex: soin-visage-eclat" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="shortDescription">Accroche commerciale</Label>
                                                    <Input id="shortDescription" name="shortDescription" defaultValue={editingProduct?.shortDescription || ""} placeholder="Une phrase courte..." />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Pricing & Details */}
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="price">Prix (€) *</Label>
                                                    <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required />
                                                </div>
                                                <div>
                                                    <Label htmlFor="compareAtPrice">Ancien prix (€)</Label>
                                                    <Input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" defaultValue={editingProduct?.compareAtPrice || ""} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="stock">Quantité stock *</Label>
                                                    <Input id="stock" name="stock" type="number" defaultValue={editingProduct?.stock || 0} required />
                                                </div>
                                                <div>
                                                    <Label htmlFor="sku">Référence (SKU)</Label>
                                                    <Input id="sku" name="sku" defaultValue={editingProduct?.sku || ""} />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="categoryId">Catégorie</Label>
                                                <select
                                                    id="categoryId"
                                                    name="categoryId"
                                                    defaultValue={editingProduct?.categoryId || ""}
                                                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 text-sm h-10 border-slate-200"
                                                >
                                                    <option value="">Sélectionner une catégorie</option>
                                                    {categories?.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <Label htmlFor="description">Description détaillée</Label>
                                                <Textarea id="description" name="description" defaultValue={editingProduct?.description || ""} rows={5} className="resize-none" />
                                            </div>

                                            <div className="flex gap-6 items-center pt-2">
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="published" name="published" defaultChecked={editingProduct?.published ?? true} className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500" />
                                                    <Label htmlFor="published" className="cursor-pointer">Publié</Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="featured" name="featured" defaultChecked={editingProduct?.featured ?? false} className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500" />
                                                    <Label htmlFor="featured" className="cursor-pointer">Mettre en avant</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t font-medium">
                                        <Button type="button" variant="ghost" onClick={closeDialog}>Annuler</Button>
                                        <Button type="submit" className="bg-amber-600 hover:bg-amber-700 px-8">
                                            {editingProduct ? "Enregistrer les modifications" : "Créer le produit"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <Card className="border-none shadow-xl overflow-hidden rounded-xl bg-white dark:bg-slate-900">
                    <CardHeader className="bg-slate-100/50 dark:bg-slate-800/50 px-6 py-4">
                        <CardTitle className="text-lg font-serif">Inventaire</CardTitle>
                        <CardDescription>Visualisez et gérez votre catalogue complet</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="w-[80px]"></TableHead>
                                    <TableHead>Produit</TableHead>
                                    <TableHead>SKU / Ref</TableHead>
                                    <TableHead>Prix</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products && products.length > 0 ? (
                                    products.map((product) => (
                                        <TableRow key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <TableCell>
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border shadow-sm">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <ImageIcon className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-slate-700 dark:text-slate-200">
                                                <div>
                                                    {product.name}
                                                    {product.featured && (
                                                        <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700 hover:bg-purple-100 border-none px-1.5 py-0 text-[10px]">
                                                            ⭐ VEDETTE
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{product.slug}</div>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500 font-medium">{product.sku || "—"}</TableCell>
                                            <TableCell className="font-bold text-amber-600">{product.price} €</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={product.stock <= (product.lowStockThreshold || 5) ? "destructive" : "outline"}
                                                    className="font-mono"
                                                >
                                                    {product.stock}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {product.published ? (
                                                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> EN LIGNE
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                            <div className="w-2 h-2 rounded-full bg-slate-300"></div> BROUILLON
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="outline" size="sm" onClick={() => openEditDialog(product)} className="h-8 w-8 p-0 rounded-full">
                                                        <Edit className="h-4 w-4 text-slate-600" />
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => { if (confirm("Supprimer définitivement cet article ?")) deleteMutation.mutate(product.id); }} className="h-8 w-8 p-0 rounded-full bg-red-50/10 hover:bg-red-500 text-red-500 hover:text-white border-red-100">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-20 text-slate-400 font-serif italic">
                                            Aucun produit répertorié. Commencez par en créer un !
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
