import { getOrderCount, getOrderRevenue } from '@/lib/actions/order.action';
import { getProductCount } from '@/lib/actions/product.action';
import { create } from 'zustand';

type DashboardStore = {
    productCount: number;
    revenue: number;
    orderCount: number;
    fetchProductCount: () => Promise<void>;
    fetchRevenue: () => Promise<void>;
    fetchOrderCount: () => Promise<void>;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
    productCount: 0,
    fetchProductCount: async () => {
        try {
            const data = await getProductCount();
            set({ productCount: data });
        } catch (error) {
            console.error('Error fetching product count:', error);
        }
    },
    revenue: 0,
    fetchRevenue: async () => {
        try {
            const data = await getOrderRevenue();
            set({ revenue: data });
        } catch (error) {
            console.error('Error fetching revenue:', error);
        }
    },
    orderCount: 0,
    fetchOrderCount: async () => {
        try {
            const data = await getOrderCount();
            set({ orderCount: data });
        } catch (error) {
            console.error('Error fetching order count:', error);
        }
    },
}));
