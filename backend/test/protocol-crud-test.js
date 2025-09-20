require('dotenv').config();
const mongoose = require('mongoose');
const Protocol = require('../models/Protocol');
const User = require('../models/User');

async function testProtocolCRUD() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Validate required test environment variables
        if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_USER_PASSWORD || !process.env.DEFAULT_ADMIN_NAME) {
            throw new Error('Missing required test environment variables: TEST_ADMIN_EMAIL, TEST_USER_PASSWORD, DEFAULT_ADMIN_NAME');
        }

        // Find or create a test user
        let testUser = await User.findOne({ email: process.env.TEST_ADMIN_EMAIL });
        if (!testUser) {
            console.log('Creating test user...');
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash(process.env.TEST_USER_PASSWORD, 10);
            testUser = await User.create({
                name: process.env.DEFAULT_ADMIN_NAME,
                email: process.env.TEST_ADMIN_EMAIL,
                password: hashedPassword,
                roles: ['Admin', 'User'],
                department: 'Testing',
                status: 'Active'
            });
        }
        console.log('✅ Test user ready:', testUser.email, testUser._id);

        // Test 1: Create a protocol
        console.log('\n📝 Testing Protocol Creation...');
        const testProtocol = {
            name: 'Test Protocol ' + Date.now(),
            description: 'This is a test protocol to verify database operations',
            category: 'Molecular Biology',
            version: '1.0',
            status: 'Draft',
            steps: [
                {
                    number: 1,
                    title: 'Step 1',
                    instructions: 'First step instructions',
                    duration: '5 minutes',
                    notes: 'Important notes'
                }
            ],
            materials: [
                {
                    name: 'Test material',
                    quantity: '1 unit',
                    notes: 'Test notes'
                }
            ],
            safetyNotes: 'Safety first!',
            references: ['Test reference'],
            isPublic: false,
            tags: ['test', 'verification'],
            createdBy: testUser._id
        };

        const createdProtocol = await Protocol.create(testProtocol);
        console.log('✅ Protocol created successfully:', createdProtocol._id);

        // Test 2: Read the protocol
        console.log('\n👀 Testing Protocol Retrieval...');
        const foundProtocol = await Protocol.findById(createdProtocol._id)
            .populate('createdBy', 'name email');
        console.log('✅ Protocol retrieved:', foundProtocol.name);
        console.log('   Created by:', foundProtocol.createdBy.name);

        // Test 3: Update the protocol
        console.log('\n✏️ Testing Protocol Update...');
        foundProtocol.status = 'In Review';
        foundProtocol.description = 'Updated description';
        await foundProtocol.save();
        console.log('✅ Protocol updated successfully');

        // Test 4: List all protocols
        console.log('\n📋 Testing Protocol Listing...');
        const allProtocols = await Protocol.find({ isDeleted: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('createdBy', 'name email');
        console.log('✅ Found', allProtocols.length, 'protocols');
        allProtocols.forEach(p => {
            console.log(`   - ${p.name} (${p.status}) by ${p.createdBy.name}`);
        });

        // Test 5: Archive the protocol
        console.log('\n📦 Testing Protocol Archive...');
        foundProtocol.isArchived = true;
        foundProtocol.archivedAt = new Date();
        await foundProtocol.save();
        console.log('✅ Protocol archived successfully');

        // Test 6: Restore the protocol
        console.log('\n📦 Testing Protocol Restore...');
        foundProtocol.isArchived = false;
        foundProtocol.archivedAt = null;
        await foundProtocol.save();
        console.log('✅ Protocol restored successfully');

        // Test 7: Duplicate the protocol
        console.log('\n📋 Testing Protocol Duplication...');
        const duplicatedProtocol = new Protocol({
            ...foundProtocol.toObject(),
            _id: undefined,
            name: `${foundProtocol.name} (Copy)`,
            version: '1.0',
            isPublic: false,
            createdBy: testUser._id,
            isArchived: false,
            archivedAt: null,
            isDeleted: false,
            deletedAt: null
        });
        await duplicatedProtocol.save();
        console.log('✅ Protocol duplicated successfully:', duplicatedProtocol._id);

        // Test 8: Soft delete the test protocols
        console.log('\n🗑️ Testing Protocol Soft Delete...');
        await Protocol.findByIdAndUpdate(createdProtocol._id, {
            isDeleted: true,
            deletedAt: new Date()
        });
        await Protocol.findByIdAndUpdate(duplicatedProtocol._id, {
            isDeleted: true,
            deletedAt: new Date()
        });
        console.log('✅ Test protocols soft deleted');

        console.log('\n🎉 All CRUD operations completed successfully!');
        console.log('✅ Database operations are working correctly');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('📝 Database connection closed');
    }
}

// Run the test
testProtocolCRUD();
