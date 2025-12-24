import { z } from 'zod';

export const signUpSchema = () => {
    return z.object({
        id: z.string().optional(),
        name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
        email: z
            .string()
            .nonempty({ message: 'Vui lòng nhập địa chỉ email' })
            .email({ message: 'Địa chỉ email không hợp lệ' }),
        password: z.string().nonempty({ message: 'Vui lòng nhập mật khẩu' }),
    });
};

export type SignUpSchema = z.infer<ReturnType<typeof signUpSchema>>;

export const loginSchema = () => {
    return z.object({
        email: z
            .string()
            .nonempty({ message: 'Vui lòng nhập địa chỉ email' })
            .email({ message: 'Địa chỉ email không hợp lệ' }),
        password: z.string().nonempty({ message: 'Vui lòng nhập mật khẩu' }),
    });
};

export type LoginSchema = z.infer<ReturnType<typeof loginSchema>>;

export const userSchema = () => {
    return z.object({
        id: z.string().optional(),
        name: z.string().nonempty({ message: 'Vui lòng nhập tên' }),
        email: z
            .string()
            .nonempty({ message: 'Vui lòng nhập địa chỉ email' })
            .email({ message: 'Địa chỉ email không hợp lệ' }),
        password: z.string().nonempty({ message: 'Vui lòng nhập mật khẩu' }),
        roleId: z.string().min(1, { message: 'Vai trò là bắt buộc' }),
    });
};

export type UserSchema = z.infer<ReturnType<typeof userSchema>>;
