import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader2, Lock, User, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

const formSchema = z.object({
    username: z.string().min(1, "L'identifiant est requis"),
    password: z.string().min(1, "Le mot de passe est requis"),
});

export default function AuthPage() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const loginMutation = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const res = await apiRequest("POST", "/api/login", data);
            return await res.json();
        },
        onSuccess: (user) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({
                title: "Bienvenue !",
                description: "Vous êtes maintenant connecté au backoffice.",
            });
            setLocation("/backoffice");
        },
        onError: (error: Error) => {
            toast({
                title: "Échec de la connexion",
                description: "Identifiants invalides ou erreur serveur.",
                variant: "destructive",
            });
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        loginMutation.mutate(values);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070')] bg-cover bg-center">
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl text-white">
                    <CardContent className="pt-8 px-8 pb-10">
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                            >
                                <Lock className="w-10 h-10 text-white" />
                            </motion.div>
                            <h1 className="text-3xl font-serif font-bold tracking-tight">ANAROS</h1>
                            <p className="text-amber-100 font-medium tracking-widest text-xs uppercase mt-1">Beauty Lounge • Backoffice</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-amber-100 text-xs font-semibold uppercase">Identifiant</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-200/50" />
                                                    <Input
                                                        placeholder="nom@exemple.com"
                                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pl-10 h-12 focus-visible:ring-amber-500/50"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-300" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-amber-100 text-xs font-semibold uppercase">Mot de passe</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-200/50" />
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pl-10 h-12 focus-visible:ring-amber-500/50"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-300" />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold h-12 shadow-inner group overflow-hidden relative"
                                    disabled={loginMutation.isPending}
                                >
                                    <div className="absolute inset-0 w-3 bg-white/20 -skew-x-12 -translate-x-10 group-hover:translate-x-96 transition-transform duration-1000 ease-in-out"></div>
                                    {loginMutation.isPending ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Se Connecter <Sparkles className="w-4 h-4" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-8 text-center">
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">Accès réservé au personnel autorisé</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
