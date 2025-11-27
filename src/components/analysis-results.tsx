'use client';

import React from 'react';
import { AnalysisResult } from '@/types';
import { CheckCircle2, XCircle, Lightbulb, Copy, Check, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const [copied, setCopied] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const componentRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!componentRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(componentRef.current, {
        scale: 2, // Better resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`VisualAI-Analysis-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = () => {
    const text = `
Score: ${result.score}/100
Résumé: ${result.summary}

Forces:
${result.strengths.map(s => `- ${s}`).join('\n')}

Faiblesses:
${result.weaknesses.map(w => `- ${w}`).join('\n')}

Recommandations:
${result.recommendations.map(r => `- [${r.category}] ${r.suggestion}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div ref={componentRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-gray-950 p-4 md:p-8 rounded-xl">

      {/* Header & Score */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold mb-2">Analyse Complète</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl">
            {result.summary}
          </p>
        </div>
        <div className={cn("flex flex-col items-center justify-center p-4 rounded-2xl border-2 min-w-[120px]", getScoreColor(result.score))}>
          <span className="text-4xl font-extrabold">{result.score}</span>
          <span className="text-xs font-medium uppercase tracking-wider">Score</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 bg-green-50/50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400 mb-4">
            <CheckCircle2 className="w-5 h-5" /> Forces
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-6 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-400 mb-4">
            <XCircle className="w-5 h-5" /> Faiblesses
          </h3>
          <ul className="space-y-3">
            {result.weaknesses.map((weakness, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 dark:text-blue-400 mb-6">
          <Lightbulb className="w-5 h-5" /> Recommandations Stratégiques
        </h3>
        <div className="space-y-4">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
              <div className={cn(
                "w-1 h-full rounded-full shrink-0",
                rec.impact === 'high' ? "bg-red-500" : rec.impact === 'medium' ? "bg-yellow-500" : "bg-blue-500"
              )} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-md">
                    {rec.category}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    Impact {rec.impact === 'high' ? 'Élevé' : rec.impact === 'medium' ? 'Moyen' : 'Faible'}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {rec.suggestion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Specifics */}
      {result.platformSpecifics && (
        <div className="p-6 bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/20">
          <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-4 capitalize">
            Conseils pour {result.platformSpecifics.platform}
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.platformSpecifics.tips?.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-3 rounded-lg border border-purple-100 dark:border-purple-900/30">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-center gap-4 pt-4 print:hidden">
        <Button
          variant="outline"
          onClick={copyToClipboard}
          className="gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copié !" : "Copier le rapport"}
        </Button>

        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isDownloading ? "Génération..." : "Télécharger PDF"}
        </Button>
      </div>
    </div>
  );
}
