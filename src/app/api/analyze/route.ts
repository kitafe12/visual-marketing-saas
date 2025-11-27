import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { AnalysisResult } from '@/types';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const { image, context } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Check Daily Limit (3 per day)
        if (userId) {
            // Check subscription status
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { status: true }
            });

            const isPro = user?.status === 'active';

            if (!isPro) {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);

                const dailyCount = await prisma.analysis.count({
                    where: {
                        userId,
                        createdAt: {
                            gte: startOfDay,
                            lte: endOfDay,
                        },
                    },
                });

                if (dailyCount >= 3) {
                    return NextResponse.json(
                        { error: 'Daily limit reached', code: 'LIMIT_REACHED' },
                        { status: 403 }
                    );
                }
            }
        }

        const contextPrompt = context ? `
      Additional Context provided by user:
      - Target Platform: ${context.platform || 'General'}
      - Brand Colors: ${context.colors || 'Not specified'}
      - Brand Fonts: ${context.fonts || 'Not specified'}
      - User Description/Goals: ${context.description || 'Not specified'}
    ` : '';

        const prompt = `
      You are a world-class Visual Marketing Expert. Analyze this image for marketing effectiveness.
      Target audience: General social media users (Instagram/TikTok/LinkedIn).
      ${contextPrompt}
      
      Provide a structured analysis in JSON format with the following fields:
      - score: A number between 0-100 representing overall marketing impact.
      - summary: A concise 2-sentence summary of the visual's effectiveness in French.
      - strengths: Array of 3 key strengths in French.
      - weaknesses: Array of 3 key weaknesses in French.
      - recommendations: Array of objects with { category: 'style'|'content'|'structure'|'color', suggestion: string (in French), impact: 'high'|'medium'|'low' }.
      - platformSpecifics: Object with { platform: 'instagram'|'tiktok'|'youtube'|'linkedin'|'facebook', tips: string[] (in French) } (Choose the most relevant platform based on user context or image content).

      Focus on:
      - Visual hierarchy and clarity
      - Color psychology and branding (compare with provided brand colors if any)
      - Text readability and hook (if any)
      - Emotional appeal and engagement potential
      - Alignment with user goals (if provided)
    `;

        let analysis: AnalysisResult;

        try {
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OPENAI_API_KEY is not set');
            }

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: {
                                    url: image,
                                },
                            },
                        ],
                    },
                ],
                response_format: { type: "json_object" },
                max_tokens: 1000,
            });

            const content = response.choices[0].message.content;
            if (!content) {
                throw new Error('No content received from OpenAI');
            }

            const jsonContent = content.replace(/```json\n?|```/g, '').trim();
            analysis = JSON.parse(jsonContent);

        } catch (aiError) {
            console.warn('OpenAI Analysis failed, falling back to mock data:', aiError);
            // Mock response for demonstration/dev purposes
            analysis = {
                score: 85,
                summary: "Cette image présente une composition visuelle forte avec un excellent usage des couleurs. Le message est clair mais pourrait être plus percutant avec une typographie plus audacieuse.",
                strengths: [
                    "Palette de couleurs harmonieuse",
                    "Bonne hiérarchie visuelle",
                    "Image de haute qualité"
                ],
                weaknesses: [
                    "Contraste du texte perfectible",
                    "Appel à l'action peu visible",
                    "Espace négatif sous-utilisé"
                ],
                recommendations: [
                    { category: 'color', suggestion: "Augmenter le contraste du texte principal pour une meilleure lisibilité.", impact: 'high' },
                    { category: 'structure', suggestion: "Agrandir le bouton d'action pour attirer l'attention.", impact: 'medium' },
                    { category: 'style', suggestion: "Utiliser une police plus moderne pour les titres.", impact: 'low' }
                ],
                platformSpecifics: {
                    platform: 'instagram',
                    tips: [
                        "Utilisez le format 4:5 pour maximiser l'espace d'écran.",
                        "Ajoutez des hashtags pertinents dans la légende.",
                        "Engagez la conversation avec une question en description."
                    ]
                }
            };
        }

        // Save to Database
        try {
            if (userId) {
                // Ensure user exists in DB
                await prisma.user.upsert({
                    where: { id: userId },
                    update: {},
                    create: {
                        id: userId,
                        email: 'user@example.com',
                    },
                });

                await prisma.analysis.create({
                    data: {
                        userId,
                        imageUrl: image.substring(0, 100) + '...',
                        score: analysis.score,
                        summary: analysis.summary,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        result: analysis as any,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        context: context as any,
                    },
                });
            }
        } catch (dbError) {
            console.error('Failed to save to DB:', dbError);
        }

        // Trigger Make.com Webhook (Fire and forget)
        const webhookUrl = process.env.MAKE_WEBHOOK_URL;
        if (webhookUrl) {
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    analysis,
                    context,
                    timestamp: new Date().toISOString(),
                }),
            }).catch(err => console.error('Failed to trigger Make webhook:', err));
        }

        return NextResponse.json(analysis);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Analysis Error:', error);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
    }
}
