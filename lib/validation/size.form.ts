import { z } from 'zod';

export const sizeSchema = () => {
    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: 'Vui lòng nhập tên kích cỡ' }),
    });
};

export type SizeSchema = z.infer<ReturnType<typeof sizeSchema>>;
