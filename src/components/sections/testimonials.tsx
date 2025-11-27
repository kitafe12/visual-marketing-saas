'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "Créatrice de Contenu",
        image: "https://i.pravatar.cc/150?u=sarah",
        content: "VisualAI a complètement changé ma stratégie Instagram. Mon engagement a augmenté de 40% depuis que j'utilise leurs recommandations.",
        stars: 5
    },
    {
        name: "David Chen",
        role: "Directeur Marketing",
        image: "https://i.pravatar.cc/150?u=david",
        content: "La possibilité d'obtenir un feedback instantané sur nos créas avant le lancement nous a fait économiser des milliers d'euros.",
        stars: 5
    },
    {
        name: "Emma Wilson",
        role: "Designer Freelance",
        image: "https://i.pravatar.cc/150?u=emma",
        content: "C'est comme avoir un directeur artistique dans sa poche. Les insights sur la psychologie des couleurs sont justes.",
        stars: 5
    }
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Approuvé par +10,000 Créateurs</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Rejoignez la communauté des marketeurs qui font grandir leur marque avec l&apos;IA.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-gray-950 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.stars)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-6 italic">&quot;{t.content}&quot;</p>
                            <div className="flex items-center gap-4">
                                <Image
                                    src={t.image}
                                    alt={t.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-bold text-sm">{t.name}</h4>
                                    <p className="text-xs text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
