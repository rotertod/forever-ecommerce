'use client';

import { getProductById, updateProduct } from '@/lib/actions/product.action';
import { uploadImagesToCloudinary } from '@/lib/upload';
import { productSchema, ProductSchema } from '@/lib/validation/product.form';
import { assets } from '@/public/admin/assets';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function UpdateProduct({ id }: { id: string }) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProductSchema>({
        resolver: zodResolver(productSchema()),
        defaultValues: {
            id,
        },
    });

    const [state, formAction] = useFormState(updateProduct, {
        success: false,
        error: false,
    });

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;

            try {
                const product = await getProductById(id);
                if (!product) {
                    toast.error('Product not found');
                    return;
                }

                // Set form values
                setValue('name', product.name);
                setValue('description', product.description);
                setValue('price', product.price);
                setValue('category', product.category!);
                setValue('subCategory', product.subCategory);
                setValue('quantity', product.quantity);
                setValue('bestseller', product.bestseller);

                // Set images
                if (product.images && product.images.length > 0) {
                    setPreviews(product.images.map((img) => img.url));
                }
            } catch (error) {
                console.error('Error fetching course:', error);
                toast.error('Failed to load course data');
            }
        };

        fetchProductData();
    }, [id, setValue]);

    // handle chọn file ảnh + preview
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
        try {
            // 1. Tạo một mảng để chứa kết quả cuối cùng (giữ đúng thứ tự)
            const finalImageUrls: string[] = [...previews];

            // 2. Lọc ra những file thực sự mới cần upload
            // Chúng ta dựa vào mảng `images` mà bạn đã set trong handleImageChange
            const filesToUpload: File[] = [];
            const fileIndices: number[] = [];

            images.forEach((file, index) => {
                if (file instanceof File) {
                    filesToUpload.push(file);
                    fileIndices.push(index); // Lưu lại vị trí để chèn trả lại sau khi upload
                }
            });

            // 3. Nếu có file mới, tiến hành upload
            if (filesToUpload.length > 0) {
                const uploadedUrls = await uploadImagesToCloudinary(filesToUpload);

                // 4. Ghi đè các URL mới upload vào đúng vị trí của nó trong mảng kết quả
                uploadedUrls.forEach((url, i) => {
                    const originalIndex = fileIndices[i];
                    finalImageUrls[originalIndex] = url;
                });
            }

            // 5. Lọc bỏ các phần tử trống (nếu người dùng không chọn đủ 4 ảnh)
            // và chỉ lấy những gì là URL hợp lệ
            const validImageUrls = finalImageUrls.filter((url) => url && !url.startsWith('blob:'));

            const dataWithImage = {
                ...formData,
                id,
                imageUrls: validImageUrls,
            };

            console.log('Dữ liệu gửi đi:', dataWithImage);
            formAction(dataWithImage);
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi tải ảnh lên Cloudinary');
        }
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast.success('Cập nhật sản phẩm thành công!!');
            router.push('/admin/list-product');
        } else if (state.error) {
            toast.error(state.message || 'Update failed');
        }
    }, [state, router]);

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full items-start gap-3">
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
                    placeholder="Tên sản phẩm"
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
                        placeholder="25"
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
            {/* bestseller */}
            <div className="flex gap-2 mt-2">
                <input {...register('bestseller')} type="checkbox" id="bestseller" className="accent-[#c586a5]" />
                <label htmlFor="bestseller" className="cursor-pointer">
                    Thêm vào bán chạy nhất
                </label>
            </div>
            {/* button */}
            <button type="submit" className="w-28 py-3 mt-4 bg-black text-white cursor-pointer">
                CẬP NHẬT
            </button>
        </form>
    );
}
