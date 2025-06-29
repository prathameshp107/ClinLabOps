import {
  mockExperiments,
  mockExperimentsFull,
  experimentProgressData,
  experimentsDashboardData
} from "@/data/experiments-data";

/**
 * Fetch all experiments (full objects)
 * @returns {Promise<Array>} List of experiments
 */
export function getExperiments() {
  return Promise.resolve([...mockExperimentsFull]);
}

/**
 * Fetch a simple list of experiments (id, name)
 * @returns {Promise<Array>} List of experiments (id, name)
 */
export function getExperimentList() {
  return Promise.resolve([...mockExperiments]);
}

/**
 * Fetch a single experiment by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Experiment object or null
 */
export function getExperimentById(id) {
  const exp = mockExperimentsFull.find(e => e.id === id) || null;
  return Promise.resolve(exp);
}

/**
 * Create a new experiment
 * @param {Object} experimentData
 * @returns {Promise<Object>} Created experiment
 */
export function createExperiment(experimentData) {
  const newExp = { ...experimentData, id: `exp-${Date.now()}` };
  return Promise.resolve(newExp);
}

/**
 * Update an experiment
 * @param {string} id
 * @param {Object} experimentData
 * @returns {Promise<Object|null>} Updated experiment or null
 */
export function updateExperiment(id, experimentData) {
  const exp = mockExperimentsFull.find(e => e.id === id);
  if (!exp) return Promise.resolve(null);
  const updated = { ...exp, ...experimentData };
  return Promise.resolve(updated);
}

/**
 * Delete an experiment
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export function deleteExperiment(id) {
  const exists = mockExperimentsFull.some(e => e.id === id);
  return Promise.resolve(exists);
}

/**
 * Get experiment progress data (for analytics/charts)
 */
export function getExperimentProgress() {
  return Promise.resolve([...experimentProgressData]);
}

/**
 * Get experiment types (for dashboard analytics)
 */
export function getExperimentTypes() {
  return Promise.resolve([...experimentsDashboardData.experimentTypes]);
}

/**
 * Get experiment dashboard summary (active, completed, types, success rates)
 */
export function getExperimentDashboard() {
  return Promise.resolve({ ...experimentsDashboardData });
}

/**
 * Get the team for a given experiment
 * @param {string} id
 * @returns {Promise<Array>} Team members
 */
export function getExperimentTeam(id) {
  const exp = mockExperimentsFull.find(e => e.id === id);
  return Promise.resolve(exp?.teamMembers || []);
}

/**
 * Get version history for a given experiment
 * @param {string} id
 * @returns {Promise<Array>} Version history
 */
export function getExperimentVersionHistory(id) {
  const exp = mockExperimentsFull.find(e => e.id === id);
  return Promise.resolve(exp?.versionHistory || []);
}

/**
 * Get all active experiments
 */
export function getActiveExperiments() {
  return Promise.resolve([...experimentsDashboardData.activeExperiments]);
}

/**
 * Get all completed experiments
 */
export function getCompletedExperiments() {
  return Promise.resolve([...experimentsDashboardData.completedExperiments]);
} 