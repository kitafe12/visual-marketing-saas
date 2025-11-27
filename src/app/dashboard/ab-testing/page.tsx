'use client';

import React, { useState } from 'react';
import { UploadZone } from '@/components/upload-zone';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, ArrowRight, CheckCircle2, AlertCircle, Split } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonResult {
    winner: 'A' | 'B';
    scoreA: number;
    scoreB: number;
    reasoning: string;
    keyDiffs: string[];
}

export default function ABTestingPage() {
    const [imageA, setImageA] = useState<File | null>(null);
    const [imageB, setImageB] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ComparisonResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageA = (file: File) => setImageA(file);
    const handleImageB = (file: File) => setImageB(file);

    const handleCompare = async () => {
        if (!imageA || !imageB) return;

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('imageA', imageA);
            formData.append('imageB', imageB);

            const response = await fetch('/api/compare', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Comparison failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue lors de l'analyse. Veuillez réessayer.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold mb-2">A/B Testing Prédictif</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Comparez deux visuels et découvrez lequel performera le mieux avant même de le publier.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Image A */}
                <div className={cn("space-y-4 p-6 rounded-2xl border-2 transition-all",
                    result?.winner === 'A' ? "border-green-500 bg-green-50/50 dark:bg-green-900/10" : "border-dashed border-gray-200 dark:border-gray-800"
                )}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">A</span>
                            Visuel A
                        </h2>
                        {result?.winner === 'A' && <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />}
                    </div>
                    <UploadZone onFileSelect={handleImageA} isAnalyzing={isAnalyzing} />
                    {result && (
                        <div className="mt-4 text-center">
                            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{result.scoreA}</span>
                            <span className="text-sm text-gray-500 ml-1">/100</span>
                        </div>
                    )}
                </div>

                {/* Image B */}
                <div className={cn("space-y-4 p-6 rounded-2xl border-2 transition-all",
                    result?.winner === 'B' ? "border-green-500 bg-green-50/50 dark:bg-green-900/10" : "border-dashed border-gray-200 dark:border-gray-800"
                )}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">B</span>
                            Visuel B
                        </h2>
                        {result?.winner === 'B' && <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />}
                    </div>
                    <UploadZone onFileSelect={handleImageB} isAnalyzing={isAnalyzing} />
                    {result && (
                        <div className="mt-4 text-center">
                            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{result.scoreB}</span>
                            <span className="text-sm text-gray-500 ml-1">/100</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center">
                <Button
                    size="lg"
                    onClick={handleCompare}
                    disabled={!imageA || !imageB || isAnalyzing}
                    className="w-full md:w-auto min-w-[200px] text-lg h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyse en cours...
                        </>
                    ) : (
                        <>
                            Lancer le Comparatif <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 justify-center">
                    <AlertCircle className="w-5 h-5" /> {error}
                </div>
            )}

            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                    {/* Winner Banner */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center shadow-xl">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
                            Le Vainqueur est le Visuel {result.winner}
                        </h3>
                        <p className="text-green-50 text-lg max-w-2xl mx-auto">
                            Avec un score de {result.winner === 'A' ? result.scoreA : result.scoreB}/100, il surpasse l&apos;autre version grâce à une meilleure clarté et un impact émotionnel plus fort.
                        </p>
                    </div>

                    {/* Analysis Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" /> Pourquoi ce choix ?
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {result.reasoning}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Split className="w-5 h-5 text-purple-600" /> Différences Clés
                            </h4>
                            <ul className="space-y-3">
                                {result.keyDiffs.map((diff, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                        {diff}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
