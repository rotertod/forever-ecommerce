'use client';

import { useEffect, useState } from 'react';
import Title from './helper/Title';
import ProductItem from './home/ProductItem';
import { useProductStore } from '@/store/productStore';

export default function RelatedProducts({ category, subCategory }: { category: string; subCategory: string }) {
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const [related, setRelated] = useState<typeof products>([]);

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.filter((pro) => pro.quantity > 0).slice();

            productsCopy = productsCopy.filter((item) => category === item.category);
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);

            setRelated(productsCopy.slice(0, 5));
        }
    }, [category, subCategory, products]);

    return (
        <div className="my-24">
            <div className="text-center text-3xl py-2">
                <Title text1="SẢN PHẨM" text2="LIÊN QUAN" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {related.map((item) => (
                    <ProductItem key={item.id} id={item.id} images={item.images} name={item.name} price={item.price} />
                ))}
            </div>
        </div>
    );
}
