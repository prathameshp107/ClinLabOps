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
        // Make sure GridFS is initialized
        if (!this.bucket) {
            this.init();
            if (!this.bucket) {
                throw new Error('GridFS bucket not initialized');
            }
        }

        return new Promise((resolve, reject) => {
            try {
                const downloadStream = this.bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

                downloadStream.on('error', (err) => {
                    console.error('GridFS download error:', err);
                    reject(err);
                });

                downloadStream.on('end', () => {
                    console.log('GridFS download completed');
                    resolve();
                });

                downloadStream.pipe(res);
            } catch (error) {
                console.error('GridFS download error:', error);
                reject(error);
            }
        });
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

        return new Promise((resolve, reject) => {
            this.bucket.delete(new mongoose.Types.ObjectId(fileId), (err) => {
                if (err) {
                    console.error('GridFS delete error:', err);
                    reject(err);
                } else {
                    console.log('GridFS file deleted successfully');
                    resolve();
                }
            });
        });
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

        return new Promise((resolve, reject) => {
            this.bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray((err, files) => {
                if (err) {
                    console.error('GridFS find error:', err);
                    reject(err);
                } else {
                    console.log('GridFS find result:', files.length, 'files found');
                    resolve(files[0] || null);
                }
            });
        });
    }
}

// Export a singleton instance
module.exports = new GridFSService();