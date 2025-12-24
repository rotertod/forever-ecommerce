'use server';

import prisma from '../prisma';
import { ProductSchema } from '../validation/product.form';

type CurrentState = { success: boolean; error: boolean; message?: string };

export const getSizes = async () => {
    try {
        const sizes = await prisma.size.findMany({});
        return sizes;
    } catch (error) {
        console.error(error);
    }
};

export const getProducts = async () => {
    try {
        const products = await prisma.product.findMany({
            include: {
                images: {
                    select: { url: true },
                },
                sizes: {
                    select: { name: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return products;
    } catch (error) {
        console.error(error);
    }
};

export const getProductCount = async () => {
    try {
        const count = await prisma.product.count();
        return count;
    } catch (error) {
        console.error('Error fetching product count:', error);
        return 0;
    }
};

export const getProductById = async (id: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                images: { select: { url: true } },
                sizes: { select: { name: true } },
            },
        });
        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    } catch (error) {
        console.error('Error fetching product by id:', error);
        return null;
    }
};

export const createProduct = async (
    currentState: CurrentState,
    data: ProductSchema & { imageUrls?: string[] } & { sizes?: string[] },
) => {
    try {
        const newProduct = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                category: data.category,
                subCategory: data.subCategory,
                quantity: Number(data.quantity),
                bestseller: data.bestseller || false,
                sizes: {
                    connect: data.sizes?.map((name) => ({ name })) || [],
                },
            },
        });

        if (data.imageUrls && data.imageUrls.length > 0) {
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    productId: newProduct.id,
                    createdAt: new Date(),
                })),
            });
        }

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Product name is already exists',
            };
        }
        return { success: false, error: true, message: 'Create failed' };
    }
};

export const updateProduct = async (
    currentState: CurrentState,
    data: ProductSchema & { imageUrls?: string[] } & { sizes?: string[] },
) => {
    try {
        if (!data.id) {
            throw new Error('Product ID is required for update');
        }

        const updatedProduct = await prisma.product.update({
            where: { id: data.id },
            data: {
                name: data.name,
                description: data.description || '',
                price: Number(data.price),
                category: data.category,
                subCategory: data.subCategory,
                quantity: Number(data.quantity),
                bestseller: data.bestseller || false,
            },
        });

        await prisma.image.deleteMany({
            where: { productId: updatedProduct.id },
        });

        if (data.imageUrls && data.imageUrls.length > 0) {
            await prisma.image.createMany({
                data: data.imageUrls.map((url) => ({
                    url,
                    productId: updatedProduct.id,
                    createdAt: new Date(),
                })),
            });
        }

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Product name is already exists',
            };
        }
        return { success: false, error: true, message: 'Update failed' };
    }
};

export const deleteProduct = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        if (!id) {
            throw new Error('Product ID is required');
        }

        await prisma.product.delete({
            where: {
                id,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.error('Delete product error:', error);
        return { success: false, error: true };
    }
};

export const deleteProductById = async (id: string) => {
    try {
        await prisma.product.delete({
            where: {
                id,
            },
        });
        return { success: true };
    } catch (error) {
        console.log(error);
    }
};
