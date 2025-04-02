import { mockEnquiries } from './data';

export async function generateStaticParams() {
  return mockEnquiries.map((enquiry) => ({
    id: enquiry.id,
  }));
}

export default function EnquiryLayout({ children }) {
  return children;
}