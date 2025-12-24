import { assets } from '@/public/client/assets';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    return (
        <div className="flex flex-col sm:flex-row border border-gray-400">
            {/* left side */}
            <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
                <div className="text-[#414141]">
                    <div className="flex items-center gap-2">
                        <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                        <p className="font-medium text-sm md:text-base">SẢN PHẨM BÁN HÀNG NHẤT CỦA CHÚNG TÔI</p>
                    </div>
                    <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed font-prata">Hàng mới nhất</h1>
                    <div className="flex items-center gap-2">
                        <Link href={'/collection'} className="font-semibold text-sm md:text-base">
                            ĐẶT NGAY
                        </Link>
                        <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                    </div>
                </div>
            </div>
            {/* right side */}
            <Image src={assets.hero_img} alt="hero" className="w-full sm:w-1/2" />
        </div>
    );
}
