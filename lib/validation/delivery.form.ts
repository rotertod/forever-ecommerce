import { z } from 'zod';

export const deliveryInfoSchema = () => {
    return z.object({
        id: z.string().optional(),
        firstName: z.string().min(1, { message: 'Vui lòng nhập tên' }),
        lastName: z.string().min(1, { message: 'Vui lòng nhập họ' }),
        email: z
            .string()
            .min(1, { message: 'Vui lòng nhập địa chỉ email' })
            .email({ message: 'Địa chỉ email không hợp lệ' }),
        street: z.string().min(1, { message: 'Vui lòng nhập đường' }),
        city: z.string().min(1, { message: 'Vui lòng nhập thành phố' }),
        state: z.string().min(1, { message: 'Vui lòng nhập quận/huyện' }),
        zipCode: z.string().min(1, { message: 'Vui lòng nhập mã zip' }),
        country: z.string().min(1, { message: 'Vui lòng nhập quốc gia' }),
        phone: z.string().min(1, { message: 'Vui lòng nhập số điện thoại' }),
        userId: z.string().min(1, { message: 'Người dùng là bắt buộc' }),
        orderId: z.string().min(1, { message: 'Đơn hàng là bắt buộc' }),
    });
};

export type DeliveryInfoSchema = z.infer<ReturnType<typeof deliveryInfoSchema>>;
