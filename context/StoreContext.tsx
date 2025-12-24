/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    addToCart,
    getCartItems,
    increaseCartItemQuantity,
    decreaseCartItemQuantity,
    removeFromCart,
    getCartTotals,
    updateCartItemQuantity,
} from '@/lib/actions/cart.action';
import { getUserIdFromCookie } from '@/lib/auth';
import toast from 'react-hot-toast';

type ProductType = {
    id: string;
    name: string;
    description: string;
    image: any;
    price: number;
    images: { url: string }[];
    category: string;
    subCategory: string;
    sizes: { name: string }[];
    bestseller: boolean;
};

type CartItem = {
    id: string;
    product: ProductType;
    quantity: number;
    size?: string;
};

type StoreContextType = {
    handleAddToCart: (productId: string, size?: string) => Promise<void>;
    cart: CartItem[];
    handleRemoveFromCart: (productId: string) => Promise<void>;
    increaseAmount: (productId: string) => Promise<void>;
    decreaseAmount: (productId: string) => Promise<void>;
    handleUpdateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
    cartTotal: number;
    itemAmount: number;
    updateCart: () => Promise<void>;
};

export const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [itemAmount, setItemAmount] = useState(0);

    const updateCart = async () => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) {
                setCart([]);
                setItemAmount(0);
                setCartTotal(0);
                return;
            }

            const cartItems = await getCartItems(userId);
            const { itemAmount, cartTotal } = await getCartTotals(userId);

            setCart(
                cartItems.map((item: any) => ({
                    id: item.id,
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        image: item.product.images[0]?.url || '/placeholder.png',
                        price: item.product.price,
                        description: item.product.description,
                        images: item.product.images,
                        subCategory: item.product.subCategory,
                        category: item.product.category,
                        bestseller: item.product.bestseller,
                        sizes: item.product.sizes,
                    },
                    quantity: item.quantity,
                    size: item.size,
                })),
            );
            setItemAmount(itemAmount);
            setCartTotal(cartTotal);
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('Update cart failed');
        }
    };

    useEffect(() => {
        updateCart();
    }, []);

    const handleAddToCart = async (productId: string, size?: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) {
                toast.error('Vui lòng đăng nhập!!');
                return;
            }

            const result = await addToCart(userId, productId, size);
            if (result.success) {
                await updateCart();
                toast.success('Thêm vào giỏ hàng thành công!!');
            } else {
                toast.error(result.error || 'Thêm vào giỏ hàng thất bại!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Add to cart failed!');
        }
    };

    const handleRemoveFromCart = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await removeFromCart(userId, productId);
            if (result.success) {
                await updateCart();
                toast.success('Xóa khỏi giỏ hàng thành công!');
            } else {
                toast.error(result.error || 'Xóa khỏi giỏ hàng thất bại!');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            toast.error('Remove from cart failed!');
        }
    };

    const increaseAmount = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await increaseCartItemQuantity(userId, productId);
            if (result.success) {
                await updateCart();
            } else {
                toast.error(result.error || 'Increase failed!');
            }
        } catch (error) {
            console.error('Error increasing quantity:', error);
            toast.error('Increase failed!');
        }
    };

    const decreaseAmount = async (productId: string) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await decreaseCartItemQuantity(userId, productId);
            if (result.success) {
                await updateCart();
            } else {
                toast.error(result.error || 'Decrease failed!');
            }
        } catch (error) {
            console.error('Error decreasing quantity:', error);
            toast.error('Decrease failed!');
        }
    };

    const handleUpdateCartItemQuantity = async (productId: string, quantity: number) => {
        try {
            const userId = await getUserIdFromCookie();
            if (!userId) return;

            const result = await updateCartItemQuantity(userId, productId, quantity);
            if (result.success) {
                await updateCart();
            } else {
                toast.error(result.error || 'Update quantity failed!');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Update quantity failed!');
        }
    };

    const contextValue = {
        handleAddToCart,
        cart,
        handleRemoveFromCart,
        increaseAmount,
        decreaseAmount,
        handleUpdateCartItemQuantity,
        cartTotal,
        itemAmount,
        updateCart,
    };

    return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreContext');
    }
    return context;
};
