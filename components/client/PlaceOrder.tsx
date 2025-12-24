/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import CartTotal from './CartTotal';
import Title from './helper/Title';
import { assets } from '@/public/client/assets';
import { useEffect, useState } from 'react';
import { usePaymentStore } from '@/store/paymentStore';
import { deliveryInfoSchema, DeliveryInfoSchema } from '@/lib/validation/delivery.form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUserIdFromCookie } from '@/lib/auth';
import toast from 'react-hot-toast';
import { createOrder } from '@/lib/actions/order.action';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';

export default function PlaceOrder() {
    const [methodId, setMethodId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const { payments, fetchPayments } = usePaymentStore();
    const { updateCart } = useStore();
    const router = useRouter();

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    // Delivery Form
    const deliveryForm = useForm<DeliveryInfoSchema>({
        resolver: zodResolver(deliveryInfoSchema()),
    });

    const handleOrder = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        const deliveryData = deliveryForm.getValues();
        for (const item in deliveryData) {
            if (!deliveryData[item as keyof DeliveryInfoSchema]) {
                toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
                setIsProcessing(false);
                return;
            }
        }

        if (!methodId) {
            toast.error('Vui lòng chọn phương thức thanh toán');
            setIsProcessing(false);
            return;
        }

        const userId = await getUserIdFromCookie();
        if (!userId) {
            toast.error('Vui lòng đăng nhập để đặt hàng');
            setIsProcessing(false);
            return;
        }

        const selectedPayment = payments.find((p) => p.id === methodId);
        if (!selectedPayment) {
            toast.error('Phương thức thanh toán không hợp lệ');
            setIsProcessing(false);
            return;
        }

        try {
            if (selectedPayment.name === 'cod') {
                // Handle COD as before
                const response = await createOrder(userId, deliveryData, methodId);
                if (response.success) {
                    toast.success('Đơn hàng được đặt thành công!!');
                    await updateCart();
                    router.push('/orders');
                } else {
                    toast.error(response.message || 'Order failed');
                }
            } else if (selectedPayment.name === 'stripe') {
                // Handle Stripe payment
                const response = await createOrder(userId, deliveryData, methodId);
                if (!response.success) {
                    toast.error(response.message || 'Order creation failed');
                    setIsProcessing(false);
                    return;
                }

                // Redirect to Stripe checkout
                const stripeResponse = await fetch('/api/stripe/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        orders: response.data, // Assuming createOrder returns the created orders
                    }),
                });

                const stripeData = await stripeResponse.json();
                if (stripeData.url) {
                    window.location.href = stripeData.url; // Redirect to Stripe checkout
                } else {
                    toast.error('Failed to initiate Stripe payment');
                }
            } else if (selectedPayment.name === 'razorpay') {
                // Handle Razorpay payment
                const response = await createOrder(userId, deliveryData, methodId);
                if (!response.success) {
                    toast.error(response.message || 'Order creation failed');
                    setIsProcessing(false);
                    return;
                }

                // Fetch Razorpay order ID from server
                const razorpayResponse = await fetch('/api/razorpay/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        orders: response.data,
                    }),
                });

                const razorpayData = await razorpayResponse.json();
                if (razorpayData.orderId) {
                    // Load Razorpay SDK
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.async = true;
                    document.body.appendChild(script);

                    script.onload = () => {
                        const options = {
                            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Add your Razorpay Key ID in .env
                            order_id: razorpayData.orderId,
                            handler: async function (response: any) {
                                // Verify payment on server
                                const verifyResponse = await fetch('/api/razorpay/verify', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        razorpay_payment_id: response.razorpay_payment_id,
                                        razorpay_order_id: response.razorpay_order_id,
                                        razorpay_signature: response.razorpay_signature,
                                        orderIds: response.data.map((order: any) => order.id), // Order IDs from createOrder
                                    }),
                                });

                                const verifyData = await verifyResponse.json();
                                if (verifyData.success) {
                                    toast.success('Payment successful! Order placed.');
                                    await updateCart();
                                    router.push('/orders');
                                } else {
                                    toast.error('Payment verification failed');
                                }
                            },
                            prefill: {
                                name: `${deliveryData.firstName} ${deliveryData.lastName}`,
                                email: deliveryData.email,
                                contact: deliveryData.phone,
                            },
                            theme: {
                                color: '#000000',
                            },
                        };

                        const rzp = new (window as any).Razorpay(options);
                        rzp.open();
                    };
                } else {
                    toast.error('Failed to initiate Razorpay payment');
                }
            }
        } catch (error) {
            console.error('Error processing order:', error);
            toast.error('An error occurred while processing the order');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
            {/* left side */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                {/* heading */}
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1="THÔNG TIN" text2="GIAO HÀNG" />
                </div>
                {/* form */}
                <div className="flex gap-3">
                    <div>
                        <input
                            type="text"
                            {...deliveryForm.register('firstName')}
                            placeholder="Tên"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        />
                        {deliveryForm.formState.errors.firstName && (
                            <p className="text-red-500 mt-1 text-sm">
                                {deliveryForm.formState.errors.firstName.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            {...deliveryForm.register('lastName')}
                            placeholder="Họ"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        />
                        {deliveryForm.formState.errors.lastName && (
                            <p className="text-red-500 mt-1 text-sm">
                                {deliveryForm.formState.errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <input
                        type="email"
                        {...deliveryForm.register('email')}
                        placeholder="Địa chỉ email"
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    />
                    {deliveryForm.formState.errors.email && (
                        <p className="text-red-500 mt-1 text-sm">{deliveryForm.formState.errors.email.message}</p>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        {...deliveryForm.register('street')}
                        placeholder="Đường"
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    />
                    {deliveryForm.formState.errors.street && (
                        <p className="text-red-500 mt-1 text-sm">{deliveryForm.formState.errors.street.message}</p>
                    )}
                </div>
                <div className="flex gap-3">
                    <div>
                        <input
                            type="text"
                            {...deliveryForm.register('city')}
                            placeholder="Thành phố"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        />
                        {deliveryForm.formState.errors.city && (
                            <p className="text-red-500 mt-1 text-sm">{deliveryForm.formState.errors.city.message}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            {...deliveryForm.register('state')}
                            placeholder="Quận/Huyện"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        />
                        {deliveryForm.formState.errors.state && (
                            <p className="text-red-500 mt-1 text-sm">{deliveryForm.formState.errors.state.message}</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-3">
                    <div>
                        <input
                            type="text"
                            {...deliveryForm.register('zipCode')}
                            placeholder="Mã zip"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        />
                        {deliveryForm.formState.errors.zipCode && (
                            <p className="text-red-500 mt-1 text-sm">{deliveryForm.formState.errors.zipCode.message}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            {...deliveryForm.register('country')}
                            placeholder="Quốc gia"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                        />
                        {deliveryForm.formState.errors.country && (
                            <p className="text-red-500 mt-1 text-sm">{deliveryForm.formState.errors.country.message}</p>
                        )}
                    </div>
                </div>
                <div>
                    <input
                        type="text"
                        {...deliveryForm.register('phone')}
                        placeholder="Số điện thoại"
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    />
                    {deliveryForm.formState.errors.phone && (
                        <p className="text-red-500 mt-1 text-sm">{deliveryForm.formState.errors.phone.message}</p>
                    )}
                </div>
            </div>
            {/* right side */}
            <div className="mt-8">
                {/* cart total */}
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>
                {/* payment */}
                <div className="mt-12">
                    {/* payment method */}
                    <Title text1="PHƯƠNG THỨC" text2="THANH TOÁN" />
                    <div className="flex gap-3 flex-col lg:flex-row">
                        {payments.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setMethodId(item.id)}
                                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
                            >
                                <p
                                    className={`min-w-3.5 h-3.5 border rounded-full ${
                                        methodId === item.id ? 'bg-green-400' : ''
                                    }`}
                                ></p>
                                {item.name === 'stripe' ? (
                                    <Image src={assets.stripe_logo} alt="stripe" className="h-5 mx-4 object-contain" />
                                ) : item.name === 'razorpay' ? (
                                    <Image
                                        src={assets.razorpay_logo}
                                        alt="razorpay"
                                        className="h-5 mx-4 object-contain"
                                    />
                                ) : (
                                    <p className="text-gray-500 text-sm font-medium mx-4">TIỀN MẶT KHI GIAO HÀNG</p>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* button */}
                    <div className="w-full text-end mt-8">
                        <button
                            onClick={handleOrder}
                            disabled={isProcessing}
                            className={`bg-black text-white px-16 py-3 text-sm cursor-pointer ${
                                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isProcessing ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
