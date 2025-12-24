import { z } from 'zod';

export const productSchema = () => {
    return z.object({
        id: z.string().optional(),
        name: z.string().min(1, { message: 'Vui lòng nhập tên sản phẩm' }),
        description: z.string().min(1, { message: 'Vui lòng nhập mô tả' }),
        price: z.coerce.number().min(1, { message: 'Vui lòng nhập giá' }),
        imageUrls: z.array(z.string()).optional(),
        category: z.string().nonempty('Vui lòng chọn danh mục'),
        subCategory: z.string().nonempty('Vui lòng chọn danh mục phụ'),
        quantity: z.coerce.number().default(0),
        sizes: z.array(z.string()).optional(),
        bestseller: z.boolean().default(false),
    });
};

export type ProductSchema = z.infer<ReturnType<typeof productSchema>>;
