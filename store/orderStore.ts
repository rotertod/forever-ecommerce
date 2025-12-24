import { getAllOrders, getOrderStatuses } from '@/lib/actions/order.action';
import { create } from 'zustand';

type Order = {
    id: string;
    createdDate: Date;
    quantity: number;
    sizeProduct?: string | null;
    status: {
        name: string;
    };
    product: {
        name: string;
        price: number;
        images: { url: string }[];
    };
    deliveryInfo: {
        firstName: string;
        lastName: string;
        email: string;
        street: string;
        state: string;
        zipCode: string;
        city: string;
        country: string;
        phone: string;
    }[];
    payment: {
        name: string;
    };
    amount: number;
};

type OrderGroup = {
    createdDate: Date;
    orders: Order[];
    totalAmount: number; // Tổng amount của nhóm
};

type Status = {
    id: string;
    name: string;
};

type OrderStore = {
    orders: OrderGroup[];
    statuses: Status[];
    fetchOrders: () => Promise<void>;
    fetchStatuses: () => Promise<void>;
};

export const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    fetchOrders: async () => {
        try {
            const data = await getAllOrders();
            set({ orders: data });
        } catch (error) {
            console.error('Error fetching random categories:', error);
        }
    },
    statuses: [],
    fetchStatuses: async () => {
        try {
            const data = await getOrderStatuses();
            set({ statuses: data });
        } catch (error) {
            console.error('Error fetching random categories:', error);
        }
    },
}));
