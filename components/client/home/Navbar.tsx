'use client';

import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import { assets, navLinks } from '@/public/client/assets';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useStore } from '@/context/StoreContext';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    const { setShowSearch } = useShop();
    const { isLoggedIn, logout } = useAuth();

    const role = Cookies.get('role');

    const { itemAmount } = useStore();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="flex items-center justify-between py-5 font-medium">
            {/* logo */}
            <Link href={'/'}>
                <Image src={assets.logo} alt="logo" className="w-36" />
            </Link>
            {/* nav links */}
            <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
                {navLinks.map((item) => (
                    <li key={item.id}>
                        <Link href={item.link} className="flex flex-col items-center gap-1">
                            <p>{item.label}</p>
                            {pathname === item.link && <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />}
                        </Link>
                    </li>
                ))}
            </ul>
            {/* right nav */}
            <div className="flex items-center gap-6">
                {/* search */}
                <Image
                    onClick={() => {
                        setShowSearch(true);
                        router.push('/collection');
                    }}
                    src={assets.search_icon}
                    alt="search"
                    className="w-5 cursor-pointer"
                />
                {/* profile */}
                <div className="group relative">
                    <Link href={'/sign-in'}>
                        <Image src={assets.profile_icon} alt="profile" className="w-5 cursor-pointer" />
                    </Link>
                    {/* dropdown */}
                    {isLoggedIn && (
                        <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                            <div className="flex flex-col gap-2 w-42 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                                {role === 'admin' && (
                                    <Link href={'/admin'} className="hover:text-black">
                                        Trang tổng quan
                                    </Link>
                                )}
                                <Link href={'/orders'} className="cursor-pointer hover:text-black">
                                    Đơn hàng
                                </Link>
                                <p onClick={handleLogout} className="cursor-pointer hover:text-black">
                                    Đăng xuất
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {/* cart */}
                <Link href={'/cart'} className="relative">
                    <Image src={assets.cart_icon} alt="cart" className="w-5 min-w-5" />
                    <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                        {itemAmount}
                    </p>
                </Link>
                {/* Menu icon */}
                <Image
                    onClick={() => setVisible(true)}
                    src={assets.menu_icon}
                    alt="menu icon"
                    className="w-5 cursor-pointer sm:hidden"
                />
            </div>
            {/* mobile nav */}
            <div
                className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
                    visible ? 'w-full' : 'w-0'
                }`}
            >
                <div className="flex flex-col text-gray-600">
                    {/* close */}
                    <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                        <Image src={assets.dropdown_icon} alt="dropdown" className="h-4 rotate-180" />
                        <p>Trở lại</p>
                    </div>
                    {/* nav links */}
                    {navLinks.map((item) => (
                        <Link
                            onClick={() => setVisible(false)}
                            key={item.id}
                            href={item.link}
                            className={`py-2 pl-6 border ${pathname === item.link && 'bg-black text-white'}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
