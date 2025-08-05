// import { equipmentData, mockEquipmentMaintenanceHistory } from "@/data/equipment-data";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all equipment
 * @returns {Promise<Array>} List of equipment
 */
export async function getEquipments() {
    const res = await fetch(`${API_URL}/equipments`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch equipments');
    return res.json();
}

/**
 * Fetch equipment by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Equipment object or null
 */
export async function getEquipmentById(id) {
    const res = await fetch(`${API_URL}/equipments/${id}`, { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
}

/**
 * Create new equipment
 * @param {Object} equipment
 * @returns {Promise<Object>} Created equipment
 */
export async function createEquipment(equipment) {
    const res = await fetch(`${API_URL}/equipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(equipment),
    });
    if (!res.ok) throw new Error('Failed to create equipment');
    return res.json();
}

/**
 * Update existing equipment
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated equipment or null
 */
export async function updateEquipment(id, updates) {
    const res = await fetch(`${API_URL}/equipments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
    });
    if (!res.ok) return null;
    return res.json();
}

/**
 * Delete equipment
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteEquipment(id) {
    const res = await fetch(`${API_URL}/equipments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return res.ok;
}

/**
 * Update equipment status
 * @param {string} id
 * @param {string} status
 * @returns {Promise<Object|null>} Updated equipment or null
 */
export async function updateEquipmentStatus(id, status) {
    const res = await fetch(`${API_URL}/equipments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
    });
    if (!res.ok) return null;
    return res.json();
}

/**
 * Get maintenance history for equipment
 * @param {string} equipmentId
 * @returns {Promise<Array>} Maintenance records
 */
export async function getEquipmentMaintenanceHistory(equipmentId) {
    const res = await fetch(`${API_URL}/equipments/${equipmentId}/maintenance-history`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch maintenance history');
    return res.json();
}

/**
 * Add a maintenance record to equipment
 * @param {string} equipmentId
 * @param {Object} record
 * @returns {Promise<Object>} Added record
 */
export async function addEquipmentMaintenanceRecord(equipmentId, record) {
    const res = await fetch(`${API_URL}/equipments/${equipmentId}/maintenance-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error('Failed to add maintenance record');
    return res.json();
}

/**
 * Get files for equipment
 * @param {string} equipmentId
 * @returns {Promise<Array>} Files
 */
export async function getEquipmentFiles(equipmentId) {
    const res = await fetch(`${API_URL}/equipments/${equipmentId}/files`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch files');
    return res.json();
}

/**
 * Upload a file to equipment
 * @param {string} id
 * @param {File} file
 * @returns {Promise<Object>} Uploaded file info
 */
export async function uploadEquipmentFile(id, file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/equipments/${id}/files`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload file');
    return res.json();
}

/**
 * Delete a file from equipment
 * @param {string} equipmentId
 * @param {string} fileName
 * @returns {Promise<boolean>} Success
 */
export async function deleteEquipmentFile(equipmentId, fileName) {
    const res = await fetch(`${API_URL}/equipments/${equipmentId}/files/${fileName}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return res.ok;
} 