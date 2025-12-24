'use server';

import prisma from '../prisma';
import { SizeSchema } from '../validation/size.form';

type CurrentState = { success: boolean; error: boolean; message?: string };

export const getSizes = async () => {
    try {
        const sizes = await prisma.size.findMany({});
        return sizes;
    } catch (error) {
        console.error(error);
    }
};

export const createSize = async (currentState: CurrentState, data: SizeSchema) => {
    try {
        await prisma.size.create({
            data: {
                name: data.name,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Size name is already exists',
            };
        }
        return { success: false, error: true, message: 'Create failed' };
    }
};

export const updateProduct = async (currentState: CurrentState, data: SizeSchema) => {
    try {
        if (!data.id) {
            throw new Error('Size ID is required for update');
        }

        await prisma.size.update({
            where: { id: data.id },
            data: {
                name: data.name,
            },
        });

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

export const deleteSizeById = async (id: string) => {
    try {
        await prisma.size.delete({
            where: {
                id,
            },
        });
        return { success: true };
    } catch (error) {
        console.log(error);
    }
};
