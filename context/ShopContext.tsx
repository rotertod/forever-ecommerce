'use client';

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

type ShopContextType = {
    currency: string;
    deliveryFee: number;
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    showSearch: boolean;
    setShowSearch: Dispatch<SetStateAction<boolean>>;
};

const ShopContext = createContext<ShopContextType | null>(null);

export default function ShopProvider({ children }: { children: React.ReactNode }) {
    const currency = 'VND';
    const deliveryFee = 20000;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    // const [cartItems, setCartItems] = useState([]);

    // const addToCart = async (itemId: any, size: any) => {
    //     let cartData = structuredClone(cartItems);

    //     if (cartData[itemId]) {
    //         if (cartData[itemId][size]) {
    //             cartData[itemId][size] += 1;
    //         }
    //         else {
    //             cartData[itemId][size] = 1;
    //         }
    //     }
    //     else {
    //         cartData[itemId] = {};
    //         cartData[itemId][size] = 1;
    //     }
    //     setCartItems(cartData);
    // }

    const contextValue = {
        currency,
        deliveryFee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
    };

    return <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>;
}

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};
