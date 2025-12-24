import { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import prisma from '@/lib/prisma';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId } = req.body;

    try {
        const cartItems = await prisma.cart.findMany({
            where: { userId },
            include: { product: true },
        });

        const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        const order = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100), // Convert to paise
            currency: 'INR',
            receipt: `receipt_${userId}_${Date.now()}`,
        });

        return res.status(200).json({ orderId: order.id });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return res.status(500).json({ error: 'Failed to create Razorpay order' });
    }
}
