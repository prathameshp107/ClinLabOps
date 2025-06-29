// Service layer for Enquiries
import { mockEnquiries } from "@/data/enquiries-data";

let enquiries = [...mockEnquiries];

export const enquiryService = {
  getAll: () => Promise.resolve([...enquiries]),
  getById: (id) => Promise.resolve(enquiries.find(e => e.id === id)),
  create: (enquiry) => {
    const newEnquiry = { ...enquiry, id: `e${Date.now()}` };
    enquiries = [newEnquiry, ...enquiries];
    return Promise.resolve(newEnquiry);
  },
  update: (id, updates) => {
    enquiries = enquiries.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e);
    return Promise.resolve(enquiries.find(e => e.id === id));
  },
  delete: (id) => {
    enquiries = enquiries.filter(e => e.id !== id);
    return Promise.resolve(true);
  },
  addComment: (id, comment) => {
    enquiries = enquiries.map(e =>
      e.id === id ? { ...e, comments: [...(e.comments || []), comment] } : e
    );
    return Promise.resolve(enquiries.find(e => e.id === id));
  },
  assignTo: (id, user) => {
    enquiries = enquiries.map(e =>
      e.id === id ? { ...e, assignedTo: user } : e
    );
    return Promise.resolve(enquiries.find(e => e.id === id));
  },
  addActivity: (id, activity) => {
    enquiries = enquiries.map(e =>
      e.id === id ? { ...e, activities: [activity, ...(e.activities || [])] } : e
    );
    return Promise.resolve(enquiries.find(e => e.id === id));
  },
  uploadDocument: (id, document) => {
    enquiries = enquiries.map(e =>
      e.id === id ? { ...e, documents: [...(e.documents || []), document] } : e
    );
    return Promise.resolve(enquiries.find(e => e.id === id));
  },
  export: (format = "xlsx") => {
    // Simulate export logic
    return Promise.resolve(true);
  },
}; 