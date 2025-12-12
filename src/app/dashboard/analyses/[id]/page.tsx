import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { AnalysisResult } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';


export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AnalysisDetailPage({ params }: PageProps) {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
        redirect('/sign-in');
    }

    const analysis = await prisma.analysis.findUnique({
        where: { id },
    });

    if (!analysis || analysis.userId !== userId) {
        notFound();
    }

    const result = analysis.result as unknown as AnalysisResult;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/analyses">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Détail de l&apos;analyse</h1>
                        <p className="text-gray-500 text-sm">
                            {format(new Date(analysis.createdAt), 'd MMMM yyyy à HH:mm', { locale: fr })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        PDF
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Partager
                    </Button>
                </div>
            </div>

            {/* Re-using the Analysis Results Component */}
            {/* We might need to adapt it slightly or just render the data directly if the component expects state setters */}
            {/* Since AnalysisResults is likely client-side and interactive (for "New Analysis"), we'll render the read-only view here manually for better control or wrap it if it's pure display. */}
            {/* Checking AnalysisResults component... actually let's just render the display parts to avoid complexity with the "New Analysis" button inside it. */}

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Score Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-lg font-medium text-gray-500 mb-2">Score Marketing</h2>
                        <div className="text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                            {result.score}
                            <span className="text-2xl text-gray-400 font-normal">/100</span>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            {result.summary}
                        </p>
                    </div>
                    <div className={`absolute top-0 left-0 w-full h-2 ${result.score >= 80 ? 'bg-green-500' : result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50/50 dark:bg-green-900/10 rounded-2xl p-6 border border-green-100 dark:border-green-900/20">
                        <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
                            ✅ Points Forts
                        </h3>
                        <ul className="space-y-3">
                            {result.strengths.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-green-900 dark:text-green-100">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-red-50/50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/20">
                        <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
                            ⚠️ Points d&apos;amélioration
                        </h3>
                        <ul className="space-y-3">
                            {result.weaknesses.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-red-900 dark:text-red-100">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-6">Recommandations Stratégiques</h3>
                    <div className="grid gap-4">
                        {result.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${rec.impact === 'high' ? 'bg-red-100 text-red-700' :
                                    rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                    {rec.impact}
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                                        {rec.category}
                                    </span>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {rec.suggestion}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
