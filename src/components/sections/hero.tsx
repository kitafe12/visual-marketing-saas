'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl mix-blend-multiply animate-blob" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/10 border border-gray-200 dark:border-gray-800 backdrop-blur-sm mb-8"
                >
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Marketing Visuel Propulsé par l&apos;IA
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
                >
                    Arrêtez de deviner. <br />
                    Commencez à <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Convertir.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
                >
                    Votre expert marketing personnel. Importez vos visuels et obtenez des stratégies instantanées basées sur la data pour faire décoller votre engagement sur Instagram, TikTok et LinkedIn.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/dashboard">
                        <Button size="lg" className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all">
                            Analyser mon contenu <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full backdrop-blur-sm bg-white/50 dark:bg-white/5">
                        Voir la démo
                    </Button>
                </motion.div>

                {/* Floating UI Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-20 relative mx-auto max-w-5xl"
                >
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl p-4 md:p-8">
                        <div className="aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden relative group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-gray-400 font-medium">Démo Interactive ci-dessous</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
