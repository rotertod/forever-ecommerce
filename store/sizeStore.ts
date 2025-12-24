import { getSizes } from '@/lib/actions/size.action';
import { create } from 'zustand';

type Size = {
    id: string;
    name: string;
};

type SizeStore = {
    sizes: Size[];
    fetchSizes: () => Promise<void>;
};

export const useSizeStore = create<SizeStore>((set) => ({
    sizes: [],
    fetchSizes: async () => {
        try {
            const data = await getSizes();
            set({ sizes: data });
        } catch (error) {
            console.error('Error fetching sizes:', error);
        }
    },
}));
