'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { signUpUser } from '@/lib/actions/user.action';
import toast from 'react-hot-toast';
import { signUpSchema, SignUpSchema } from '@/lib/validation/user.form';
import Link from 'next/link';

export default function SignUpForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema()),
    });

    const router = useRouter();

    const [state, formAction] = useFormState(signUpUser, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        formAction({ ...data });
    });

    useEffect(() => {
        console.log('State updated:', state);
        if (state.success) {
            toast.success('Đăng ký thành công !!');
            router.push('/sign-in');
        }
        if (state.error) {
            toast.error(state.message || 'Đăng ký không thành công !!');
        }
    }, [state, router]);

    return (
        <form onSubmit={onSubmit} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 text-black">
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
                <p className="font-prata text-3xl">Đăng ký</p>
                <hr className="border-none h-[1.5px] w-6 bg-gray-800" />
            </div>
            <div className="space-y-2 w-full mt-2">
                <div>
                    <input
                        type="text"
                        {...register('name')}
                        className="w-full px-3 py-2 border border-gray-800 rounded-sm"
                        placeholder="Tên"
                    />
                    {errors.name?.message && (
                        <p className="text-red-500 text-sm" style={{ maxWidth: '320px' }}>
                            {errors.name.message}
                        </p>
                    )}
                </div>
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
                <Link href={'/sign-in'}>Đăng nhập ở đây</Link>
            </div>
            <button type="submit" className="bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer rounded-sm">
                Đăng ký
            </button>
        </form>
    );
}
