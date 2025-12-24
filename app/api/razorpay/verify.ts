import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { updateOrderStatusByName } from '@/lib/actions/order.action';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderIds } = req.body;

    try {
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature === razorpay_signature) {
            // Payment verified, update order statuses to 'paid'
            for (const orderId of orderIds) {
                await updateOrderStatusByName(orderId, 'Paid');
            }
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false, error: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying Razorpay payment:', error);
        return res.status(500).json({ success: false, error: 'Payment verification failed' });
    }
}
