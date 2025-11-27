'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileType, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
    isAnalyzing: boolean;
}

export function UploadZone({ onFileSelect, isAnalyzing }: UploadZoneProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);
        const file = acceptedFiles[0];

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError("Le fichier est trop volumineux (max 5MB)");
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onFileSelect(file);
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        },
        maxFiles: 1,
        disabled: isAnalyzing
    });

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        setError(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out cursor-pointer",
                    isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600",
                    isAnalyzing && "opacity-50 cursor-not-allowed",
                    preview ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-950"
                )}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative flex flex-col items-center">
                        <Image
                            src={preview}
                            alt="Preview"
                            width={300}
                            height={300}
                            className="max-h-64 w-auto rounded-lg shadow-md object-contain mb-4"
                        />
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={clearFile}
                            className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                            disabled={isAnalyzing}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isAnalyzing ? "Analyse en cours..." : "Cliquez ou glissez pour remplacer"}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                            <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {isDragActive ? "Déposez le fichier ici" : "Glissez votre image ici"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                ou cliquez pour parcourir
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 border px-3 py-1 rounded-full">
                            <FileType className="w-3 h-3" />
                            <span>JPG, PNG, WEBP (Max 5MB)</span>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm animate-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </div>
    );
}
