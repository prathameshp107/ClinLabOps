// Generate static params for enquiry pages
export async function generateStaticParams() {
  // In production, enquiries will be fetched from API
  // Return empty array to allow dynamic generation
  return [];
}

export default function EnquiryLayout({ children }) {
  return children;
}