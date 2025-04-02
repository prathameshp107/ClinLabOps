export async function generateStaticParams() {
  // Mock project IDs - replace with your actual data source
  const projectIds = ["p1", "p2", "p3", "p4", "p5"];
    
  return projectIds.map(id => ({
    id: id,
  }));
}

export default function ProjectEditLayout({ children }) {
  return children;
}
