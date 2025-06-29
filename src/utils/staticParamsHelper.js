// This file provides helper functions for generating static params

import { mockEnquiries } from "@/data/enquiries-data";

// You can replace these with actual data fetching functions
export const getProjectIds = () => {
  return ["p1", "p2", "p3", "p4", "p5"];
};

export const getTaskIds = () => {
  return ["t1", "t2", "t3", "t4", "t5"];
};

export const getEnquiryIds = () => {
  return mockEnquiries.map(e => e.id);
};

export const getSampleIds = () => {
  return ["s1", "s2", "s3"];
};

export const getUserIds = () => {
  return ["u1", "u2", "u3"];
};

// Add more helper functions for other entity types as needed