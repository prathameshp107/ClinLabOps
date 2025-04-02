export async function generateStaticParams() {
  // This should ideally fetch your project IDs from your data source
  const projectIds = ["p1", "p2", "p3"]; // Replace with your actual project IDs
  
  return projectIds.map(id => ({
    id: id,
  }));
}

export default function ProjectEditLayout({ children }) {
  return children;
}