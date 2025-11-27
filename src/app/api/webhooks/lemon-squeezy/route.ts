import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const text = await req.text();
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        if (!secret) {
            return NextResponse.json({ error: 'Webhook secret not set' }, { status: 500 });
        }

        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
        const signatureHeader = req.headers.get('x-signature');

        if (!signatureHeader) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        const signature = Buffer.from(signatureHeader, 'utf8');

        if (digest.length !== signature.length || !crypto.timingSafeEqual(digest, signature)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(text);
        const { meta, data } = payload;
        const eventName = meta.event_name;
        const userId = meta.custom_data?.user_id;

        if (!userId) {
            // Just return 200 if no user_id, maybe it's a test event or unrelated
            return NextResponse.json({ message: 'No user_id in custom_data' }, { status: 200 });
        }

        console.log(`Received webhook: ${eventName} for user ${userId}`);

        if (eventName === 'subscription_created' || eventName === 'subscription_updated' || eventName === 'subscription_resumed') {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    subscriptionId: data.id,
                    customerId: data.attributes.customer_id.toString(),
                    variantId: data.attributes.variant_id.toString(),
                    status: data.attributes.status,
                }
            });
        } else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    status: data.attributes.status,
                }
            });
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}
