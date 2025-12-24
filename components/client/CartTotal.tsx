'use client';

import { useShop } from '@/context/ShopContext';
import Title from './helper/Title';
import { useStore } from '@/context/StoreContext';
import { thousandSeparator } from '@/lib/utils';

export default function CartTotal() {
    const { currency, deliveryFee } = useShop();
    const { cartTotal } = useStore();

    return (
        <div className="w-full">
            <div className="text-2xl">
                <Title text1="TỔNG" text2="GIỎ HÀNG" />
            </div>
            <div className="flex flex-col gap-2 mt-2 text-sm">
                <div className="flex justify-between">
                    <p>Tổng phụ</p>
                    <p>
                        {thousandSeparator(cartTotal)} {currency}
                    </p>
                </div>
                <hr />
                <div className="flex justify-between">
                    <p>Phí giao hàng</p>
                    <p>
                        {thousandSeparator(cartTotal + deliveryFee)} {currency}
                    </p>
                </div>
                <hr />
                <div className="flex justify-between">
                    <b>Tổng</b>
                    <b>
                        {thousandSeparator(cartTotal + deliveryFee)} {currency}
                    </b>
                </div>
            </div>
        </div>
    );
}
