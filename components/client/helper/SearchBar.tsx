'use client';

import { useShop } from '@/context/ShopContext';
import { assets } from '@/public/client/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchBar() {
    const { search, setSearch, showSearch, setShowSearch } = useShop();
    const [visible, setVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [pathname]);

    return showSearch && visible ? (
        <div className="border-t border-b bg-gray-50 text-center">
            <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="flex-1 outline-none bg-inherit text-sm"
                />
                <Image src={assets.search_icon} alt="search" className="w-4" />
            </div>
            <Image
                onClick={() => setShowSearch(false)}
                src={assets.cross_icon}
                alt="cross"
                className="inline w-3 cursor-pointer"
            />
        </div>
    ) : null;
}
