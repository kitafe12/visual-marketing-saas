import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function TeamPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Mon Équipe</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Gérez les membres de votre équipe et leurs permissions.
                </p>
            </div>

            {/* Upsell for Business Plan */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-medium mb-6">
                        ✨ Fonctionnalité Business
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Collaborez avec votre équipe
                    </h2>

                    <p className="text-gray-300 mb-8 max-w-xl">
                        Invitez vos collègues, partagez vos analyses et créez une bibliothèque de contenu commune.
                        Disponible uniquement avec le plan Business.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-blue-400" />
                                Jusqu&apos;à 5 membres d&apos;équipe
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-blue-400" />
                                Rôles et permissions avancés
                            </li>
                        </ul>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-blue-400" />
                                Partage d&apos;analyses en un clic
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-blue-400" />
                                Commentaires et feedback
                            </li>
                        </ul>
                    </div>

                    <Link href="/#pricing">
                        <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                            Passer au plan Business
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
