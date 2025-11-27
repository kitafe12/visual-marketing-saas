'use client';

import React, { useState } from 'react';
import { UploadZone } from '@/components/upload-zone';
import { AnalysisResults } from '@/components/analysis-results';
import { AnalysisResult } from '@/types';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Simple reusable label component
const FormLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {children}
    </label>
);

export default function DashboardPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [file, setFile] = useState<File | null>(null);
    const [platform, setPlatform] = useState('');
    const [fonts, setFonts] = useState('');
    const [colors, setColors] = useState('');
    const [description, setDescription] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(true);

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setShowAdvanced(true);
        // Reset result when new file is selected
        setResult(null);
        setError(null);
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                const base64Image = reader.result as string;

                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: base64Image,
                        context: {
                            platform,
                            fonts,
                            colors,
                            description
                        }
                    }),
                });

                if (!response.ok) {
                    if (response.status === 403) {
                        // Limit reached
                        window.location.href = '/#pricing';
                        return;
                    }
                    throw new Error('Analysis failed');
                }

                const data = await response.json();
                setResult(data);
            };

            reader.onerror = () => {
                throw new Error('Failed to read file');
            };

        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue lors de l'analyse. Veuillez réessayer.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold mb-2">Nouvelle Analyse</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Téléchargez votre visuel et ajoutez du contexte pour une analyse ultra-personnalisée.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <UploadZone onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
                </div>

                {file && (
                    <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 animate-in slide-in-from-top-4">
                        <div
                            className="flex items-center justify-between mb-6 cursor-pointer group"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                                Personnaliser l&apos;analyse
                            </h3>
                            <Button variant="ghost" size="sm" className="text-gray-500">
                                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                        </div>

                        {showAdvanced && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                                <div className="space-y-4">
                                    <div>
                                        <FormLabel>Plateforme Cible</FormLabel>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-600"
                                            value={platform}
                                            onChange={(e) => setPlatform(e.target.value)}
                                        >
                                            <option value="">Sélectionner une plateforme...</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="linkedin">LinkedIn</option>
                                            <option value="youtube">YouTube</option>
                                            <option value="facebook">Facebook</option>
                                        </select>
                                    </div>
                                    <div>
                                        <FormLabel>Couleurs de la marque</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Ex: Bleu #0000FF, Blanc"
                                            value={colors}
                                            onChange={(e) => setColors(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <FormLabel>Police / Typographie</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Ex: Sans-serif, Moderne, Helvetica"
                                            value={fonts}
                                            onChange={(e) => setFonts(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <FormLabel>Description / Contexte supplémentaire</FormLabel>
                                        <textarea
                                            placeholder="Ajoutez des détails sur votre objectif, votre audience, etc."
                                            className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-600"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <Button
                                size="lg"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyse en cours...
                                    </>
                                ) : (
                                    "Lancer l'Analyse"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {isAnalyzing && !file && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        Analyse de votre visuel en cours...
                    </p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center">
                    {error}
                </div>
            )}

            {result && <AnalysisResults result={result} />}
        </div>
    );
}
