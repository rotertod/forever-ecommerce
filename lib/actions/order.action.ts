/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import prisma from '../prisma';
import { revalidatePath } from 'next/cache';
import { Cart, Order, Product } from '@/prisma/app/generated/prisma';
import { DeliveryInfoSchema } from '../validation/delivery.form';

type OrderResponse = {
    success: boolean;
    error: boolean;
    message?: string;
    data?: Order | null;
};

export type OrderStatus =
    | 'Ready to ship'
    | 'Packing'
    | 'Shipped'
    | 'Out for delivery'
    | 'Delivered'
    | 'Order placed'
    | 'Cancelled'
    | 'Paid';

// Type for Cart with Product relation
type CartWithProduct = Cart & { product: Product };

export const getAllOrders = async () => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                product: {
                    include: {
                        images: {
                            select: { url: true },
                        },
                    },
                },
                status: true,
                deliveryInfo: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                payment: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdDate: 'desc',
            },
        });

        // Nhóm các đơn hàng theo createdDate
        const groupedOrders = orders.reduce((acc, order) => {
            const dateKey = order.createdDate.toISOString().split('T')[0]; // Lấy ngày (YYYY-MM-DD)
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push({
                ...order,
                amount: order.product.price * order.quantity, // Tính amount cho từng đơn hàng
            });
            return acc;
        }, {} as Record<string, any[]>);

        // Chuyển đổi thành mảng các nhóm đơn hàng
        const result = Object.entries(groupedOrders).map(([date, orders]) => ({
            createdDate: new Date(date),
            orders,
            totalAmount: orders.reduce((sum, order) => sum + order.amount, 0), // Tính tổng amount cho nhóm
        }));

        return result;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

export const getOrderStatuses = async () => {
    try {
        const statuses = await prisma.status.findMany({});
        return statuses;
    } catch (error) {
        console.log(error);
    }
};

export const getOrderCount = async () => {
    try {
        const count = await prisma.order.count();
        return count;
    } catch (error) {
        console.error('Error fetching order count:', error);
        return 0;
    }
};

export const getUserOrders = async (userId: string) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: userId,
            },
            include: {
                product: {
                    include: {
                        images: {
                            select: { url: true },
                        },
                    },
                },
                status: true,
                deliveryInfo: true,
            },
            orderBy: {
                createdDate: 'desc',
            },
        });
        return orders;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};

export const getOrderRevenue = async () => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                product: {
                    select: { price: true },
                },
            },
        });

        const totalPrice = orders.reduce((total: number, item: any) => {
            const price = item.product.price;
            const totalAmount = price * item.quantity;

            return total + parseFloat(totalAmount.toFixed(2));
        }, 0);

        return totalPrice;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

export const createOrder = async (
    userId: string,
    deliveryInfo: DeliveryInfoSchema,
    paymentId: string,
): Promise<OrderResponse> => {
    console.log('createOrder called with userId:', userId, 'and deliveryInfo:', deliveryInfo);
    try {
        // Start transaction
        await prisma.$transaction(async (prisma) => {
            console.log('Starting transaction');
            // 1. Get ready status
            const readyStatus = await prisma.status.findUnique({
                where: { name: 'Ready to ship' },
            });

            if (!readyStatus) {
                throw new Error('Ready to ship status not found');
            }

            // 2. Get cart items
            const cartItems = await prisma.cart.findMany({
                where: { userId },
                include: { product: true },
            });

            if (cartItems.length === 0) {
                throw new Error('Cart is empty');
            }

            // 3. Create orders for each cart item
            const orderPromises = cartItems.map(async (cartItem: CartWithProduct) => {
                // Create order
                const order = await prisma.order.create({
                    data: {
                        userId,
                        productId: cartItem.productId,
                        quantity: cartItem.quantity,
                        statusId: readyStatus.id,
                        sizeProduct: cartItem.size || null,
                        paymentId,
                    },
                });

                // Create delivery info
                await prisma.delivery.create({
                    data: {
                        firstName: deliveryInfo.firstName,
                        lastName: deliveryInfo.lastName,
                        email: deliveryInfo.email,
                        street: deliveryInfo.street,
                        city: deliveryInfo.city,
                        state: deliveryInfo.state,
                        zipCode: deliveryInfo.zipCode,
                        country: deliveryInfo.country,
                        phone: deliveryInfo.phone,
                        userId,
                        orderId: order.id,
                    },
                });

                // update quantity
                await prisma.product.update({
                    where: { id: cartItem.productId },
                    data: {
                        quantity: {
                            decrement: cartItem.quantity,
                        },
                    },
                });

                return order;
            });

            // Wait for all orders and delivery info to be created
            const orders = await Promise.all(orderPromises);

            // 5. Clear cart
            await prisma.cart.deleteMany({
                where: { userId },
            });

            return orders;
        });

        console.log('createOrder completed successfully');
        revalidatePath('/orders');

        return {
            success: true,
            error: false,
            message: 'Orders created successfully',
        };
    } catch (error) {
        console.error('Error creating order:', error);
        return {
            success: false,
            error: true,
            message: error instanceof Error ? error.message : 'Failed to create order',
        };
    }
};

export const updateOrderStatus = async ({
    orderId,
    statusId,
}: {
    orderId: string;
    statusId: string;
}): Promise<OrderResponse> => {
    try {
        // Check if the order exists and get its current status
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { status: true },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        // Prevent update if the order is cancelled
        if (order.status.name === 'Cancelled') {
            throw new Error('Cannot update a cancelled order');
        }

        // Verify the new status exists and is one of the allowed statuses
        const allowedStatuses = ['Pending', 'Out for delivery', 'Delivered'];
        const status = await prisma.status.findUnique({
            where: { id: statusId },
        });

        if (!status) {
            throw new Error('Status not found');
        }

        if (!allowedStatuses.includes(status.name)) {
            throw new Error(`Invalid status. Allowed statuses are: ${allowedStatuses.join(', ')}`);
        }

        // Update the order with the new status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { statusId: status.id },
            include: {
                product: {
                    include: {
                        images: {
                            select: { url: true },
                        },
                    },
                },
                status: true,
                deliveryInfo: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        revalidatePath('/list/orders');

        return {
            success: true,
            error: false,
            data: updatedOrder,
            message: `Update order to status ${status.name} successful`,
        };
    } catch (error) {
        console.error('Error updating order status:', error);
        return {
            success: false,
            error: true,
            data: null,
            message: error instanceof Error ? error.message : 'Update order status failed',
        };
    }
};

export const updateOrderStatusByName = async (orderId: string, statusName: OrderStatus) => {
    try {
        // Get the status ID for the new status
        const status = await prisma.status.findUnique({
            where: { name: statusName },
        });

        if (!status) {
            throw new Error(`Status '${statusName}' not found`);
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { status: true, product: true },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        // Update the order with the new status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { statusId: status.id },
            include: {
                product: {
                    include: {
                        images: {
                            select: { url: true },
                        },
                    },
                },
                status: true,
                deliveryInfo: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        revalidatePath('/admin/list-order');

        return {
            success: true,
            error: false,
            data: updatedOrder,
            message: `Update order to status ${statusName} successful`,
        };
    } catch (error) {
        console.error('Error updating order status:', error);
        return {
            success: false,
            error: true,
            data: null,
            message: error instanceof Error ? error.message : 'Update order status failed',
        };
    }
};
