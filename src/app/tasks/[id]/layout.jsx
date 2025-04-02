export async function generateStaticParams() {
  // Mock task IDs - replace with your actual data source in production
  const taskIds = ["t1", "t2", "t3", "t4", "t5"];
  
  return taskIds.map(id => ({
    id: id,
  }));
}

export default function TaskLayout({ children }) {
  return children;
}