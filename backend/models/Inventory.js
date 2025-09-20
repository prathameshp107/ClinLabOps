const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    currentStock: { type: Number, required: true, default: 0 },
    minStock: { type: Number, required: true, default: 0 },
    maxStock: { type: Number, required: true, default: 100 },
    unit: { type: String, required: true },
    location: { type: String, required: true },
    supplier: { type: String },
    cost: { type: Number, default: 0 },
    expiryDate: { type: Date },
    batchNumber: { type: String },
    status: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Expired'],
        default: 'In Stock'
    },
    lastRestocked: { type: Date, default: Date.now },
    notes: { type: String },
    barcode: { type: String },
    hazardous: { type: Boolean, default: false },
    storageConditions: { type: String },
    usageHistory: [{
        date: { type: Date, default: Date.now },
        quantity: { type: Number },
        user: { type: String },
        purpose: { type: String }
    }]
}, { timestamps: true });

const SupplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactPerson: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    website: { type: String },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    paymentTerms: { type: String },
    deliveryTime: { type: String },
    notes: { type: String }
}, { timestamps: true });

const WarehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    type: { type: String, enum: ['room', 'cabinet', 'shelf', 'refrigerator', 'freezer'], default: 'room' },
    currentUtilization: { type: Number, default: 0 },
    manager: { type: String },
    contact: { type: String },
    status: { type: String, enum: ['Active', 'Inactive', 'Maintenance'], default: 'Active' },
    temperature: { type: String },
    humidity: { type: String },
    securityLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' }]
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    items: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Ordered', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    orderDate: { type: Date, default: Date.now },
    expectedDelivery: { type: Date },
    actualDelivery: { type: Date },
    orderedBy: { type: String, required: true },
    approvedBy: { type: String },
    notes: { type: String }
}, { timestamps: true });

// Update status based on stock levels
InventoryItemSchema.pre('save', function (next) {
    if (this.currentStock <= 0) {
        this.status = 'Out of Stock';
    } else if (this.currentStock <= this.minStock) {
        this.status = 'Low Stock';
    } else if (this.expiryDate && this.expiryDate < new Date()) {
        this.status = 'Expired';
    } else {
        this.status = 'In Stock';
    }
    next();
});

// Generate order number
OrderSchema.pre('save', async function (next) {
    if (this.isNew && !this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `ORD-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

module.exports = {
    InventoryItem: mongoose.model('InventoryItem', InventoryItemSchema),
    Supplier: mongoose.model('Supplier', SupplierSchema),
    Warehouse: mongoose.model('Warehouse', WarehouseSchema),
    Order: mongoose.model('Order', OrderSchema)
};