'use client';

import { sidebarLinks } from '@/public/admin/assets';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-[18%] min-h-screen border-r-2">
            <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
                {sidebarLinks.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg ${
                            pathname === item.href && 'bg-[#ffebf5] border-[#c586a5]'
                        }`}
                    >
                        <Image src={item.icon} alt="add" className="w-5 h-5" />
                        <p className="hidden md:block">{item.label}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
