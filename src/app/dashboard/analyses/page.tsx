import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { AnalysisResult } from '@/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function AnalysesPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let analyses: any[] = [];
    try {
        analyses = await prisma.analysis.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error('AnalysesPage: DB Fetch Error:', error);
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Mes Analyses</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Retrouvez l&apos;historique de vos analyses.
                </p>
            </div>

            {analyses.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Aucune analyse enregistrée
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                        Lancez votre première analyse pour voir apparaître vos résultats ici.
                    </p>
                    <Link href="/dashboard" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Nouvelle Analyse
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analyses.map((analysis) => {
                        const result = analysis.result as unknown as AnalysisResult;
                        return (
                            <Link href={`/dashboard/analyses/${analysis.id}`} key={analysis.id} className="block group">
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                                    <div className="p-6 space-y-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${analysis.score >= 80 ? 'bg-green-100 text-green-700' :
                                                analysis.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                Score: {analysis.score}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {format(new Date(analysis.createdAt), 'd MMM yyyy', { locale: fr })}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                                            {analysis.summary}
                                        </p>

                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <div className="flex flex-wrap gap-2">
                                                {result.strengths.slice(0, 2).map((s, i) => (
                                                    <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs">
                                                        ✅ {s.substring(0, 20)}...
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        Voir le détail →
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
