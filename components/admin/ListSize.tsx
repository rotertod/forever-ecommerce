'use client';

import { createSize, deleteSizeById } from '@/lib/actions/size.action';
import { sizeSchema, SizeSchema } from '@/lib/validation/size.form';
import { useSizeStore } from '@/store/sizeStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BiTrash } from 'react-icons/bi';

export default function ListSize() {
    const { sizes, fetchSizes } = useSizeStore();

    useEffect(() => {
        fetchSizes();
    }, [fetchSizes]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SizeSchema>({
        resolver: zodResolver(sizeSchema()),
    });

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const [state, formAction] = useFormState(createSize, {
        success: false,
        error: false,
    });

    const onSubmit = handleSubmit(async (formData) => {
        setHasSubmitted(true);

        // Gửi dữ liệu với danh sách URL thay vì File[]
        const data = { ...formData };
        formAction(data);
        console.log(formData);
    });

    const router = useRouter();

    useEffect(() => {
        if (!hasSubmitted) return;

        if (state.success) {
            toast.success('Tạo kích cỡ thành công!!');
            router.refresh();

            reset();
            setHasSubmitted(false);
            fetchSizes();
        } else if (state.error) {
            toast.error(state.message || 'Tạo thất bại');
        }
    }, [state, router, hasSubmitted, reset, fetchSizes]);

    const handleDelete = async (sizeId: string) => {
        const result = await deleteSizeById(sizeId);
        if (result?.success) {
            toast.success('Xóa kích cỡ thành công!');
            fetchSizes();
        } else {
            toast.error('Xóa thất bại');
        }
    };

    return (
        <div className="text-slate-500 mb-40">
            {/* Add Coupon */}
            <form method="POST" onSubmit={onSubmit} className="max-w-sm text-sm">
                <h2 className="text-2xl">
                    Thêm <span className="text-slate-800 font-medium">kích cỡ</span>
                </h2>
                <div className="flex gap-2 max-sm:flex-col mt-2">
                    <input
                        type="text"
                        {...register('name')}
                        placeholder="Tên kích cỡ"
                        className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                    />
                    {errors.name?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.name?.message.toString()}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="mt-4 p-2 px-10 rounded bg-slate-700 text-white active:scale-95 transition"
                >
                    Thêm kích cỡ
                </button>
            </form>

            {/* List Coupons */}
            <div className="mt-14">
                <h2 className="text-2xl">
                    Danh sách <span className="text-slate-800 font-medium">kích cỡ</span>
                </h2>
                <div className="overflow-x-auto mt-4 rounded-lg border border-slate-200 max-w-4xl">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Tên</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Nút</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {sizes?.map((size) => (
                                <tr key={size.id} className="hover:bg-slate-50">
                                    <td className="py-3 px-4 font-medium text-slate-800">{size.name}</td>
                                    <td className="py-3 px-4 text-slate-800 flex gap-4">
                                        <BiTrash
                                            onClick={() => handleDelete(size.id)}
                                            className="w-5 h-5 text-red-500 hover:text-red-800 cursor-pointer"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
