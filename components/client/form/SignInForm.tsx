'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '@/lib/validation/user.form';
import { useRouter } from 'next/navigation';
import { signInUser } from '@/lib/actions/user.action';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';

export default function SignInForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema()),
    });

    const router = useRouter();

    const [state] = useState({
        success: false,
        error: false,
        message: '',
    });

    const { setIsLoggedIn } = useAuth();

    const onSubmit = handleSubmit(async (data) => {
        const response = await signInUser(state, data);

        if (response.success) {
            if (response.token) {
                Cookies.set('token', response.token, { expires: 1 });
            }
            if (response.userId) {
                Cookies.set('userId', response.userId);
            }
            if (response.name) {
                Cookies.set('name', response.name);
            }
            if (response.email) {
                Cookies.set('email', response.email);
            }
            if (response.role) {
                Cookies.set('role', response.role);
            }
            setIsLoggedIn(true);
            toast.success('Đăng nhập thành công !!');

            // Redirect based on role
            if (response.role === 'admin') {
                await router.push('/admin');
            } else {
                await router.push('/');
            }
        } else {
            toast.error(response.message || 'Đăng nhập không thành công !!');
        }
    });

    return (
        <form onSubmit={onSubmit} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 text-black">
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
                <p className="font-prata text-3xl">Đăng nhập</p>
                <hr className="border-none h-[1.5px] w-6 bg-gray-800" />
            </div>
            <div className="space-y-2 w-full mt-2">
                <div>
                    <input
                        type="email"
                        {...register('email')}
                        className="w-full px-3 py-2 border border-gray-800 rounded-sm"
                        placeholder="Địa chỉ email"
                    />
                    {errors.email?.message && (
                        <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <div>
                    <input
                        type="password"
                        {...register('password')}
                        className="w-full px-3 py-2 border border-gray-800 rounded-sm"
                        placeholder="Mật khẩu"
                    />
                    {errors.password?.message && (
                        <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                            {errors.password.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="w-full flex justify-end text-sm mt-2">
                <Link href={'/sign-up'} className="cursor-pointer">
                    Tạo tài khoản mới
                </Link>
            </div>
            <button type="submit" className="bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer rounded-sm">
                Sign In
            </button>
        </form>
    );
}
