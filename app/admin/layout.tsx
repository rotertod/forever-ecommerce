import Navbar from '@/components/admin/home/Navbar';
import Sidebar from '@/components/admin/home/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="bg-gray-50 min-h-screen">
            <>
                <Navbar />
                <hr />
                <div className="flex w-full">
                    <Sidebar />
                    {children}
                </div>
            </>
        </section>
    );
}
