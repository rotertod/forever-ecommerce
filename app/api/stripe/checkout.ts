/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, orders } = req.body;

    try {
        const cartItems = await prisma.cart.findMany({
            where: { userId },
            include: { product: true },
        });

        const lineItems = cartItems.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.name,
                },
                unit_amount: Math.round(item.product.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
            metadata: {
                userId,
                orderIds: JSON.stringify(orders.map((order: any) => order.id)),
            },
        });

        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        return res.status(500).json({ error: 'Failed to create checkout session' });
    }
}
