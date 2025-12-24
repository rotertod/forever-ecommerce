'use client';

import { useShop } from '@/context/ShopContext';
import { deleteProductById } from '@/lib/actions/product.action';
import { thousandSeparator } from '@/lib/utils';
import { useProductStore } from '@/store/productStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { BiEdit } from 'react-icons/bi';
import { FiDelete } from 'react-icons/fi';

export default function ListProduct() {
    const { products, fetchProducts } = useProductStore();
    const { currency } = useShop();
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id: string) => {
        const result = await deleteProductById(id);
        if (result?.success) {
            toast.success('Xóa sản phẩm thành công!');
            fetchProducts(); // refresh danh sách
        } else {
            toast.error('Xóa thất bại!');
        }
    };

    return (
        <>
            <p className="mb-2">Danh sách sản phẩm</p>
            <div className="flex flex-col gap-2">
                {/* title */}
                <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
                    <b>Hình ảnh</b>
                    <b>Tên</b>
                    <b>Danh mục</b>
                    <b>Giá</b>
                    <b>Số lượng</b>
                    <b className="text-center">Nút</b>
                </div>
                {/* product list */}
                {products.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 border text-sm"
                    >
                        <Image src={item.images[0].url} alt="" width={48} height={48} />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>
                            {thousandSeparator(item.price)} {currency}
                        </p>
                        <p>{item.quantity}</p>
                        <div className="flex items-center gap-4 justify-center">
                            <p
                                onClick={() => router.push(`/admin/update-product/${item.id}`)}
                                className="text-right md:text-center cursor-pointer text-xl hover:text-[#c586a5] transition"
                            >
                                <BiEdit />
                            </p>
                            <p
                                onClick={() => handleDelete(item.id)}
                                className="text-right md:text-center cursor-pointer text-xl hover:text-[#c586a5] transition"
                            >
                                <FiDelete />
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
