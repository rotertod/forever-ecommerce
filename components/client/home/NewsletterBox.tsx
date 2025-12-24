'use client';

export default function NewsletterBox() {
    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <div className="text-center">
            <p className="text-2xl font-medium text-gray-800">Đăng ký ngay và được giảm giá 20%</p>
            <p className="text-gray-400 mt-3">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat, ipsum?
            </p>
            <form
                onSubmit={onSubmitHandler}
                className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
            >
                <input
                    type="email"
                    placeholder="Nhập vào địa chỉ email"
                    className="w-full sm:flex-1 outline-none"
                    required
                />
                <button className="bg-black text-white text-xs px-10 py-4">ĐĂNG KÝ</button>
            </form>
        </div>
    );
}
