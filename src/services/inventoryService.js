import { inventoryData, suppliers, warehouses, warehouseItems } from "@/data/inventory-data";

/**
 * Fetch all inventory items
 * @returns {Promise<Array>} List of inventory items
 */
export function getInventoryItems() {
    return Promise.resolve([...inventoryData.items]);
}

/**
 * Fetch an inventory item by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Inventory item or null
 */
export function getInventoryItemById(id) {
    return Promise.resolve(inventoryData.items.find(i => i.id === id) || null);
}

/**
 * Create a new inventory item
 * @param {Object} item
 * @returns {Promise<Object>} Created item
 */
export function createInventoryItem(item) {
    const newItem = {
        ...item,
        id: `INV-${Date.now().toString().slice(-6)}`,
        lastRestocked: new Date().toISOString(),
    };
    inventoryData.items.push(newItem);
    return Promise.resolve(newItem);
}

/**
 * Update an inventory item
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated item or null
 */
export function updateInventoryItem(id, updates) {
    const idx = inventoryData.items.findIndex(i => i.id === id);
    if (idx === -1) return Promise.resolve(null);
    inventoryData.items[idx] = { ...inventoryData.items[idx], ...updates };
    return Promise.resolve(inventoryData.items[idx]);
}

/**
 * Delete an inventory item
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export function deleteInventoryItem(id) {
    const idx = inventoryData.items.findIndex(i => i.id === id);
    if (idx === -1) return Promise.resolve(false);
    inventoryData.items.splice(idx, 1);
    return Promise.resolve(true);
}

/**
 * Fetch all suppliers
 * @returns {Promise<Array>} List of suppliers
 */
export function getSuppliers() {
    return Promise.resolve([...suppliers]);
}

/**
 * Fetch a supplier by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Supplier or null
 */
export function getSupplierById(id) {
    return Promise.resolve(suppliers.find(s => s.id === id) || null);
}

/**
 * Create a new supplier
 * @param {Object} supplier
 * @returns {Promise<Object>} Created supplier
 */
export function createSupplier(supplier) {
    const newSupplier = {
        ...supplier,
        id: `SUP-${Date.now().toString().slice(-6)}`,
    };
    suppliers.push(newSupplier);
    return Promise.resolve(newSupplier);
}

/**
 * Update a supplier
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated supplier or null
 */
export function updateSupplier(id, updates) {
    const idx = suppliers.findIndex(s => s.id === id);
    if (idx === -1) return Promise.resolve(null);
    suppliers[idx] = { ...suppliers[idx], ...updates };
    return Promise.resolve(suppliers[idx]);
}

/**
 * Delete a supplier
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export function deleteSupplier(id) {
    const idx = suppliers.findIndex(s => s.id === id);
    if (idx === -1) return Promise.resolve(false);
    suppliers.splice(idx, 1);
    return Promise.resolve(true);
}

/**
 * Fetch all warehouses
 * @returns {Promise<Array>} List of warehouses
 */
export function getWarehouses() {
    return Promise.resolve([...warehouses]);
}

/**
 * Fetch a warehouse by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Warehouse or null
 */
export function getWarehouseById(id) {
    return Promise.resolve(warehouses.find(w => w.id === id) || null);
}

/**
 * Create a new warehouse
 * @param {Object} warehouse
 * @returns {Promise<Object>} Created warehouse
 */
export function createWarehouse(warehouse) {
    const newWarehouse = {
        ...warehouse,
        id: `WH-${Date.now().toString().slice(-6)}`,
    };
    warehouses.push(newWarehouse);
    return Promise.resolve(newWarehouse);
}

/**
 * Update a warehouse
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated warehouse or null
 */
export function updateWarehouse(id, updates) {
    const idx = warehouses.findIndex(w => w.id === id);
    if (idx === -1) return Promise.resolve(null);
    warehouses[idx] = { ...warehouses[idx], ...updates };
    return Promise.resolve(warehouses[idx]);
}

/**
 * Delete a warehouse
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export function deleteWarehouse(id) {
    const idx = warehouses.findIndex(w => w.id === id);
    if (idx === -1) return Promise.resolve(false);
    warehouses.splice(idx, 1);
    return Promise.resolve(true);
}

/**
 * Fetch all warehouse items
 * @returns {Promise<Array>} List of warehouse items
 */
export function getWarehouseItems() {
    return Promise.resolve([...warehouseItems]);
}

/**
 * Add an item to a warehouse
 * @param {Object} item
 * @returns {Promise<Object>} Added item
 */
export function addWarehouseItem(item) {
    warehouseItems.push(item);
    return Promise.resolve(item);
}

/**
 * Remove an item from a warehouse
 * @param {string} itemId
 * @returns {Promise<boolean>} Success
 */
export function removeWarehouseItem(itemId) {
    const idx = warehouseItems.findIndex(i => i.id === itemId);
    if (idx === -1) return Promise.resolve(false);
    warehouseItems.splice(idx, 1);
    return Promise.resolve(true);
} 