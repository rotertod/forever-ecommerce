'use client';

import { useAuth } from '@/context/AuthContext';
import { assets } from '@/public/admin/assets';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="flex items-center py-2 px-[4%] justify-between">
            <Link href={'/admin'}>
                <Image src={assets.logo} alt="logo" className="w-36" />
            </Link>
            <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
            >
                Đăng xuất
            </button>
        </div>
    );
}
