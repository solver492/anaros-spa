import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ArrowLeft, Image as ImageIcon, Upload, X, Palette, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Gallery } from "@shared/schema";
import { supabase } from "@/lib/supabase";
import { apiRequest } from "@/lib/queryClient";

export default function GalleryManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Gallery | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: gallery, isLoading } = useQuery<Gallery[]>({
        queryKey: ["/api/gallery"],
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/gallery", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
            toast({ title: "Image ajoutée avec succès" });
            setIsDialogOpen(false);
            setImageUrl(null);
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await apiRequest("PUT", `/api/gallery/${id}`, data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
            toast({ title: "Image mise à jour avec succès" });
            setIsDialogOpen(false);
            setEditingItem(null);
            setImageUrl(null);
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await apiRequest("DELETE", `/api/gallery/${id}`);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
            toast({ title: "Image supprimée avec succès" });
        },
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        try {
            const { error } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setImageUrl(publicUrl);
        } catch (error: any) {
            toast({
                title: "Erreur d'upload",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            imageUrl: imageUrl,
            caption: formData.get("caption") as string,
            displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
            published: formData.get("published") === "on",
        };

        if (editingItem) {
            updateMutation.mutate({ id: editingItem.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const openEditDialog = (item: Gallery) => {
        setEditingItem(item);
        setImageUrl(item.imageUrl);
        setIsDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/backoffice">
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Palette className="h-5 w-5 text-amber-500" /> Gestion de la Galerie
                                </h1>
                            </div>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setEditingItem(null); setImageUrl(null); }} className="bg-amber-600 hover:bg-amber-700 shadow-md">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Ajouter une Image
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-serif">
                                        {editingItem ? "Modifier l'image" : "Ajouter à la galerie"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Optimisez votre galerie en ajoutant des photos de vos soins et de l'institut.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                    <div className="space-y-4">
                                        <Label>Image *</Label>
                                        <div className="relative aspect-square rounded-lg overflow-hidden border bg-slate-100 group flex items-center justify-center">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-16 w-16 text-slate-300" />
                                            )}
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="absolute"
                                                disabled={isUploading}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                {isUploading ? <Loader2 className="animate-spin h-4 w-4" /> : <Upload className="h-4 w-4 mr-2" />}
                                                {imageUrl ? "Changer" : "Uploader"}
                                            </Button>
                                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="caption">Légende</Label>
                                            <Input id="caption" name="caption" defaultValue={editingItem?.caption || ""} placeholder="Optionnel" />
                                        </div>
                                        <div>
                                            <Label htmlFor="displayOrder">Ordre d'affichage</Label>
                                            <Input id="displayOrder" name="displayOrder" type="number" defaultValue={editingItem?.displayOrder || 0} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="published" name="published" defaultChecked={editingItem?.published ?? true} className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500" />
                                            <Label htmlFor="published" className="cursor-pointer">Publier sur le site</Label>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                                        <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={createMutation.isPending || updateMutation.isPending || !imageUrl}>
                                            {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {editingItem ? "Enregistrer" : "Ajouter"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {gallery?.map((item) => (
                        <Card key={item.id} className="overflow-hidden group border-none shadow-lg bg-white dark:bg-slate-900">
                            <div className="aspect-square relative">
                                <img src={item.imageUrl} alt={item.caption || ""} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary" onClick={() => openEditDialog(item)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive" onClick={() => { if (confirm("Supprimer?")) deleteMutation.mutate(item.id) }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                {!item.published && (
                                    <Badge className="absolute top-2 right-2 bg-slate-500">Brouillon</Badge>
                                )}
                            </div>
                            {item.caption && (
                                <div className="p-3 text-sm font-medium line-clamp-1 border-t border-slate-100 dark:border-slate-800">
                                    {item.caption}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
                {(!gallery || gallery.length === 0) && (
                    <div className="text-center py-20 text-slate-400 font-serif italic bg-white dark:bg-slate-900 rounded-xl shadow-inner">
                        La galerie est vide.
                    </div>
                )}
            </main>
        </div>
    );
}
