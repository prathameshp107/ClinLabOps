const mongoose = require('mongoose');

class GridFSService {
    constructor() {
        this.bucket = null;
        // Don't init immediately, wait for MongoDB connection
        this.initOnConnection();
    }

    initOnConnection() {
        // Wait for mongoose connection to be ready
        if (mongoose.connection.readyState === 1) {
            this.init();
        } else {
            mongoose.connection.on('connected', () => {
                this.init();
            });
        }
    }

    init() {
        try {
            // Make sure we have a valid db connection
            if (!mongoose.connection.db) {
                console.log('MongoDB connection not ready yet, will retry on next connection event');
                return;
            }

            // Create a new GridFS bucket
            this.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                bucketName: 'reports'
            });
            console.log('✅ GridFS bucket initialized successfully');
        } catch (error) {
            console.error('Error initializing GridFS bucket:', error);
        }
    }

    // Upload a file to GridFS
    async uploadFile(fileBuffer, filename, metadata = {}) {
        // Make sure GridFS is initialized
        if (!this.bucket) {
            this.init();
            // If still not initialized, wait a bit and try again
            if (!this.bucket) {
                // Wait for MongoDB connection
                await new Promise(resolve => {
                    const checkConnection = () => {
                        if (this.bucket || mongoose.connection.readyState !== 1) {
                            resolve();
                        } else {
                            setTimeout(checkConnection, 100);
                        }
                    };
                    // Initial check
                    if (mongoose.connection.readyState === 1) {
                        this.init();
                        resolve();
                    } else {
                        mongoose.connection.on('connected', () => {
                            this.init();
                            resolve();
                        });
                    }
                });

                // Final check
                if (!this.bucket) {
                    throw new Error('GridFS bucket could not be initialized');
                }
            }
        }

        // Upload file and return the file ID directly
        return new Promise((resolve, reject) => {
            const uploadStream = this.bucket.openUploadStream(filename, {
                metadata: metadata
            });

            uploadStream.on('error', (err) => {
                console.error('GridFS upload error:', err);
                reject(err);
            });

            uploadStream.on('finish', (file) => {
                console.log('GridFS upload finished, file info:', file);
                if (file && file._id) {
                    resolve(file);
                } else {
                    // Fallback: try to get the file ID from the stream
                    const fileId = uploadStream.id;
                    console.log('GridFS upload stream ID:', fileId);
                    if (fileId) {
                        resolve({ _id: fileId });
                    } else {
                        reject(new Error('File upload finished but no file ID available'));
                    }
                }
            });

            // Write the file buffer to GridFS
            uploadStream.end(fileBuffer);
        });
    }

    // Download a file from GridFS
    async downloadFile(fileId, res) {
        // Ensure GridFS is initialized
        if (!this.bucket) {
            this.init();
            if (!this.bucket) {
                throw new Error('GridFS bucket not initialized');
            }
        }

        try {
            // Validate fileId
            let objectId;
            try {
                objectId = new mongoose.Types.ObjectId(fileId);
            } catch (err) {
                console.error('Invalid fileId format:', fileId, err);
                throw new Error('Invalid file ID format');
            }

            // Check if file exists before streaming
            const file = await this.findFile(fileId);
            if (!file) {
                throw new Error('File not found in GridFS');
            }

            // Set headers using file metadata, but don't override Content-Disposition if already set
            res.setHeader('Content-Type', file.metadata?.mimetype || 'application/octet-stream');
            res.setHeader('Content-Length', file.length);

            // Only set Content-Disposition if not already set by the controller
            if (!res.getHeader('Content-Disposition')) {
                res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
            }

            // Create and pipe the download stream
            const downloadStream = this.bucket.openDownloadStream(objectId);

            // Handle stream errors
            downloadStream.on('error', (err) => {
                console.error('GridFS download stream error:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to stream file' });
                }
            });

            // Log completion
            downloadStream.on('end', () => {
                console.log('GridFS download completed for fileId:', fileId);
            });

            // Pipe the stream to the response
            downloadStream.pipe(res);
        } catch (error) {
            console.error('GridFS download error:', error);
            if (!res.headersSent) {
                res.status(error.message === 'File not found in GridFS' ? 404 : 500).json({
                    error: error.message
                });
            }
            throw error; // Rethrow for Promise rejection
        }
    }

    // Delete a file from GridFS
    async deleteFile(fileId) {
        // Make sure GridFS is initialized
        if (!this.bucket) {
            this.init();
            if (!this.bucket) {
                throw new Error('GridFS bucket not initialized');
            }
        }

        try {
            await this.bucket.delete(new mongoose.Types.ObjectId(fileId));
            console.log('GridFS file deleted successfully');
        } catch (err) {
            console.error('GridFS delete error:', err);
            throw err;
        }
    }

    // Find a file in GridFS
    async findFile(fileId) {
        // Make sure GridFS is initialized
        if (!this.bucket) {
            this.init();
            if (!this.bucket) {
                throw new Error('GridFS bucket not initialized');
            }
        }

        try {
            const cursor = this.bucket.find({ _id: new mongoose.Types.ObjectId(fileId) });
            const files = await cursor.toArray();
            console.log('GridFS find result:', files.length, 'files found');
            return files[0] || null;
        } catch (err) {
            console.error('GridFS find error:', err);
            throw err;
        }
    }
}

// Export a singleton instance
module.exports = new GridFSService();