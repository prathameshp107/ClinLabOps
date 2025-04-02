// Define the mock data in the layout file
const mockEnquiries = [
  {
    id: "e1",
    // Add other properties as needed
  },
  {
    id: "e2",
    // Add other properties as needed
  }
];

export async function generateStaticParams() {
  return mockEnquiries.map((enquiry) => ({
    id: enquiry.id,
  }));
}

export default function EnquiryLayout({ children }) {
  return children;
}