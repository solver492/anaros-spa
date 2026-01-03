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
import { Plus, Edit, Trash2, ArrowLeft, Image as ImageIcon, Upload, X, Zap, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { News } from "@shared/schema";
import { supabase } from "@/lib/supabase";
import { apiRequest } from "@/lib/queryClient";

export default function NewsManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);
    const [newsImage, setNewsImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: news, isLoading } = useQuery<News[]>({
        queryKey: ["/api/news"],
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/news", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/news"] });
            toast({ title: "Article créé avec succès" });
            setIsDialogOpen(false);
            setNewsImage(null);
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
            const res = await apiRequest("PUT", `/api/news/${id}`, data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/news"] });
            toast({ title: "Article mis à jour avec succès" });
            setIsDialogOpen(false);
            setEditingNews(null);
            setNewsImage(null);
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
            const res = await apiRequest("DELETE", `/api/news/${id}`);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/news"] });
            toast({ title: "Article supprimé avec succès" });
        },
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `news/${fileName}`;

        try {
            const { error } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setNewsImage(publicUrl);
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
            title: formData.get("title") as string,
            category: formData.get("category") as string,
            date: formData.get("date") as string,
            excerpt: formData.get("excerpt") as string,
            image: newsImage,
            published: formData.get("published") === "on",
        };

        if (editingNews) {
            updateMutation.mutate({ id: editingNews.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const openEditDialog = (item: News) => {
        setEditingNews(item);
        setNewsImage(item.image);
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
                                    <Zap className="h-5 w-5 text-amber-500" /> Actualités & Événements
                                </h1>
                            </div>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setEditingNews(null); setNewsImage(null); }} className="bg-amber-600 hover:bg-amber-700 shadow-md">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nouvel Article
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-serif">
                                        {editingNews ? "Modifier l'article" : "Créer un nouvel article"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Remplissez les informations ci-dessous pour {editingNews ? "mettre à jour" : "publier"} un article ou événement.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="title">Titre *</Label>
                                                <Input id="title" name="title" defaultValue={editingNews?.title} required />
                                            </div>
                                            <div>
                                                <Label htmlFor="category">Catégorie *</Label>
                                                <Input id="category" name="category" defaultValue={editingNews?.category} placeholder="ex: Nouveau Soin, Événement" required />
                                            </div>
                                            <div>
                                                <Label htmlFor="date">Date d'affichage *</Label>
                                                <Input id="date" name="date" defaultValue={editingNews?.date} placeholder="ex: 10 Septembre 2025" required />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <Label>Image de couverture</Label>
                                            <div className="relative aspect-video rounded-lg overflow-hidden border bg-slate-100 group flex items-center justify-center">
                                                {newsImage ? (
                                                    <img src={newsImage} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="h-12 w-12 text-slate-300" />
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
                                                    {newsImage ? "Changer" : "Uploader"}
                                                </Button>
                                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="excerpt">Résumé / Contenu court *</Label>
                                        <Textarea id="excerpt" name="excerpt" defaultValue={editingNews?.excerpt} rows={4} required />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="published" name="published" defaultChecked={editingNews?.published ?? true} className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500" />
                                        <Label htmlFor="published" className="cursor-pointer">Publier sur le site</Label>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                                        <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={createMutation.isPending || updateMutation.isPending}>
                                            {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {editingNews ? "Enregistrer" : "Créer"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <Card className="overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900">
                    <Table>
                        <TableHeader className="bg-slate-100/50 dark:bg-slate-800/50">
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Titre</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {news?.map((item) => (
                                <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <TableCell className="text-sm text-slate-500">{item.date}</TableCell>
                                    <TableCell className="font-semibold">{item.title}</TableCell>
                                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={item.published ? "default" : "secondary"}>
                                            {item.published ? "Publié" : "Brouillon"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => { if (confirm("Supprimer cet article ?")) deleteMutation.mutate(item.id) }}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!news || news.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-serif italic">
                                        Aucun article pour le moment.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </main>
        </div>
    );
}
