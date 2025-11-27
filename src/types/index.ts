export interface Recommendation {
    category: 'style' | 'content' | 'structure' | 'color';
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: Recommendation[];
    platformSpecifics?: {
        platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'facebook';
        tips: string[];
    };
}

export interface UploadedFile {
    id: string;
    url: string;
    name: string;
    type: 'image' | 'video';
    createdAt: Date;
}
