import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Eye, Package } from "lucide-react";
import { Link } from "wouter";
import type { Order, Customer } from "@shared/schema";

export default function OrdersManagement() {
    const { data: orders, isLoading } = useQuery<Order[]>({
        queryKey: ["/api/orders"],
    });

    const { data: customers } = useQuery<Customer[]>({
        queryKey: ["/api/customers"],
    });

    const getCustomerName = (customerId: string) => {
        const customer = customers?.find((c) => c.id === customerId);
        return customer ? `${customer.firstName} ${customer.lastName}` : "Client inconnu";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "default";
            case "shipped":
                return "secondary";
            case "processing":
                return "outline";
            case "cancelled":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "pending":
                return "En attente";
            case "processing":
                return "En cours";
            case "shipped":
                return "Expédié";
            case "delivered":
                return "Livré";
            case "cancelled":
                return "Annulé";
            default:
                return status;
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "default";
            case "pending":
                return "outline";
            case "failed":
            case "refunded":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getPaymentStatusLabel = (status: string) => {
        switch (status) {
            case "pending":
                return "En attente";
            case "paid":
                return "Payé";
            case "failed":
                return "Échoué";
            case "refunded":
                return "Remboursé";
            default:
                return status;
        }
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
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Gestion des Commandes
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    {orders?.length || 0} commande(s) au total
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des commandes</CardTitle>
                        <CardDescription>Suivez et gérez toutes les commandes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>N° Commande</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Montant</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Paiement</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders && orders.length > 0 ? (
                                    orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-green-600" />
                                                    {order.orderNumber}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getCustomerName(order.customerId)}</TableCell>
                                            <TableCell>
                                                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell className="font-bold">{order.total} €</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusColor(order.status)}>
                                                    {getStatusLabel(order.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                                                    {getPaymentStatusLabel(order.paymentStatus)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-slate-600">
                                            Aucune commande pour le moment
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
