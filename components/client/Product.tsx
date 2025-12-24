'use client';

import { useShop } from '@/context/ShopContext';
import { assets } from '@/public/client/assets';
import Image from 'next/image';
import { useState } from 'react';
import RelatedProducts from './RelatedProducts';
import { useStore } from '@/context/StoreContext';
import toast from 'react-hot-toast';
import { thousandSeparator } from '@/lib/utils';

type ProductType = {
    id: string;
    name: string;
    description: string;
    price: number;
    images: { url: string }[];
    category: string;
    subCategory: string;
    sizes: { name: string }[];
    bestseller: boolean;
};

export default function Product({ product }: { product: ProductType | null }) {
    const { currency } = useShop();
    const [imageSelected, setImageSelected] = useState(product?.images[0].url);
    const [sizeSelected, setSizeSelected] = useState(product?.sizes[0].name);

    const { handleAddToCart } = useStore();

    const handleAddToCartWithSizeCheck = () => {
        if (!sizeSelected) {
            toast.error('Vui lòng chọn kích thước trước khi thêm vào giỏ hàng!');
            return;
        }
        handleAddToCart(product?.id || '', sizeSelected);
        console.log('Added to cart with size:', sizeSelected);
    };

    return product ? (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
            {/* product */}
            <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
                {/* images */}
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                        {product.images.map((item, index) => (
                            <Image
                                onClick={() => setImageSelected(item.url)}
                                src={item.url}
                                width={50}
                                height={50}
                                key={index}
                                alt=""
                                className="w-[24%] object-cover sm:w-full sm:mb-3 shrink-0 cursor-pointer"
                            />
                        ))}
                    </div>
                    <div className="w-full sm:w-[80%]">
                        <Image
                            src={imageSelected ? imageSelected : ''}
                            alt="image"
                            width={482}
                            height={556}
                            className="w-full h-auto"
                        />
                    </div>
                </div>
                {/* info */}
                <div className="flex-1">
                    {/* name */}
                    <h1 className="font-medium text-2xl mt-2">{product.name}</h1>
                    {/* stars */}
                    <div className="flex items-center gap-1 mt-2">
                        <Image src={assets.star_icon} alt="" className="w-3" />
                        <Image src={assets.star_icon} alt="" className="w-3" />
                        <Image src={assets.star_icon} alt="" className="w-3" />
                        <Image src={assets.star_icon} alt="" className="w-3" />
                        <Image src={assets.star_dull_icon} alt="" className="w-3" />
                        <p className="pl-2">(122)</p>
                    </div>
                    {/* price */}
                    <p className="mt-5 text-3xl font-medium">
                        {thousandSeparator(product.price)} {currency}
                    </p>
                    {/* desc */}
                    <p className="mt-5 text-gray-500 md:w-4/5">{product.description}</p>
                    {/* sizes */}
                    <div className="flex flex-col gap-4 my-8">
                        <p>Select Size</p>
                        <div className="flex gap-2">
                            {product.sizes.map((item) => (
                                <button
                                    onClick={() => setSizeSelected(item.name)}
                                    key={item.name}
                                    className={`border py-2 px-4 bg-gray-50 cursor-pointer ${
                                        item.name === sizeSelected ? 'border-orange-500' : ''
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* add to cart */}
                    <button
                        onClick={handleAddToCartWithSizeCheck}
                        className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer"
                    >
                        THÊM VÀO GIỎ HÀNG
                    </button>
                    <hr className="mt-8 sm:w-4/5" />
                    {/* policy */}
                    <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                        <p>Sản phẩm chính hãng 100%.</p>
                        <p>Sản phẩm này có sẵn tiền mặt khi giao hàng.</p>
                        <p>Chính sách đổi trả dễ dàng trong vòng 7 ngày.</p>
                    </div>
                </div>
            </div>
            {/* description & Review */}
            <div className="mt-20">
                <div className="flex">
                    <b className="border px-5 py-3 text-sm">Mô tả</b>
                    <p className="border px-5 py-3 text-sm">Đánh giá (122)</p>
                </div>
                <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam cum repellendus sint voluptate
                        soluta nulla quia assumenda id eligendi, facilis tempora officiis accusantium voluptatibus!
                        Nulla totam nesciunt quam nemo ea voluptatum architecto repellat blanditiis natus reprehenderit
                        exercitationem quae repellendus at explicabo, quos iusto, fuga impedit voluptas dignissimos
                        illum. Placeat, debitis deleniti velit animi itaque cum nam iure ducimus laborum modi!
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorem fuga nam sapiente! Sequi
                        necessitatibus tempore error commodi, nisi consequuntur qui, accusamus molestias sunt ducimus
                        explicabo reiciendis dolore odit, exercitationem fugit quos atque nostrum quisquam perferendis
                        unde impedit laboriosam? Rem, voluptates.
                    </p>
                </div>
            </div>
            {/* related product */}
            <RelatedProducts category={product.category} subCategory={product.subCategory} />
        </div>
    ) : (
        <div className="opacity-0"></div>
    );
}
