import SearchBar from '@/components/client/helper/SearchBar';
import Footer from '@/components/client/home/Footer';
import Navbar from '@/components/client/home/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <Navbar />
            <SearchBar />
            {children}
            <Footer />
        </section>
    );
}
