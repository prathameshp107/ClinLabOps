const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/authMiddleware');

// INVENTORY ITEMS ROUTES
router.get('/items', inventoryController.getAllInventoryItems);
router.get('/items/low-stock', inventoryController.getLowStockItems);
router.get('/items/expiring', inventoryController.getExpiringItems);
router.get('/items/:id', inventoryController.getInventoryItemById);
router.post('/items', inventoryController.createInventoryItem);
router.put('/items/:id', inventoryController.updateInventoryItem);
router.delete('/items/:id', inventoryController.deleteInventoryItem);
router.patch('/items/:id/stock', inventoryController.updateStock);

// SUPPLIERS ROUTES
router.get('/suppliers', inventoryController.getAllSuppliers);
router.get('/suppliers/:id', inventoryController.getSupplierById);
router.post('/suppliers', inventoryController.createSupplier);
router.put('/suppliers/:id', inventoryController.updateSupplier);
router.delete('/suppliers/:id', inventoryController.deleteSupplier);

// WAREHOUSES ROUTES
router.get('/warehouses', inventoryController.getAllWarehouses);
router.get('/warehouses/:id', inventoryController.getWarehouseById);
router.post('/warehouses', inventoryController.createWarehouse);
router.put('/warehouses/:id', inventoryController.updateWarehouse);
router.delete('/warehouses/:id', inventoryController.deleteWarehouse);

// ORDERS ROUTES
router.get('/orders', inventoryController.getAllOrders);
router.get('/orders/:id', inventoryController.getOrderById);
router.post('/orders', inventoryController.createOrder);
router.put('/orders/:id', inventoryController.updateOrder);
router.delete('/orders/:id', inventoryController.deleteOrder);

// DASHBOARD STATS
router.get('/stats', inventoryController.getInventoryStats);

module.exports = router;