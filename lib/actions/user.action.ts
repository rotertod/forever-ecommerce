// user.action.ts

'use server';

import bcrypt from 'bcrypt';

import { loginSchema, LoginSchema, UserSchema, signUpSchema, SignUpSchema } from '../validation/user.form';
import { Role, User } from '@/types/prisma';
import prisma from '../prisma';
import { generateToken } from '../auth';

type CurrentState = { success: boolean; error: boolean };

export const signUpUser = async (
    currentState: CurrentState,
    data: SignUpSchema,
): Promise<{
    success: boolean;
    error: boolean;
    message?: string;
    token?: string;
    userId?: string;
    user?: User & { role: Role };
}> => {
    try {
        signUpSchema().parse(data);

        // check username exists
        const existingName = await prisma.user.findUnique({
            where: { name: data.name },
        });
        if (existingName) {
            return {
                success: false,
                error: true,
                message: 'Tên người dùng đã tồn tại',
            };
        }

        // check email exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingEmail) {
            return {
                success: false,
                error: true,
                message: 'Địa chỉ email đã tồn tại',
            };
        }

        // Lấy role Guest từ database
        const guestRole = await prisma.role.findUnique({
            where: { name: 'guest' },
        });

        if (!guestRole) {
            console.error('Guest role not found in database');
            return {
                success: false,
                error: true,
                message: 'Guest role not found',
            };
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Tạo người dùng mới với role Guest
        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                password: hashedPassword,
                email: data.email,
                roleId: guestRole.id, // Sử dụng ID của role Guest
            },
            include: {
                role: true, // Include role information in the response
            },
        });

        // Tạo token cho người dùng
        const token = generateToken(newUser.id, newUser.role.name);

        const result = {
            success: true,
            error: false,
            token,
            userId: newUser.id,
            user: newUser,
        };
        console.log('signUpUser result:', result);

        return result;
    } catch (error) {
        console.error('Error in signUpUser:', error);

        return { success: false, error: true };
    }
};

export const signInUser = async (currentState: CurrentState, data: LoginSchema) => {
    try {
        loginSchema().parse(data);

        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { role: true }, // Include role information
        });

        if (!user) {
            return {
                success: false,
                error: true,
                message: 'Địa chỉ email không tồn tại',
            };
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                error: true,
                message: 'Mật khẩu không đúng',
            };
        }

        // Generate token with role information
        const token = generateToken(user.id, user.role.name);
        const userId = user.id;
        const name = user.name;
        const email = user.email;

        return {
            success: true,
            error: false,
            userId,
            name,
            email,
            token,
            user,
            role: user.role.name, // Include role in response
            users: {
                ...user,
                role: user.role.name,
            },
        };
    } catch (error) {
        console.error('Error in signInUser:', error);
        return { success: false, error: true, message: 'Sign in failed' };
    }
};

export const getUsers = async () => {
    try {
        const users = await prisma.user.findMany({});
        return users;
    } catch (error) {
        console.error(error);
    }
};

export const createUser = async (currentState: CurrentState, data: UserSchema) => {
    try {
        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: await bcrypt.hash(data.password, 10),
                roleId: data.roleId,
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
                message: 'Name or email is already exists',
            };
        }
        return { success: false, error: true, message: 'Create failed' };
    }
};

export const updateUser = async (currentState: CurrentState, data: UserSchema) => {
    try {
        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                email: data.email,
                password: await bcrypt.hash(data.password, 10),
                roleId: data.roleId,
            },
        });

        // revalidatePath('/list/categories');
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        // Kiểm tra lỗi unique constraint từ Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return {
                success: false,
                error: true,
                message: 'Name or email is already exists',
            };
        }
        return { success: false, error: true, message: 'Update failed' };
    }
};

export const deleteUser = async (currentState: CurrentState, data: FormData) => {
    const id = data.get('id') as string;

    try {
        await prisma.user.delete({
            where: {
                id: id,
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
};

export const getUserCount = async () => {
    try {
        const count = await prisma.user.count();
        return count;
    } catch (error) {
        console.error('Error fetching user count:', error);
        return 0;
    }
};
