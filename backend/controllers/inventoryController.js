const { InventoryItem, Supplier, Warehouse, Order } = require('../models/Inventory');

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
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getInventoryItemById = async (req, res) => {
    try {
        const item = await InventoryItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createInventoryItem = async (req, res) => {
    try {
        const item = new InventoryItem(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateInventoryItem = async (req, res) => {
    try {
        const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteInventoryItem = async (req, res) => {
    try {
        const item = await InventoryItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
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
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SUPPLIERS
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ name: 1 });
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        await supplier.save();
        res.status(201).json(supplier);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
        res.json(supplier);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
        res.json({ message: 'Supplier deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// WAREHOUSES
exports.getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find().populate('items').sort({ name: 1 });
        res.json(warehouses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getWarehouseById = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id).populate('items');
        if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
        res.json(warehouse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createWarehouse = async (req, res) => {
    try {
        const warehouse = new Warehouse(req.body);
        await warehouse.save();
        res.status(201).json(warehouse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
        res.json(warehouse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
        if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
        res.json({ message: 'Warehouse deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ORDERS
exports.getAllOrders = async (req, res) => {
    try {
        const { status, supplier } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (supplier) filter.supplier = supplier;

        const orders = await Order.find(filter)
            .populate('supplier', 'name contactPerson')
            .populate('items.item', 'name category unit')
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('supplier')
            .populate('items.item');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        await order.populate('supplier', 'name contactPerson');
        await order.populate('items.item', 'name category unit');
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('supplier', 'name contactPerson')
            .populate('items.item', 'name category unit');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.approveOrder = async (req, res) => {
    try {
        const { approvedBy } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: 'Approved', approvedBy },
            { new: true }
        ).populate('supplier', 'name contactPerson');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.receiveOrder = async (req, res) => {
    try {
        const { actualDelivery, receivedItems } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Update order status
        order.status = 'Delivered';
        order.actualDelivery = actualDelivery || new Date();
        await order.save();

        // Update inventory stock levels
        if (receivedItems && receivedItems.length > 0) {
            for (const receivedItem of receivedItems) {
                const inventoryItem = await InventoryItem.findById(receivedItem.itemId);
                if (inventoryItem) {
                    inventoryItem.currentStock += receivedItem.quantity;
                    inventoryItem.lastRestocked = new Date();
                    await inventoryItem.save();
                }
            }
        }

        await order.populate('supplier', 'name contactPerson');
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DASHBOARD STATS
exports.getInventoryStats = async (req, res) => {
    try {
        const totalItems = await InventoryItem.countDocuments();
        const lowStockItems = await InventoryItem.countDocuments({
            $expr: { $lte: ['$currentStock', '$minStock'] }
        });
        const outOfStockItems = await InventoryItem.countDocuments({ currentStock: 0 });

        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const expiringItems = await InventoryItem.countDocuments({
            expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
        });

        const totalValue = await InventoryItem.aggregate([
            { $group: { _id: null, total: { $sum: { $multiply: ['$currentStock', '$cost'] } } } }
        ]);

        const categoryStats = await InventoryItem.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: { $multiply: ['$currentStock', '$cost'] } } } },
            { $sort: { count: -1 } }
        ]);

        const statusStats = await InventoryItem.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            totalItems,
            lowStockItems,
            outOfStockItems,
            expiringItems,
            totalValue: totalValue[0]?.total || 0,
            categoryStats,
            statusStats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};