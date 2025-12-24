'use client';

import { useShop } from '@/context/ShopContext';
import Title from './helper/Title';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { getUserOrders, updateOrderStatusByName } from '@/lib/actions/order.action';
import { getUserIdFromCookie } from '@/lib/auth';
import toast from 'react-hot-toast';
import { formatDate, thousandSeparator } from '@/lib/utils';

type OrderWithDetails = {
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
};

export default function Orders() {
    const { currency } = useShop();
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);

    const fetchOrders = useCallback(async () => {
        const userId = getUserIdFromCookie();
        if (!userId) {
            toast.error('Bạn phải đăng nhập để xem đơn hàng của bạn');
            return;
        }

        try {
            const userOrders = await getUserOrders(userId);
            // Log data for debugging
            console.log('Fetched orders:', userOrders);
            // Ensure images is always an array
            const sanitizedOrders = userOrders.map((order) => ({
                ...order,
                product: {
                    ...order.product,
                    images: Array.isArray(order.product.images) ? order.product.images : [],
                },
            }));
            setOrders(sanitizedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleCancelOrder = async (orderId: string) => {
        try {
            const result = await updateOrderStatusByName(orderId, 'Cancelled');
            if (result.success) {
                toast.success('Hủy đơn hàng thành công');
                fetchOrders();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Hủy đơn hàng không thành công');
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Cancelled':
                return 'Đã hủy';
            case 'Paid':
                return 'Đã thanh toán';
            case 'Shipped':
                return 'Đơn hàng đã di chuyển';
            case 'Delivered':
                return 'Đã giao hàng';
            case 'Order placed':
                return 'Đã đặt hàng';
            case 'Ready to ship':
                return 'Đã sẵn sàng giao hàng';
            case 'Out for delivery':
                return 'Đang giao hàng';
            case 'Packing':
                return 'Đang đóng gói';
            default:
                return status;
        }
    };

    return (
        <div className="border-t pt-16">
            <div className="text-2xl">
                <Title text1="ĐƠN HÀNG" text2="CỦA TÔI" />
            </div>
            <div className="divide-y">
                {orders.map((item) => (
                    <div
                        key={item.id}
                        className="py-4 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        {/* info product */}
                        <div className="flex items-start gap-6 text-sm">
                            <Image
                                src={item.product.images[0].url}
                                alt=""
                                width={80}
                                height={80}
                                className="w-16 sm:w-20"
                            />
                            <div>
                                <p className="sm:text-base font-medium">{item.product.name}</p>
                                <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                                    <p className="text-lg">
                                        {thousandSeparator(item.product.price)} {currency}
                                    </p>
                                    <p>Số lượng: {item.quantity}</p>
                                    <p>Kích cỡ: {item.sizeProduct}</p>
                                </div>
                                <p>
                                    Ngày tạo: <span className="text-gray-400">{formatDate(item.createdDate)}</span>
                                </p>
                            </div>
                        </div>
                        {/* status & track order */}
                        <div className="md:w-1/2 flex justify-between">
                            <div className="flex items-center gap-2">
                                <p
                                    className={`min-w-2 h-2 rounded-full bg-green-500 ${
                                        item.status.name === 'Cancelled' && 'bg-red-500'
                                    }`}
                                ></p>
                                <p className="text-sm md:text-base">{getStatusLabel(item.status.name)}</p>
                            </div>
                            <button
                                onClick={() => handleCancelOrder(item.id)}
                                className="border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-400"
                                disabled={item.status.name === 'Cancelled'}
                            >
                                Hủy đơn hàng
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
