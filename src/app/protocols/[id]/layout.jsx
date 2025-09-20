// Generate static params for protocol pages
export async function generateStaticParams() {
    // In production, you might want to fetch actual protocol IDs
    // For now, return empty array to allow dynamic generation
    return [];
}

export default function ProtocolLayout({ children }) {
    return children;
}