const mongoose = require('mongoose');

const ComplianceItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Safety', 'Quality', 'Regulatory', 'Environmental', 'Data Protection', 'Other'],
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Compliant', 'Non-Compliant', 'Under Review', 'Action Required', 'Expired'],
        default: 'Under Review'
    },
    dueDate: { type: Date, required: true },
    completedDate: { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    department: { type: String },
    regulatoryBody: { type: String },
    requirements: [{ type: String }],
    evidence: [{
        type: { type: String, enum: ['Document', 'Certificate', 'Report', 'Photo', 'Other'] },
        name: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    actions: [{
        description: { type: String, required: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        dueDate: { type: Date },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed', 'Overdue'],
            default: 'Pending'
        },
        completedAt: { type: Date },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    lastReviewDate: { type: Date },
    nextReviewDate: { type: Date },
    reviewFrequency: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Bi-Annual'],
        default: 'Annual'
    },
    tags: [{ type: String }],
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const AuditSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['Internal', 'External', 'Regulatory', 'Compliance'],
        required: true
    },
    status: {
        type: String,
        enum: ['Planned', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Planned'
    },
    auditor: { type: String, required: true },
    auditDate: { type: Date, required: true },
    completedDate: { type: Date },
    scope: { type: String },
    department: { type: String },
    findings: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        severity: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium'
        },
        category: { type: String },
        recommendation: { type: String },
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
            default: 'Open'
        },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        dueDate: { type: Date },
        resolvedDate: { type: Date },
        evidence: [{ type: String }]
    }],
    overallRating: {
        type: String,
        enum: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Unsatisfactory']
    },
    reportUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const TrainingRecordSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: {
        type: String,
        enum: ['Safety', 'Compliance', 'Technical', 'Quality', 'General'],
        required: true
    },
    mandatory: { type: Boolean, default: false },
    duration: { type: Number }, // in hours
    validityPeriod: { type: Number }, // in months
    instructor: { type: String },
    trainingDate: { type: Date, required: true },
    expiryDate: { type: Date },
    attendees: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['Registered', 'Attended', 'Completed', 'Failed', 'Absent'],
            default: 'Registered'
        },
        score: { type: Number },
        certificateUrl: { type: String },
        completedAt: { type: Date }
    }],
    materials: [{
        name: { type: String },
        type: { type: String },
        url: { type: String }
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Indexes for better performance
ComplianceItemSchema.index({ status: 1, dueDate: 1 });
ComplianceItemSchema.index({ category: 1 });
ComplianceItemSchema.index({ assignedTo: 1 });
ComplianceItemSchema.index({ department: 1 });

AuditSchema.index({ status: 1, auditDate: 1 });
AuditSchema.index({ type: 1 });
AuditSchema.index({ department: 1 });

TrainingRecordSchema.index({ category: 1, trainingDate: 1 });
TrainingRecordSchema.index({ 'attendees.user': 1 });
TrainingRecordSchema.index({ mandatory: 1, expiryDate: 1 });

// Pre-save middleware to update status based on dates
ComplianceItemSchema.pre('save', function (next) {
    const now = new Date();
    if (this.dueDate < now && this.status !== 'Compliant') {
        this.status = 'Expired';
    }
    next();
});

TrainingRecordSchema.pre('save', function (next) {
    // Update attendee training expiry
    this.attendees.forEach(attendee => {
        if (attendee.status === 'Completed' && this.validityPeriod) {
            const expiryDate = new Date(this.trainingDate);
            expiryDate.setMonth(expiryDate.getMonth() + this.validityPeriod);
            this.expiryDate = expiryDate;
        }
    });
    next();
});

module.exports = {
    ComplianceItem: mongoose.model('ComplianceItem', ComplianceItemSchema),
    Audit: mongoose.model('Audit', AuditSchema),
    TrainingRecord: mongoose.model('TrainingRecord', TrainingRecordSchema)
};