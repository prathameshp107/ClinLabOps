export async function generateStaticParams() {
  // Mock enquiry IDs - replace with your actual data source
  const enquiryIds = ["e1", "e2", "e3"];
  
  return enquiryIds.map(id => ({
    id: id,
  }));
}

export default function EnquiryLayout({ children }) {
  return children;
}