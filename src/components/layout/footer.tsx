import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                V
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                VisualAI
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Transformez votre marketing visuel avec l&apos;intelligence artificielle. Analysez, optimisez et convertissez.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-semibold mb-4">Produit</h3>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-blue-600">Fonctionnalités</a></li>
                            <li><a href="#" className="hover:text-blue-600">Tarifs</a></li>
                            <li><a href="#" className="hover:text-blue-600">Études de Cas</a></li>
                            <li><a href="#" className="hover:text-blue-600">API</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold mb-4">Entreprise</h3>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-blue-600">À propos</a></li>
                            <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-600">Carrières</a></li>
                            <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold mb-4">Restez Informé</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Recevez les dernières tendances marketing et IA.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Votre email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <Button>S&apos;inscrire</Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} VisualAI. Tous droits réservés. Fait avec ❤️ par l&apos;équipe.
                </div>
            </div>
        </footer>
    );
}
