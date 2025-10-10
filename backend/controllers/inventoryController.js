const { InventoryItem, Supplier, Warehouse, Order } = require('../models/Inventory');
const ActivityService = require('../services/activityService');

// INVENTORY ITEMS
exports.getAllInventoryItems = async (req, res) => {
    try {
        const { category, status, location, search } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (status) filter.status = status;
        if (location) filter.location = location;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { supplier: { $regex: search, $options: 'i' } }
            ];
        }

        const items = await InventoryItem.find(filter).sort({ updatedAt: -1 });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'inventory_items_listed',
                description: `${req.user.name} viewed inventory items list`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    itemCount: items.length,
                    filters: { category, status, location, search },
                    operation: 'list'
                }
            });
        }

        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getInventoryItemById = async (req, res) => {
    try {
        const item = await InventoryItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'inventory_item_viewed',
                description: `${req.user.name} viewed inventory item "${item.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    itemId: item._id,
                    itemName: item.name,
                    operation: 'view'
                }
            });
        }

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createInventoryItem = async (req, res) => {
    try {
        const item = new InventoryItem(req.body);
        await item.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'inventory_item_created',
                description: `${req.user.name} created inventory item "${item.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    itemId: item._id,
                    itemName: item.name,
                    operation: 'create'
                }
            });
        }

        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateInventoryItem = async (req, res) => {
    try {
        const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ error: 'Item not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'inventory_item_updated',
                description: `${req.user.name} updated inventory item "${item.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    itemId: item._id,
                    itemName: item.name,
                    operation: 'update'
                }
            });
        }

        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteInventoryItem = async (req, res) => {
    try {
        // Check if the ID is a valid ObjectId format
        if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'null') {
            return res.status(400).json({ error: 'Invalid item ID' });
        }

        const item = await InventoryItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'inventory_item_deleted',
                description: `${req.user.name} deleted inventory item "${item.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    itemName: item.name,
                    operation: 'delete'
                }
            });
        }

        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        // Handle invalid ObjectId format
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid item ID format' });
        }
        res.status(500).json({ error: err.message });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const { quantity, operation, user, purpose } = req.body;
        const item = await InventoryItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        if (operation === 'add') {
            item.currentStock += quantity;
        } else if (operation === 'subtract') {
            item.currentStock = Math.max(0, item.currentStock - quantity);
        } else {
            item.currentStock = quantity;
        }

        // Add to usage history
        item.usageHistory.push({
            quantity: operation === 'subtract' ? -quantity : quantity,
            user,
            purpose
        });

        await item.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'inventory_stock_updated',
                description: `${req.user.name} ${operation}ed ${quantity} units of "${item.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    itemId: item._id,
                    itemName: item.name,
                    operation: 'stock_update',
                    quantity: quantity,
                    operationType: operation
                }
            });
        }

        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getLowStockItems = async (req, res) => {
    try {
        const items = await InventoryItem.find({
            $expr: { $lte: ['$currentStock', '$minStock'] }
        }).sort({ currentStock: 1 });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'inventory_low_stock_items_viewed',
                description: `${req.user.name} viewed low stock items (${items.length} items)`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    itemCount: items.length,
                    operation: 'view_low_stock'
                }
            });
        }

        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getExpiringItems = async (req, res) => {
    try {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const items = await InventoryItem.find({
            expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
        }).sort({ expiryDate: 1 });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'inventory_expiring_items_viewed',
                description: `${req.user.name} viewed expiring items (${items.length} items)`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    itemCount: items.length,
                    operation: 'view_expiring'
                }
            });
        }

        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SUPPLIERS
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ name: 1 });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'suppliers_listed',
                description: `${req.user.name} viewed suppliers list`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    supplierCount: suppliers.length,
                    operation: 'list_suppliers'
                }
            });
        }

        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'supplier_viewed',
                description: `${req.user.name} viewed supplier "${supplier.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    supplierId: supplier._id,
                    supplierName: supplier.name,
                    operation: 'view_supplier'
                }
            });
        }

        res.json(supplier);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        await supplier.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'supplier_created',
                description: `${req.user.name} created supplier "${supplier.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    supplierId: supplier._id,
                    supplierName: supplier.name,
                    operation: 'create_supplier'
                }
            });
        }

        res.status(201).json(supplier);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'supplier_updated',
                description: `${req.user.name} updated supplier "${supplier.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    supplierId: supplier._id,
                    supplierName: supplier.name,
                    operation: 'update_supplier'
                }
            });
        }

        res.json(supplier);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'supplier_deleted',
                description: `${req.user.name} deleted supplier "${supplier.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    supplierName: supplier.name,
                    operation: 'delete_supplier'
                }
            });
        }

        res.json({ message: 'Supplier deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// WAREHOUSES
exports.getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find().sort({ name: 1 });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'warehouses_listed',
                description: `${req.user.name} viewed warehouses list`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    warehouseCount: warehouses.length,
                    operation: 'list_warehouses'
                }
            });
        }

        res.json(warehouses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getWarehouseById = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id);
        if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'warehouse_viewed',
                description: `${req.user.name} viewed warehouse "${warehouse.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    warehouseId: warehouse._id,
                    warehouseName: warehouse.name,
                    operation: 'view_warehouse'
                }
            });
        }

        res.json(warehouse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createWarehouse = async (req, res) => {
    try {
        const warehouse = new Warehouse(req.body);
        await warehouse.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'warehouse_created',
                description: `${req.user.name} created warehouse "${warehouse.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    warehouseId: warehouse._id,
                    warehouseName: warehouse.name,
                    operation: 'create_warehouse'
                }
            });
        }

        res.status(201).json(warehouse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'warehouse_updated',
                description: `${req.user.name} updated warehouse "${warehouse.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    warehouseId: warehouse._id,
                    warehouseName: warehouse.name,
                    operation: 'update_warehouse'
                }
            });
        }

        res.json(warehouse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
        if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'warehouse_deleted',
                description: `${req.user.name} deleted warehouse "${warehouse.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    warehouseName: warehouse.name,
                    operation: 'delete_warehouse'
                }
            });
        }

        res.json({ message: 'Warehouse deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ORDERS
exports.getAllOrders = async (req, res) => {
    try {
        const { status, supplierId } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (supplierId) filter.supplierId = supplierId;

        const orders = await Order.find(filter)
            .populate('supplierId', 'name')
            .populate('items.itemId', 'name')
            .sort({ createdAt: -1 });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'orders_listed',
                description: `${req.user.name} viewed orders list`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    orderCount: orders.length,
                    filters: { status, supplierId },
                    operation: 'list_orders'
                }
            });
        }

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('supplierId', 'name')
            .populate('items.itemId', 'name');
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'order_viewed',
                description: `${req.user.name} viewed order #${order.orderNumber}`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                    operation: 'view_order'
                }
            });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        // Generate order number
        const orderCount = await Order.countDocuments();
        const orderNumber = `ORD-${String(orderCount + 1).padStart(5, '0')}`;

        const order = new Order({
            ...req.body,
            orderNumber
        });
        await order.save();

        await order.populate('supplierId', 'name');
        await order.populate('items.itemId', 'name');

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'order_created',
                description: `${req.user.name} created order #${order.orderNumber}`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                    supplierId: order.supplierId,
                    totalAmount: order.totalAmount,
                    operation: 'create_order'
                }
            });
        }

        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('supplierId', 'name')
            .populate('items.itemId', 'name');
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'order_updated',
                description: `${req.user.name} updated order #${order.orderNumber}`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                    status: order.status,
                    operation: 'update_order'
                }
            });
        }

        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'order_deleted',
                description: `${req.user.name} deleted order #${order.orderNumber}`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    orderNumber: order.orderNumber,
                    operation: 'delete_order'
                }
            });
        }

        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Inventory statistics
exports.getInventoryStats = async (req, res) => {
    try {
        const totalItems = await InventoryItem.countDocuments();
        const lowStockItems = await InventoryItem.countDocuments({
            $expr: { $lte: ['$currentStock', '$minStock'] }
        });
        const expiringItems = await InventoryItem.countDocuments({
            expiryDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
        });

        const stats = {
            totalItems,
            lowStockItems,
            expiringItems,
            stockValue: 0 // This would need to be calculated based on item costs
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'inventory_stats_viewed',
                description: `${req.user.name} viewed inventory statistics`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    operation: 'view_stats'
                }
            });
        }

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get distinct storage locations
exports.getStorageLocations = async (req, res) => {
    try {
        const locations = await InventoryItem.distinct('location');

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'storage_locations_viewed',
                description: `${req.user.name} viewed storage locations`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    locationCount: locations.length,
                    operation: 'view_locations'
                }
            });
        }

        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Search inventory items
exports.searchInventoryItems = async (req, res) => {
    try {
        const { searchTerm, category, status } = req.query;

        const filter = {};

        if (searchTerm) {
            filter.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { sku: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        const items = await InventoryItem.find(filter).sort({ name: 1 });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'inventory_items_searched',
                description: `${req.user.name} searched inventory items with term "${searchTerm}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'inventory',
                    searchTerm: searchTerm,
                    categoryFilter: category,
                    statusFilter: status,
                    resultCount: items.length,
                    operation: 'search'
                }
            });
        }

        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};