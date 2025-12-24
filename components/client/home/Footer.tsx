import { assets } from '@/public/client/assets';
import Image from 'next/image';

export default function Footer() {
    return (
        <div>
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                {/* col 1 */}
                <div>
                    <Image src={assets.logo} alt="logo" className="mb-5 w-32" />
                    <p className="w-full md:w-2/3 text-gray-600">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas ipsa nam fugiat numquam. Eos
                        expedita tempora quod, accusantium et provident corporis debitis! Non quibusdam itaque ipsam
                        cumque, hic pariatur voluptatibus.
                    </p>
                </div>
                {/* col 2 */}
                <div>
                    <p className="text-xl font-medium mb-5">CÔNG TY</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>Trang chủ</li>
                        <li>Về chúng tôi</li>
                        <li>Giao hàng</li>
                        <li>Điều khoản</li>
                    </ul>
                </div>
                {/* col 3 */}
                <div>
                    <p className="text-xl font-medium mb-5">LIÊN HỆ</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>+1-221-345-7890</li>
                        <li>contact@foreveryou.com</li>
                    </ul>
                </div>
            </div>
            {/* copyright */}
            <div>
                <hr />
                <p className="py-5 text-sm text-center">Bản quyền 2025 &copy; forever.com - All rights reserved.</p>
            </div>
        </div>
    );
}
