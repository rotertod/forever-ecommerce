// ListOrder.tsx
'use client';

import { useShop } from '@/context/ShopContext';
import { OrderStatus, updateOrderStatusByName } from '@/lib/actions/order.action';
import { formatDate, thousandSeparator } from '@/lib/utils';
import { assets } from '@/public/admin/assets';
import { useOrderStore } from '@/store/orderStore';
import Image from 'next/image';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ListOrder() {
    const { orders, statuses, fetchOrders, fetchStatuses } = useOrderStore();
    const { currency } = useShop();

    useEffect(() => {
        fetchOrders();
        fetchStatuses();
    }, [fetchOrders, fetchStatuses]);

    const handleStatusChange = async (orderId: string, statusName: string) => {
        try {
            const response = await updateOrderStatusByName(orderId, statusName as OrderStatus);
            if (response.success) {
                toast.success('Trạng thái đơn hàng được cập nhật thành công');
                fetchOrders(); // Làm mới danh sách đơn hàng
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
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
        <div>
            <h3>Các đơn hàng</h3>
            <div>
                {orders.map((group) => (
                    <div key={group.createdDate.toISOString()} className="my-6">
                        <h4 className="text-lg font-semibold">Đơn hàng vào {formatDate(group.createdDate)}</h4>
                        <p className="text-sm text-gray-600">
                            Tổng giá trị: {thousandSeparator(group.totalAmount)} {currency}
                        </p>
                        <div>
                            {group.orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
                                >
                                    <Image src={assets.parcel_icon} alt="" className="w-12" />
                                    <div>
                                        <p className="py-0.5">
                                            {order.product.name} x {order.quantity} <span>{order.sizeProduct}</span>
                                        </p>
                                        <p className="mt-3 mb-2 font-medium">
                                            {order.deliveryInfo[0].firstName + ' ' + order.deliveryInfo[0].lastName}
                                        </p>
                                        <div>
                                            <p>{order.deliveryInfo[0].street + ', '}</p>
                                            <p>
                                                {order.deliveryInfo[0].city +
                                                    ', ' +
                                                    order.deliveryInfo[0].state +
                                                    ', ' +
                                                    order.deliveryInfo[0].country +
                                                    ', ' +
                                                    order.deliveryInfo[0].zipCode}
                                            </p>
                                        </div>
                                        <p>{order.deliveryInfo[0].phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm sm:text-[15px]">Số lượng: 1</p>
                                        <p className="mt-3">Phương thức thanh toán: {order.payment?.name || ''}</p>
                                        <p>Trạng thái: {order.status.name}</p>
                                        <p>Ngày tạo: {formatDate(order.createdDate)}</p>
                                    </div>
                                    <p className="text-sm sm:text-[15px]">
                                        {thousandSeparator(order.amount)} {currency}
                                    </p>
                                    {order.status.name === 'Cancelled' ? (
                                        <p className="text-sm sm:text-[15px] text-white bg-red-500 rounded-sm px-2 py-1 w-fit">
                                            {getStatusLabel(order.status.name)}
                                        </p>
                                    ) : (
                                        <select
                                            value={order.status.name}
                                            className="p-2 font-semibold border border-[#c2c2c2] outline-[#c586a5] rounded-sm"
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            {statuses
                                                .filter((item) => item.name !== 'Cancelled')
                                                .map((status) => (
                                                    <option key={status.id} value={status.name}>
                                                        {getStatusLabel(status.name)}
                                                    </option>
                                                ))}
                                        </select>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
