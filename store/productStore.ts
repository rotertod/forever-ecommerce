import { getProducts, getSizes } from '@/lib/actions/product.action';
import { create } from 'zustand';

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    images: {
        url: string;
    }[];
    category: string;
    subCategory: string;
    quantity: number;
    sizes: {
        name: string;
    }[];
    bestseller: boolean;
};

type Size = {
    name: string;
};

type ProductStore = {
    sizes: Size[];
    products: Product[];
    fetchSizes: () => Promise<void>;
    fetchProducts: () => Promise<void>;
};

export const useProductStore = create<ProductStore>((set) => ({
    sizes: [],
    fetchSizes: async () => {
        try {
            const data = await getSizes();
            set({ sizes: data });
        } catch (error) {
            console.error('Error fetching random categories:', error);
        }
    },
    products: [],
    fetchProducts: async () => {
        try {
            const data = await getProducts();
            set({ products: data });
        } catch (error) {
            console.error('Error fetching random categories:', error);
        }
    },
}));
