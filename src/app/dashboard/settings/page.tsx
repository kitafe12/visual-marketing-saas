'use client';

import React from 'react';
import { UserProfile } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handlePortal = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/payments/customer-portal', { method: 'POST' });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Impossible d'accéder au portail. Avez-vous un abonnement actif ?");
            }
        } catch (error) {
            console.error('Portal error:', error);
            alert("Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Gérez vos préférences et votre compte.
                    </p>
                </div>
                <Button
                    onClick={handlePortal}
                    disabled={isLoading}
                    variant="outline"
                    className="gap-2"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    Gérer mon abonnement
                </Button>
                <a href="mailto:support@visualmarketing.com?subject=Feedback%20Visual%20Marketing" className="inline-flex">
                    <Button variant="ghost" className="gap-2">
                        📧 Contacter le support
                    </Button>
                </a>
            </div>

            <div className="flex justify-center">
                <UserProfile />
            </div>
        </div>
    );
}
