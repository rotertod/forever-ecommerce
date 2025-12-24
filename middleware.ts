import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Paths that don't require authentication
const publicPaths = ['/sign-in', '/sign-up'];

interface DecodedToken {
    userId: string;
    role: string;
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token');

    // If user is logged in and trying to access public paths, redirect to home
    if (token && publicPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If no token and trying to access protected paths, redirect to sign-in
    if (!token && !publicPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // If has token, check role-based access
    if (token) {
        try {
            // Decode token to get user role
            const decoded = jwtDecode(token.value) as DecodedToken;

            // Check if path starts with /admin
            if (request.nextUrl.pathname.startsWith('/admin')) {
                // Only allow admin role to access admin paths
                if (decoded.role !== 'admin') {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // If token is invalid, redirect to sign-in
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }

    return NextResponse.next();
}

// Update matcher to include admin paths
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/admin/:path*', // Match all paths starting with /admin
    ],
};
