import { lemonSqueezySetup, getCustomer } from '@lemonsqueezy/lemonsqueezy.js';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { customerId: true }
        });

        if (!user?.customerId) {
            return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
        }

        const apiKey = process.env.LEMONSQUEEZY_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Missing Lemon Squeezy configuration' }, { status: 500 });
        }

        lemonSqueezySetup({
            apiKey,
            onError: (error) => console.error('Lemon Squeezy Error:', error),
        });

        // Get Customer to retrieve the portal URL
        // Note: In newer Lemon Squeezy API, we might need to use a specific endpoint or get it from the customer object
        const customer = await getCustomer(user.customerId);

        // The customer object usually contains links. Let's check the structure.
        // Based on standard JSON:API response from Lemon Squeezy
        const portalUrl = customer.data?.data.attributes.urls?.customer_portal;

        if (!portalUrl) {
            return NextResponse.json({ error: 'Could not retrieve portal URL' }, { status: 500 });
        }

        return NextResponse.json({ url: portalUrl });
    } catch (error) {
        console.error('Portal generation failed:', error);
        return NextResponse.json({ error: 'Failed to generate portal URL' }, { status: 500 });
    }
}
