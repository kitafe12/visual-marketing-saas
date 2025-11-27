'use client';

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const plans = [
    {
        name: "Starter",
        price: "Gratuit",
        description: "Parfait pour tester.",
        features: ["5 Analyses par mois", "Score Basique", "Support Standard"],
        cta: "Commencer Gratuitement",
        popular: false
    },
    {
        name: "Pro",
        price: "29€",
        period: "/mois",
        description: "Pour les créateurs sérieux.",
        features: ["Analyses Illimitées", "Recommandations Détaillées", "Conseils par Plateforme", "Support Prioritaire"],
        cta: "Passer Pro",
        popular: true
    },
    {
        name: "Business",
        price: "99€",
        period: "/mois",
        description: "Pour les agences et équipes.",
        features: ["Tout dans Pro", "Accès API", "Gestion d'Équipe", "Rapports Personnalisés"],
        cta: "Contacter les Ventes",
        popular: false
    }
];

export function Pricing() {
    const { isSignedIn } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async (planName: string) => {
        if (planName === "Starter") {
            router.push('/sign-up');
            return;
        }

        if (planName === "Pro") {
            if (!isSignedIn) {
                router.push('/sign-up');
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch('/api/payments/create-checkout', { method: 'POST' });
                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    console.error('Checkout error:', data.error);
                }
            } catch (error) {
                console.error('Checkout failed:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <section id="pricing" className="py-24 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Tarifs Simples et Transparents</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Commencez gratuitement, upgradez quand vous êtes prêt à scaler.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative p-8 rounded-3xl border ${plan.popular
                                ? "border-blue-600 shadow-2xl scale-105 bg-white dark:bg-gray-900 z-10"
                                : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
                                    Le Plus Populaire
                                </div>
                            )}
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-extrabold">{plan.price}</span>
                                {plan.period && <span className="text-gray-500">{plan.period}</span>}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{plan.description}</p>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm">
                                        <Check className="w-4 h-4 text-blue-600" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                                variant={plan.popular ? "default" : "outline"}
                                onClick={() => handleCheckout(plan.name)}
                                disabled={isLoading && plan.name === "Pro"}
                            >
                                {isLoading && plan.name === "Pro" ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Chargement...
                                    </>
                                ) : (
                                    plan.cta
                                )}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
