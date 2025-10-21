import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL = process.env.BACKEND_URL;

export async function middleware(request) {
    const url = request.nextUrl.clone();

    // Check if the request is for the API routes that should be proxied to the backend
    if (url.pathname.startsWith('/api/')) {
        // Create the backend URL by replacing the frontend origin with the backend URL
        const backendUrl = new URL(url.pathname + url.search, BACKEND_API_URL);

        // Prepare headers - preserve all original headers and add Content-Type if not present
        const headers = new Headers(request.headers);
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        // Forward the request to the backend
        const backendResponse = await fetch(backendUrl, {
            method: request.method,
            headers: headers,
            body: request.body,
            redirect: 'manual'
        });

        // Create a new response with the backend response data
        const responseData = await backendResponse.arrayBuffer();
        return new NextResponse(responseData, {
            status: backendResponse.status,
            headers: {
                'Content-Type': backendResponse.headers.get('Content-Type') || 'application/json',
            },
        });
    }

    // For non-API routes, continue with the normal response
    return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        '/api/:path*',
    ],
};