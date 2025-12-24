'use client';

import { createProduct } from '@/lib/actions/product.action';
import { uploadImagesToCloudinary } from '@/lib/upload';
import { ProductSchema, productSchema } from '@/lib/validation/product.form';
import { assets } from '@/public/admin/assets';
import { useProductStore } from '@/store/productStore';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function AddProduct() {
    const { sizes, fetchSizes } = useProductStore();

    useEffect(() => {
        fetchSizes();
    }, [fetchSizes]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ProductSchema>({
        resolver: zodResolver(productSchema()),
    });

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const [state, formAction] = useFormState(createProduct, {
        success: false,
        error: false,
    });

    useEffect(() => {
        setValue('sizes', selectedSizes);
    }, [selectedSizes, setValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviews((prev) => {
                const newPreviews = [...prev];
                newPreviews[index] = url;
                return newPreviews;
            });
            setImages((prev) => {
                const newImages = [...prev];
                newImages[index] = file;
                return newImages;
            });
        }
    };

    const onSubmit = handleSubmit(async (formData) => {
        setHasSubmitted(true);

        let imageUrls: string[] = [];

        // Upload new images to Cloudinary if there are new files
        if (images.length > 0) {
            try {
                imageUrls = await uploadImagesToCloudinary(images);
            } catch (error) {
                console.log(error);
                toast.error('Failed to upload images');
                return;
            }
        }

        // Gửi dữ liệu với danh sách URL thay vì File[]
        const dataWithImageAndFileUrls = { ...formData, imageUrls };
        formAction(dataWithImageAndFileUrls);
        console.log(formData);
    });

    const router = useRouter();

    useEffect(() => {
        if (!hasSubmitted) return;

        if (state.success) {
            toast.success('Tạo sản phẩm thành công!!');
            router.refresh();

            reset();
            setImages([]);
            setPreviews([]);
            setSelectedSizes([]);
            setHasSubmitted(false);
        } else if (state.error) {
            toast.error(state.message || 'Tạo sản phẩm không thành công!!');
        }
    }, [state, router, hasSubmitted, reset]);

    return (
        <form method="POST" onSubmit={onSubmit} className="flex flex-col w-full items-start gap-3">
            {/* upload */}
            <div>
                <p className="mb-2">Tải lên hình ảnh</p>
                <div className="flex gap-2">
                    {[...Array(4)].map((_, index) => (
                        <label key={index} htmlFor={`image${index + 1}`}>
                            <Image
                                src={previews[index] || assets.upload_area}
                                alt="upload area"
                                className="w-20 cursor-pointer"
                                width={80}
                                height={80}
                            />
                            <input
                                type="file"
                                id={`image${index + 1}`}
                                hidden
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, index)}
                            />
                        </label>
                    ))}
                </div>
            </div>
            {/* product name */}
            <div className="w-full">
                <p className="mb-2">Tên sản phẩm</p>
                <input
                    type="text"
                    {...register('name')}
                    placeholder="Nhập tên sản phẩm"
                    className="w-full max-w-[500px] px-3 py-2 border border-[#c2c2c2] outline-[#c586a5] rounded-sm"
                />
                {errors.name?.message && (
                    <p className="text-xs text-red-400 max-w-[300px]">{errors.name?.message.toString()}</p>
                )}
            </div>
            {/* product description */}
            <div className="w-full">
                <p className="mb-2">Mô tả</p>
                <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Viết nội dung ở đây"
                    className="w-full max-w-[500px] px-3 py-2 border border-[#c2c2c2] outline-[#c586a5] rounded-sm"
                />
                {errors.description?.message && (
                    <p className="text-xs text-red-400 max-w-[300px]">{errors.description?.message.toString()}</p>
                )}
            </div>
            {/* main/sub category, price */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                {/* main category */}
                <div>
                    <p className="mb-2">Danh mục</p>
                    <select
                        {...register('category')}
                        className="w-full px-3 py-2 border border-[#c2c2c2] outline-[#c586a5] rounded-sm"
                    >
                        <option value="Men">Nam</option>
                        <option value="Women">Nữ</option>
                        <option value="Kids">Trẻ em</option>
                    </select>
                    {errors.category?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.category?.message.toString()}</p>
                    )}
                </div>
                {/* sub category */}
                <div>
                    <p className="mb-2">Danh mục phụ</p>
                    <select
                        {...register('subCategory')}
                        className="w-full px-3 py-2 border border-[#c2c2c2] outline-[#c586a5] rounded-sm"
                    >
                        <option value="Topwear">Áo khoác ngoài</option>
                        <option value="Bottomwear">Quần</option>
                        <option value="Winterwear">Đồ mùa đông</option>
                    </select>
                    {errors.subCategory?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.subCategory?.message.toString()}</p>
                    )}
                </div>
                {/* price */}
                <div>
                    <p className="mb-2">Giá</p>
                    <input
                        {...register('price')}
                        type="number"
                        placeholder="25000"
                        className="w-full px-3 py-2 sm:w-[120px] border border-[#c2c2c2] outline-[#c586a5] rounded-sm"
                    />
                    {errors.price?.message && (
                        <p className="text-xs text-red-400 max-w-[300px]">{errors.price?.message.toString()}</p>
                    )}
                </div>
            </div>
            {/* Quantity */}
            <div className="w-full">
                <p className="mb-2">Số lượng</p>
                <input
                    type="number"
                    {...register('quantity')}
                    placeholder="0"
                    className="w-1/2 max-w-[500px] px-3 py-2 border border-[#c2c2c2] outline-[#c586a5] rounded-sm"
                />
                {errors.quantity?.message && (
                    <p className="text-xs text-red-400 max-w-[300px]">{errors.quantity?.message.toString()}</p>
                )}
            </div>
            {/* size */}
            <div>
                <p className="mb-2">Các kích cỡ</p>
                <div className="flex gap-3">
                    {sizes.map((item) => (
                        <div
                            key={item.name}
                            onClick={() => {
                                setSelectedSizes((prev) =>
                                    prev.includes(item.name)
                                        ? prev.filter((s) => s !== item.name)
                                        : [...prev, item.name],
                                );
                            }}
                        >
                            <p
                                className={`${
                                    selectedSizes.includes(item.name) ? 'bg-pink-200' : 'bg-slate-200'
                                } px-3 py-1 cursor-pointer`}
                            >
                                {item.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {/* bestseller */}
            <div className="flex gap-2 mt-2">
                <input {...register('bestseller')} type="checkbox" id="bestseller" className="accent-[#c586a5]" />
                <label htmlFor="bestseller" className="cursor-pointer">
                    Thêm vào bán chạy nhất
                </label>
            </div>
            {/* button */}
            <button className="w-28 py-3 mt-4 bg-black text-white cursor-pointer">TẠO</button>
        </form>
    );
}
