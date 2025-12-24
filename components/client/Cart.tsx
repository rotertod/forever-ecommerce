'use client';

import { useShop } from '@/context/ShopContext';
import Title from './helper/Title';
import { assets } from '@/public/client/assets';
import Image from 'next/image';
import CartTotal from './CartTotal';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useState } from 'react';
import { thousandSeparator } from '@/lib/utils';

export default function Cart() {
    const { currency } = useShop();
    const { cart, handleRemoveFromCart, handleUpdateCartItemQuantity } = useStore();
    const [loadingItems, setLoadingItems] = useState<string[]>([]);

    const handleQuantityChange = async (productId: string, value: string) => {
        const quantity = parseInt(value, 10);
        if (isNaN(quantity) || quantity < 1) {
            return; // Không làm gì nếu giá trị không hợp lệ
        }

        // Thêm productId vào danh sách loading
        setLoadingItems((prev) => [...prev, productId]);

        try {
            await handleUpdateCartItemQuantity(productId, quantity);
        } finally {
            // Xóa productId khỏi danh sách loading sau khi hoàn tất
            setLoadingItems((prev) => prev.filter((id) => id !== productId));
        }
    };

    return (
        <div className="border-t pt-14">
            <div className="text-2xl mb-3">
                <Title text1="GIỎ HÀNG" text2="CỦA TÔI" />
            </div>
            <div className="divide-y">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="py-4 text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                    >
                        {/* product */}
                        <div className="flex items-start gap-6">
                            <Image
                                src={item.product.images[0].url}
                                alt=""
                                width={80}
                                height={80}
                                className="w-16 sm:w-20"
                            />
                            <div>
                                <p className="text-xs sm:text-lg font-medium">{item.product.name}</p>
                                <div className="flex items-center gap-5 mt-2">
                                    <p>
                                        {thousandSeparator(item.product.price)} {currency}
                                    </p>
                                    <p className="px-2 sm:px-3 sm:py-1 border bg-gray-50">{item.size}</p>
                                </div>
                            </div>
                        </div>
                        {/* quantity */}
                        {loadingItems.includes(item.product.id) ? (
                            <div className="w-6 h-6 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                        ) : (
                            <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                            />
                        )}
                        {/* delete */}
                        <Image
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            src={assets.bin_icon}
                            alt="bin"
                            className="w-4 mr-4 sm:w-5 cursor-pointer"
                        />
                    </div>
                ))}
            </div>
            {/* cart total */}
            <div className="flex justify-end my-20">
                <div className="w-full sm:w-[450px]">
                    <CartTotal />
                    <div className="w-full text-end">
                        <Link href={'/place-order'}>
                            <button className="bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer">
                                TIẾN HÀNH THANH TOÁN
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
