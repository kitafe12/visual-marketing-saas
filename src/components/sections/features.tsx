'use client';
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Layout, BarChart3 } from 'lucide-react';

const features = [
    {
        title: "Analyse IA Instantanée",
        description: "Obtenez une analyse complète des forces et faiblesses de vos visuels en quelques secondes.",
        icon: Zap,
        className: "md:col-span-2",
        bg: "bg-blue-50 dark:bg-blue-900/10"
    },
    {
        title: "Optimisation Plateforme",
        description: "Conseils sur mesure pour les algorithmes Instagram, TikTok et LinkedIn.",
        icon: Layout,
        className: "md:col-span-1",
        bg: "bg-purple-50 dark:bg-purple-900/10"
    },
    {
        title: "Recommandations Stratégiques",
        description: "Conseils actionnables sur les couleurs, la composition et les accroches pour booster la conversion.",
        icon: Target,
        className: "md:col-span-1",
        bg: "bg-pink-50 dark:bg-pink-900/10"
    },
    {
        title: "Score de Performance",
        description: "Sachez exactement où vous vous situez grâce à notre score d'impact propriétaire.",
        icon: BarChart3,
        className: "md:col-span-2",
        bg: "bg-green-50 dark:bg-green-900/10"
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Tout ce dont vous avez besoin pour <br /> dominer votre niche</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Arrêtez de vous fier à votre instinct. Utilisez des insights basés sur la data pour créer du contenu qui performe vraiment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 rounded-3xl border border-gray-100 dark:border-gray-800 ${feature.className} ${feature.bg} hover:shadow-lg transition-shadow`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center mb-6">
                                <feature.icon className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
