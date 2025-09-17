import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export async function middleware(request) {
    const url = request.nextUrl.clone();

    // Check if the request is for the API routes that should be proxied to the backend
    if (url.pathname.startsWith('/api/')) {
        // Create the backend URL by replacing the frontend origin with the backend URL
        const backendUrl = new URL(url.pathname + url.search, BACKEND_API_URL);

        // Forward the request to the backend
        const backendResponse = await fetch(backendUrl, {
            method: request.method,
            headers: {
                ...Object.fromEntries(request.headers),
                'Content-Type': 'application/json',
            },
            body: request.body,
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