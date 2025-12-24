import { getPayments } from '@/lib/actions/payment.action';
import { create } from 'zustand';

type Payment = {
    id: string;
    name: string;
};

type PaymentStore = {
    payments: Payment[];
    fetchPayments: () => Promise<void>;
};

export const usePaymentStore = create<PaymentStore>((set) => ({
    payments: [],
    fetchPayments: async () => {
        try {
            const data = await getPayments();
            set({ payments: data });
        } catch (error) {
            console.error('Error fetching random categories:', error);
        }
    },
}));
