import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, Zap, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface Stats {
    products: {
        total: number;
        published: number;
        lowStock: number;
    };
    orders: {
        total: number;
        pending: number;
        processing: number;
        completed: number;
    };
    revenue: {
        total: string;
    };
    customers: {
        total: number;
    };
    recentOrders: any[];
    lowStockProducts: any[];
}

export default function BackOfficeDashboard() {
    const { data: stats, isLoading } = useQuery<Stats>({
        queryKey: ["/api/shop/stats"],
    });

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
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Back-Office
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Gestion de la boutique Anaros
                            </p>
                        </div>
                        <Link href="/">
                            <Button variant="ghost" className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                Retour au site
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Products Card */}
                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-purple-100">
                                Produits
                            </CardTitle>
                            <Package className="h-5 w-5 text-purple-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.products.total || 0}</div>
                            <p className="text-xs text-purple-100 mt-2">
                                {stats?.products.published || 0} publiés
                            </p>
                            {(stats?.products.lowStock || 0) > 0 && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-yellow-200">
                                    <AlertCircle className="h-3 w-3" />
                                    {stats?.products.lowStock} en stock faible
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Orders Card */}
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100">
                                Commandes
                            </CardTitle>
                            <ShoppingCart className="h-5 w-5 text-blue-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.orders.total || 0}</div>
                            <div className="flex gap-3 mt-2 text-xs text-blue-100">
                                <span>{stats?.orders.pending || 0} en attente</span>
                                <span>{stats?.orders.processing || 0} en cours</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue Card */}
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-green-100">
                                Revenus
                            </CardTitle>
                            <TrendingUp className="h-5 w-5 text-green-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.revenue.total || '0.00'} €</div>
                            <p className="text-xs text-green-100 mt-2">
                                Total des ventes
                            </p>
                        </CardContent>
                    </Card>

                    {/* Customers Card */}
                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-orange-100">
                                Clients
                            </CardTitle>
                            <Users className="h-5 w-5 text-orange-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.customers.total || 0}</div>
                            <p className="text-xs text-orange-100 mt-2">
                                Clients enregistrés
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Link href="/backoffice/products">
                        <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-500 cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl group-hover:text-purple-600 transition-colors">
                                    <Package className="h-6 w-6" />
                                    Gestion des Produits
                                </CardTitle>
                                <CardDescription>
                                    Ajouter, modifier et supprimer des produits
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/backoffice/categories">
                        <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl group-hover:text-blue-600 transition-colors">
                                    <Package className="h-6 w-6" />
                                    Gestion des Catégories
                                </CardTitle>
                                <CardDescription>
                                    Organiser les produits par catégories
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/backoffice/orders">
                        <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl group-hover:text-green-600 transition-colors">
                                    <ShoppingCart className="h-6 w-6" />
                                    Gestion des Commandes
                                </CardTitle>
                                <CardDescription>
                                    Suivre et gérer les commandes clients
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/backoffice/customers">
                        <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-500 cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl group-hover:text-orange-600 transition-colors">
                                    <Users className="h-6 w-6" />
                                    Gestion des Clients
                                </CardTitle>
                                <CardDescription>
                                    Voir et gérer les informations clients
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/backoffice/news">
                        <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-500 cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl group-hover:text-amber-600 transition-colors">
                                    <Zap className="h-6 w-6" />
                                    Actualités & Événements
                                </CardTitle>
                                <CardDescription>
                                    Gérer les annonces et événements
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/backoffice/gallery">
                        <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-pink-500 cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl group-hover:text-pink-600 transition-colors">
                                    <Palette className="h-6 w-6" />
                                    Gestion de la Galerie
                                </CardTitle>
                                <CardDescription>
                                    Gérer les images et vidéos de l'institut
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>

                {/* Recent Orders & Low Stock */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Commandes Récentes</CardTitle>
                            <CardDescription>Les 5 dernières commandes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentOrders.map((order: any) => (
                                        <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <div>
                                                <p className="font-medium">{order.orderNumber}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">{order.total} €</p>
                                                <Badge variant={
                                                    order.status === 'delivered' ? 'default' :
                                                        order.status === 'processing' ? 'secondary' :
                                                            'outline'
                                                }>
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                                    Aucune commande récente
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Low Stock Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                Produits en Stock Faible
                            </CardTitle>
                            <CardDescription>Produits nécessitant un réapprovisionnement</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.lowStockProducts.map((product: any) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    SKU: {product.sku || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="destructive">
                                                    {product.stock} en stock
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                                    Tous les produits ont un stock suffisant
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
