import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const apiKey = process.env.LEMONSQUEEZY_API_KEY;
        const storeId = process.env.LEMONSQUEEZY_STORE_ID;
        const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

        if (!apiKey || !storeId || !variantId) {
            return NextResponse.json({ error: 'Missing Lemon Squeezy configuration' }, { status: 500 });
        }

        lemonSqueezySetup({
            apiKey,
            onError: (error) => console.error('Lemon Squeezy Error:', error),
        });

        const checkout = await createCheckout(storeId, variantId, {
            checkoutData: {
                email: user.emailAddresses[0].emailAddress,
                custom: {
                    user_id: userId,
                },
            },
        });

        return NextResponse.json({ url: checkout.data?.data.attributes.url });
    } catch (error) {
        console.error('Checkout creation failed:', error);
        return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }
}
