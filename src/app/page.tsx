'use client';

import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { Testimonials } from '@/components/sections/testimonials';
import { Pricing } from '@/components/sections/pricing';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      <Navbar />

      <main>
        <Hero />

        {/* CTA Section replacing the old demo */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Prêt à transformer votre marketing ?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de créateurs qui utilisent VisualAI pour optimiser leur contenu.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                Commencer Gratuitement <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        <Features />
        <Testimonials />
        <Pricing />
      </main>

      <Footer />
    </div>
  );
}
