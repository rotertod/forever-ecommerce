'use client';

import { useEffect, useState } from 'react';
import Title from '../helper/Title';
import ProductItem from './ProductItem';
import { useProductStore } from '@/store/productStore';

export default function LatestCollection() {
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const [latestProducts, setLatestProducts] = useState<typeof products>([]);

    useEffect(() => {
        setLatestProducts(products.filter((pro) => pro.quantity > 0).slice(0, 10));
    }, [products]);

    return (
        <div className="my-10">
            {/* heading */}
            <div className="text-center py-8 text-3xl">
                <Title text1="BỘ SƯU TẬP" text2="MỚI NHẤT" />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit iste aliquid et?
                </p>
            </div>
            {/* product list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {latestProducts.map((item) => (
                    <ProductItem key={item.id} id={item.id} images={item.images} name={item.name} price={item.price} />
                ))}
            </div>
        </div>
    );
}
