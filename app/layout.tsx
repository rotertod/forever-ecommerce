import type { Metadata } from 'next';
import { Outfit, Prata } from 'next/font/google';
import './globals.css';
import ShopProvider from '@/context/ShopContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { StoreProvider } from '@/context/StoreContext';

const outfit = Outfit({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-outfit',
});

const prata = Prata({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-prata',
});

export const metadata: Metadata = {
    title: 'Forever',
    description: 'Build a E-commerce website',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <ShopProvider>
                <CartProvider>
                    <StoreProvider>
                        <html lang="en" suppressHydrationWarning>
                            <body className={`${outfit.variable} ${prata.variable} font-outfit antialiased`}>
                                <Toaster />
                                {children}
                            </body>
                        </html>
                    </StoreProvider>
                </CartProvider>
            </ShopProvider>
        </AuthProvider>
    );
}
