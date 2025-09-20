import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// INVENTORY ITEMS

/**
 * Fetch all inventory items
 * @param {Object} params - Query parameters (category, status, location, search)
 * @returns {Promise<Array>} List of inventory items
 */
export async function getInventoryItems(params = {}) {
    try {
        const response = await api.get('/inventory/items', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        throw error;
    }
}

/**
 * Fetch an inventory item by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Inventory item or null
 */
export async function getInventoryItemById(id) {
    try {
        const response = await api.get(`/inventory/items/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error fetching inventory item:', error);
        throw error;
    }
}

/**
 * Create a new inventory item
 * @param {Object} item
 * @returns {Promise<Object>} Created item
 */
export async function createInventoryItem(item) {
    try {
        const response = await api.post('/inventory/items', item);
        return response.data;
    } catch (error) {
        console.error('Error creating inventory item:', error);
        // Extract validation error message if available
        if (error.response?.data?.error) {
            const errorMessage = error.response.data.error;
            throw new Error(errorMessage);
        }
        throw error;
    }
}

/**
 * Update an inventory item
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated item or null
 */
export async function updateInventoryItem(id, updates) {
    try {
        const response = await api.put(`/inventory/items/${id}`, updates);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error updating inventory item:', error);
        throw error;
    }
}

/**
 * Delete an inventory item
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteInventoryItem(id) {
    try {
        await api.delete(`/inventory/items/${id}`);
        return true;
    } catch (error) {
        if (error.response?.status === 404) {
            return false;
        }
        console.error('Error deleting inventory item:', error);
        throw error;
    }
}

/**
 * Update stock levels for an inventory item
 * @param {string} id
 * @param {Object} stockUpdate - { quantity, operation, user, purpose }
 * @returns {Promise<Object>} Updated item
 */
export async function updateStock(id, stockUpdate) {
    try {
        const response = await api.patch(`/inventory/items/${id}/stock`, stockUpdate);
        return response.data;
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
}

/**
 * Get low stock items
 * @returns {Promise<Array>} List of low stock items
 */
export async function getLowStockItems() {
    try {
        const response = await api.get('/inventory/items/low-stock');
        return response.data;
    } catch (error) {
        console.error('Error fetching low stock items:', error);
        throw error;
    }
}

/**
 * Get expiring items
 * @returns {Promise<Array>} List of expiring items
 */
export async function getExpiringItems() {
    try {
        const response = await api.get('/inventory/items/expiring');
        return response.data;
    } catch (error) {
        console.error('Error fetching expiring items:', error);
        throw error;
    }
}

// SUPPLIERS

/**
 * Fetch all suppliers
 * @returns {Promise<Array>} List of suppliers
 */
export async function getSuppliers() {
    try {
        const response = await api.get('/inventory/suppliers');
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }
}

/**
 * Fetch a supplier by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Supplier or null
 */
export async function getSupplierById(id) {
    try {
        const response = await api.get(`/inventory/suppliers/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error fetching supplier:', error);
        throw error;
    }
}

/**
 * Create a new supplier
 * @param {Object} supplier
 * @returns {Promise<Object>} Created supplier
 */
export async function createSupplier(supplier) {
    try {
        const response = await api.post('/inventory/suppliers', supplier);
        return response.data;
    } catch (error) {
        console.error('Error creating supplier:', error);
        throw error;
    }
}

/**
 * Update a supplier
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated supplier or null
 */
export async function updateSupplier(id, updates) {
    try {
        const response = await api.put(`/inventory/suppliers/${id}`, updates);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error updating supplier:', error);
        throw error;
    }
}

/**
 * Delete a supplier
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteSupplier(id) {
    try {
        await api.delete(`/inventory/suppliers/${id}`);
        return true;
    } catch (error) {
        if (error.response?.status === 404) {
            return false;
        }
        console.error('Error deleting supplier:', error);
        throw error;
    }
}

// WAREHOUSES

/**
 * Fetch all warehouses
 * @returns {Promise<Array>} List of warehouses
 */
export async function getWarehouses() {
    try {
        const response = await api.get('/inventory/warehouses');
        return response.data;
    } catch (error) {
        console.error('Error fetching warehouses:', error);
        throw error;
    }
}

/**
 * Fetch a warehouse by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Warehouse or null
 */
export async function getWarehouseById(id) {
    try {
        const response = await api.get(`/inventory/warehouses/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error fetching warehouse:', error);
        throw error;
    }
}

/**
 * Create a new warehouse
 * @param {Object} warehouse
 * @returns {Promise<Object>} Created warehouse
 */
export async function createWarehouse(warehouse) {
    try {
        const response = await api.post('/inventory/warehouses', warehouse);
        return response.data;
    } catch (error) {
        console.error('Error creating warehouse:', error);
        throw error;
    }
}

/**
 * Update a warehouse
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated warehouse or null
 */
export async function updateWarehouse(id, updates) {
    try {
        const response = await api.put(`/inventory/warehouses/${id}`, updates);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error updating warehouse:', error);
        throw error;
    }
}

/**
 * Delete a warehouse
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteWarehouse(id) {
    try {
        await api.delete(`/inventory/warehouses/${id}`);
        return true;
    } catch (error) {
        if (error.response?.status === 404) {
            return false;
        }
        console.error('Error deleting warehouse:', error);
        throw error;
    }
}

// ORDERS

/**
 * Fetch all orders
 * @param {Object} params - Query parameters (status, supplier)
 * @returns {Promise<Array>} List of orders
 */
export async function getOrders(params = {}) {
    try {
        const response = await api.get('/inventory/orders', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

/**
 * Fetch an order by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Order or null
 */
export async function getOrderById(id) {
    try {
        const response = await api.get(`/inventory/orders/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error fetching order:', error);
        throw error;
    }
}

/**
 * Create a new order
 * @param {Object} order
 * @returns {Promise<Object>} Created order
 */
export async function createOrder(order) {
    try {
        const response = await api.post('/inventory/orders', order);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

/**
 * Update an order
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated order or null
 */
export async function updateOrder(id, updates) {
    try {
        const response = await api.put(`/inventory/orders/${id}`, updates);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error updating order:', error);
        throw error;
    }
}

/**
 * Delete an order
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteOrder(id) {
    try {
        await api.delete(`/inventory/orders/${id}`);
        return true;
    } catch (error) {
        if (error.response?.status === 404) {
            return false;
        }
        console.error('Error deleting order:', error);
        throw error;
    }
}

/**
 * Approve an order
 * @param {string} id
 * @param {string} approvedBy
 * @returns {Promise<Object>} Approved order
 */
export async function approveOrder(id, approvedBy) {
    try {
        const response = await api.patch(`/inventory/orders/${id}/approve`, { approvedBy });
        return response.data;
    } catch (error) {
        console.error('Error approving order:', error);
        throw error;
    }
}

/**
 * Receive an order
 * @param {string} id
 * @param {Object} receiveData - { actualDelivery, receivedItems }
 * @returns {Promise<Object>} Received order
 */
export async function receiveOrder(id, receiveData) {
    try {
        const response = await api.patch(`/inventory/orders/${id}/receive`, receiveData);
        return response.data;
    } catch (error) {
        console.error('Error receiving order:', error);
        throw error;
    }
}

// STATISTICS

/**
 * Get inventory statistics
 * @returns {Promise<Object>} Inventory statistics
 */
export async function getInventoryStats() {
    try {
        const response = await api.get('/inventory/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory stats:', error);
        throw error;
    }
}

// Legacy functions for backward compatibility
export function getWarehouseItems() {
    return getInventoryItems();
}

export function addWarehouseItem(item) {
    return createInventoryItem(item);
}

export function removeWarehouseItem(itemId) {
    return deleteInventoryItem(itemId);
} 