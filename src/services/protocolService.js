import { protocolsData, mockAuditTrail, mockProtocolComments } from "@/data/protocols-data";

/**
 * Fetch all protocols
 * @returns {Promise<Array>} List of protocols
 */
export function getProtocols() {
    return Promise.resolve([...protocolsData]);
}

/**
 * Fetch a protocol by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Protocol object or null
 */
export function getProtocolById(id) {
    return Promise.resolve(protocolsData.find(p => p.id === id) || null);
}

/**
 * Create a new protocol
 * @param {Object} protocol
 * @returns {Promise<Object>} Created protocol
 */
export function createProtocol(protocol) {
    const newProtocol = {
        ...protocol,
        id: `PROT-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    protocolsData.push(newProtocol);
    return Promise.resolve(newProtocol);
}

/**
 * Update an existing protocol
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated protocol or null
 */
export function updateProtocol(id, updates) {
    const idx = protocolsData.findIndex(p => p.id === id);
    if (idx === -1) return Promise.resolve(null);
    protocolsData[idx] = { ...protocolsData[idx], ...updates, updatedAt: new Date().toISOString() };
    return Promise.resolve(protocolsData[idx]);
}

/**
 * Delete a protocol
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export function deleteProtocol(id) {
    const idx = protocolsData.findIndex(p => p.id === id);
    if (idx === -1) return Promise.resolve(false);
    protocolsData.splice(idx, 1);
    return Promise.resolve(true);
}

/**
 * Duplicate a protocol
 * @param {string} id
 * @returns {Promise<Object|null>} Duplicated protocol or null
 */
export function duplicateProtocol(id) {
    const protocol = protocolsData.find(p => p.id === id);
    if (!protocol) return Promise.resolve(null);
    const newProtocol = {
        ...protocol,
        id: `PROT-${Date.now()}`,
        title: `${protocol.title} (Copy)`,
        status: "Draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    protocolsData.push(newProtocol);
    return Promise.resolve(newProtocol);
}

/**
 * Archive a protocol
 * @param {string} id
 * @returns {Promise<Object|null>} Archived protocol or null
 */
export function archiveProtocol(id) {
    const protocol = protocolsData.find(p => p.id === id);
    if (!protocol) return Promise.resolve(null);
    protocol.status = "Archived";
    protocol.updatedAt = new Date().toISOString();
    return Promise.resolve(protocol);
}

/**
 * Restore an archived protocol
 * @param {string} id
 * @returns {Promise<Object|null>} Restored protocol or null
 */
export function restoreProtocol(id) {
    const protocol = protocolsData.find(p => p.id === id);
    if (!protocol) return Promise.resolve(null);
    protocol.status = "Draft";
    protocol.updatedAt = new Date().toISOString();
    return Promise.resolve(protocol);
}

/**
 * Get audit trail for a protocol
 * @param {string} protocolId
 * @returns {Promise<Array>} Audit trail entries
 */
export function getProtocolAuditTrail(protocolId) {
    return Promise.resolve(mockAuditTrail.filter(a => a.protocolId === protocolId));
}

/**
 * Get comments for a protocol
 * @param {string} protocolId
 * @returns {Promise<Array>} Comments
 */
export function getProtocolComments(protocolId) {
    return Promise.resolve(mockProtocolComments.filter(c => c.protocolId === protocolId));
}

/**
 * Add a comment to a protocol
 * @param {string} protocolId
 * @param {Object} comment
 * @returns {Promise<Object>} Added comment
 */
export function addProtocolComment(protocolId, comment) {
    const newComment = {
        ...comment,
        id: Date.now(),
        protocolId,
        date: new Date().toISOString(),
    };
    mockProtocolComments.push(newComment);
    return Promise.resolve(newComment);
}

/**
 * Delete a comment from a protocol
 * @param {number} commentId
 * @returns {Promise<boolean>} Success
 */
export function deleteProtocolComment(commentId) {
    const idx = mockProtocolComments.findIndex(c => c.id === commentId);
    if (idx === -1) return Promise.resolve(false);
    mockProtocolComments.splice(idx, 1);
    return Promise.resolve(true);
}

/**
 * Get files for a protocol
 * @param {string} protocolId
 * @returns {Promise<Array>} Files
 */
export function getProtocolFiles(protocolId) {
    const protocol = protocolsData.find(p => p.id === protocolId);
    return Promise.resolve(protocol?.files || []);
}

/**
 * Add a file to a protocol
 * @param {string} protocolId
 * @param {Object} file
 * @returns {Promise<Object|null>} Added file or null
 */
export function addProtocolFile(protocolId, file) {
    const protocol = protocolsData.find(p => p.id === protocolId);
    if (!protocol) return Promise.resolve(null);
    const newFile = { ...file, uploadedAt: new Date().toISOString() };
    protocol.files = [...(protocol.files || []), newFile];
    return Promise.resolve(newFile);
}

/**
 * Delete a file from a protocol
 * @param {string} protocolId
 * @param {string} fileName
 * @returns {Promise<boolean>} Success
 */
export function deleteProtocolFile(protocolId, fileName) {
    const protocol = protocolsData.find(p => p.id === protocolId);
    if (!protocol || !protocol.files) return Promise.resolve(false);
    protocol.files = protocol.files.filter(f => f.name !== fileName);
    return Promise.resolve(true);
} 