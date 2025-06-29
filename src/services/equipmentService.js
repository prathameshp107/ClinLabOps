import { equipmentData, mockEquipmentMaintenanceHistory } from "@/data/equipment-data";

/**
 * Fetch all equipment
 * @returns {Promise<Array>} List of equipment
 */
export function getEquipments() {
    return Promise.resolve([...equipmentData]);
}

/**
 * Fetch equipment by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Equipment object or null
 */
export function getEquipmentById(id) {
    return Promise.resolve(equipmentData.find(e => e.id === id) || null);
}

/**
 * Create new equipment
 * @param {Object} equipment
 * @returns {Promise<Object>} Created equipment
 */
export function createEquipment(equipment) {
    const newEquipment = {
        ...equipment,
        id: `EQ-${Date.now().toString().slice(-6)}`,
        dateAdded: new Date().toISOString(),
    };
    equipmentData.push(newEquipment);
    return Promise.resolve(newEquipment);
}

/**
 * Update existing equipment
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated equipment or null
 */
export function updateEquipment(id, updates) {
    const idx = equipmentData.findIndex(e => e.id === id);
    if (idx === -1) return Promise.resolve(null);
    equipmentData[idx] = { ...equipmentData[idx], ...updates };
    return Promise.resolve(equipmentData[idx]);
}

/**
 * Delete equipment
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export function deleteEquipment(id) {
    const idx = equipmentData.findIndex(e => e.id === id);
    if (idx === -1) return Promise.resolve(false);
    equipmentData.splice(idx, 1);
    return Promise.resolve(true);
}

/**
 * Update equipment status
 * @param {string} id
 * @param {string} status
 * @returns {Promise<Object|null>} Updated equipment or null
 */
export function updateEquipmentStatus(id, status) {
    const equipment = equipmentData.find(e => e.id === id);
    if (!equipment) return Promise.resolve(null);
    equipment.status = status;
    return Promise.resolve(equipment);
}

/**
 * Get maintenance history for equipment
 * @param {string} equipmentId
 * @returns {Promise<Array>} Maintenance records
 */
export function getEquipmentMaintenanceHistory(equipmentId) {
    return Promise.resolve(mockEquipmentMaintenanceHistory.filter(m => m.equipmentId === equipmentId));
}

/**
 * Add a maintenance record to equipment
 * @param {string} equipmentId
 * @param {Object} record
 * @returns {Promise<Object>} Added record
 */
export function addEquipmentMaintenanceRecord(equipmentId, record) {
    const newRecord = {
        ...record,
        equipmentId,
        date: new Date().toISOString(),
    };
    mockEquipmentMaintenanceHistory.push(newRecord);
    return Promise.resolve(newRecord);
}

/**
 * Get files for equipment
 * @param {string} equipmentId
 * @returns {Promise<Array>} Files
 */
export function getEquipmentFiles(equipmentId) {
    const equipment = equipmentData.find(e => e.id === equipmentId);
    return Promise.resolve(equipment?.files || []);
}

/**
 * Add a file to equipment
 * @param {string} equipmentId
 * @param {Object} file
 * @returns {Promise<Object|null>} Added file or null
 */
export function addEquipmentFile(equipmentId, file) {
    const equipment = equipmentData.find(e => e.id === equipmentId);
    if (!equipment) return Promise.resolve(null);
    const newFile = { ...file, uploadedAt: new Date().toISOString() };
    equipment.files = [...(equipment.files || []), newFile];
    return Promise.resolve(newFile);
}

/**
 * Delete a file from equipment
 * @param {string} equipmentId
 * @param {string} fileName
 * @returns {Promise<boolean>} Success
 */
export function deleteEquipmentFile(equipmentId, fileName) {
    const equipment = equipmentData.find(e => e.id === equipmentId);
    if (!equipment || !equipment.files) return Promise.resolve(false);
    equipment.files = equipment.files.filter(f => f.name !== fileName);
    return Promise.resolve(true);
} 