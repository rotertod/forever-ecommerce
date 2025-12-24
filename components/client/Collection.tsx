'use client';

import { assets } from '@/public/client/assets';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Title from './helper/Title';
import ProductItem from './home/ProductItem';
import { useShop } from '@/context/ShopContext';
import { useProductStore } from '@/store/productStore';

export default function Collection() {
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const { search, showSearch } = useShop();

    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState<typeof products>([]);
    const [category, setCategory] = useState<string[]>([]);
    const [subCategory, setSubCategory] = useState<string[]>([]);
    const [sortType, setSortType] = useState('relavent');

    const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (category.includes(e.target.value)) {
            setCategory((prev) => prev.filter((item) => item !== e.target.value));
        } else {
            setCategory((prev) => [...prev, e.target.value]);
        }
    };

    const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
        } else {
            setSubCategory((prev) => [...prev, e.target.value]);
        }
    };

    const applyFilter = () => {
        let productsCopy = products.filter((pro) => pro.quantity > 0).slice();

        if (showSearch && search) {
            productsCopy = productsCopy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter((item) => category.includes(item.category));
        }

        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
        }

        setFilterProducts(productsCopy);
    };

    const sortProduct = () => {
        const fpCopy = filterProducts.slice();

        switch (sortType) {
            case 'low-high':
                setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
                break;
            case 'high-low':
                setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
                break;
            default:
                applyFilter();
                break;
        }
    };

    useEffect(() => {
        applyFilter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, subCategory, search, showSearch]);

    useEffect(() => {
        sortProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortType]);

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
            {/* filter options */}
            <div className="min-w-60">
                <p
                    onClick={() => setShowFilter(!showFilter)}
                    className="my-2 text-xl flex items-center cursor-pointer gap-2"
                >
                    BỘ LỌC{' '}
                    <Image
                        src={assets.dropdown_icon}
                        alt="dropdown"
                        className={`h-3 transition-all sm:hidden ${showFilter ? 'rotate-90' : ''}`}
                    />
                </p>
                {/* category filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 text-sm font-medium">CÁC DANH MỤC</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-black"
                                value={'Men'}
                                onChange={toggleCategory}
                            />{' '}
                            Nam
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-black"
                                value={'Women'}
                                onChange={toggleCategory}
                            />{' '}
                            Nữ
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-black"
                                value={'Kids'}
                                onChange={toggleCategory}
                            />{' '}
                            Trẻ em
                        </p>
                    </div>
                </div>
                {/* sub category filter */}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 text-sm font-medium">LOẠI</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-black"
                                value={'Topwear'}
                                onChange={toggleSubCategory}
                            />{' '}
                            Áo khoác ngoài
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-black"
                                value={'Bottomwear'}
                                onChange={toggleSubCategory}
                            />{' '}
                            Quần
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3 accent-black"
                                value={'Winterwear'}
                                onChange={toggleSubCategory}
                            />{' '}
                            Đồ mùa đông
                        </p>
                    </div>
                </div>
            </div>
            {/* right side */}
            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1="TẤT CẢ" text2="BỘ SƯU TẬP" />
                    {/* product sort */}
                    <select
                        onChange={(e) => setSortType(e.target.value)}
                        className="border-2 border-gray-300 text-sm px-2"
                    >
                        <option value="relavent">Sắp xếp theo: Có liên quan</option>
                        <option value="low-high">Sắp xếp theo: Thấp đến Cao</option>
                        <option value="high-low">Sắp xếp theo: Cao đến Thấp</option>
                    </select>
                </div>
                {/* list product */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                    {filterProducts.map((item) => (
                        <ProductItem
                            key={item.id}
                            id={item.id}
                            images={item.images}
                            name={item.name}
                            price={item.price}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
