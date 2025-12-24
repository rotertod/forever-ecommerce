'use client';

import { useShop } from '@/context/ShopContext';
import { thousandSeparator } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductItem({
    id,
    images,
    name,
    price,
}: {
    id: string;
    images: { url: string }[];
    name: string;
    price: number;
}) {
    const { currency } = useShop();

    return (
        <Link href={`/product/${id}`} className="text-gray-700 cursor-pointer">
            <div className="overflow-hidden">
                <Image
                    src={images[0].url}
                    width={390}
                    height={450}
                    alt=""
                    className="hover:scale-110 transition ease-in-out"
                />
            </div>
            <p className="pt-3 pb-1 text-sm">{name}</p>
            <p className="text-sm font-medium">
                {thousandSeparator(price)} {currency}
            </p>
        </Link>
    );
}
