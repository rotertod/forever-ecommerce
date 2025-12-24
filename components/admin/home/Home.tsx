'use client';

import { thousandSeparator } from '@/lib/utils';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { FaCarTunnel } from 'react-icons/fa6';
import { useShop } from '@/context/ShopContext';
import { BiCoin, BiTag } from 'react-icons/bi';

export default function Home() {
    const { productCount, revenue, orderCount, fetchProductCount, fetchRevenue, fetchOrderCount } = useDashboardStore();

    useEffect(() => {
        fetchProductCount();
        fetchRevenue();
        fetchOrderCount();
    }, [fetchProductCount, fetchRevenue, fetchOrderCount]);

    const { currency } = useShop();

    const dashboardCardsData = [
        { title: 'Tổng sản phẩm', value: productCount, icon: FaCarTunnel },
        { title: 'Tổng lợi nhuận', value: `${thousandSeparator(revenue)} ${currency}`, icon: BiCoin },
        { title: 'Tổng đơn hàng', value: orderCount, icon: BiTag },
    ];

    return (
        <div className="text-slate-500">
            <h1 className="text-2xl">
                <span className="text-slate-800 font-medium">Trang tổng quan</span> quản trị viên
            </h1>

            {/* Cards */}
            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {dashboardCardsData.map((card, index) => (
                    <div key={index} className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg">
                        <div className="flex flex-col gap-3 text-xs">
                            <p>{card.title}</p>
                            <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                        </div>
                        <card.icon size={50} className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
