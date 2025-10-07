import axios from 'axios';

const API_URL = '/api/activities';

export async function getActivities(params = {}) {
  // params can include project for filtering
  const res = await axios.get(API_URL, { params });
  return res.data;
}

export async function getProjectActivities(projectId, params = {}) {
  // Fetch activities for a specific project
  const res = await axios.get(API_URL, {
    params: {
      projectId,
      ...params
    }
  });
  return res.data;
}

export async function createActivity(activityData) {
  const res = await axios.post(API_URL, activityData);
  return res.data;
}

export async function deleteActivity(id) {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
}