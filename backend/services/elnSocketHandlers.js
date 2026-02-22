const ELNEntry = require('../models/ELNEntry');

class ELNSocketHandlers {
    constructor(io) {
        this.io = io;
        this.rooms = new Map(); // Track rooms and their users
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log('New client connected to ELN namespace:', socket.id);

            // Join ELN room for collaboration
            socket.on('join-eln-room', async (data) => {
                const { elnId } = data;
                if (!elnId) {
                    socket.emit('error', { message: 'ELN ID is required to join room' });
                    return;
                }

                try {
                    // Verify user has access to this ELN entry
                    const elnEntry = await ELNEntry.findById(elnId);
                    if (!elnEntry) {
                        socket.emit('error', { message: 'ELN entry not found' });
                        return;
                    }

                    // Check if user has permission (author or collaborator)
                    const userId = socket.request.decodedToken?.id; // Assuming token is decoded by auth middleware
                    if (!userId) {
                        socket.emit('error', { message: 'Authentication required' });
                        return;
                    }

                    const userHasAccess =
                        elnEntry.author.toString() === userId ||
                        elnEntry.collaborators.some(collab => collab.toString() === userId);

                    if (!userHasAccess) {
                        socket.emit('error', { message: 'Access denied to this ELN entry' });
                        return;
                    }

                    // Join the room
                    socket.join(`eln-${elnId}`);

                    // Track user in room
                    if (!this.rooms.has(elnId)) {
                        this.rooms.set(elnId, new Set());
                    }
                    this.rooms.get(elnId).add(socket.id);

                    // Notify other users in the room
                    socket.to(`eln-${elnId}`).emit('eln-user-joined', {
                        elnId,
                        userId: socket.request.decodedToken?.id,
                        userName: socket.request.decodedToken?.name,
                        socketId: socket.id
                    });

                    socket.emit('eln-room-joined', {
                        elnId,
                        message: 'Successfully joined ELN collaboration room'
                    });
                } catch (error) {
                    console.error('Error joining ELN room:', error);
                    socket.emit('error', { message: 'Error joining ELN room' });
                }
            });

            // Leave ELN room
            socket.on('leave-eln-room', (data) => {
                const { elnId } = data;
                if (elnId) {
                    socket.leave(`eln-${elnId}`);

                    // Remove user from room tracking
                    if (this.rooms.has(elnId)) {
                        this.rooms.get(elnId).delete(socket.id);
                        if (this.rooms.get(elnId).size === 0) {
                            this.rooms.delete(elnId); // Clean up empty rooms
                        }
                    }

                    // Notify other users
                    socket.to(`eln-${elnId}`).emit('eln-user-left', {
                        elnId,
                        userId: socket.request.decodedToken?.id,
                        socketId: socket.id
                    });
                }
            });

            // Handle ELN content updates
            socket.on('eln-update', (data) => {
                const { elnId, content, userId } = data;
                if (!elnId || content === undefined) {
                    socket.emit('error', { message: 'ELN ID and content are required' });
                    return;
                }

                // Broadcast update to all users in the room except sender
                socket.to(`eln-${elnId}`).emit('eln-entry-update', {
                    elnId,
                    content,
                    userId: userId || socket.request.decodedToken?.id,
                    timestamp: new Date().toISOString()
                });
            });

            // Handle disconnection
            socket.on('disconnect', (reason) => {
                console.log('Client disconnected from ELN namespace:', socket.id, reason);

                // Remove user from all tracked rooms
                for (let [elnId, sockets] of this.rooms) {
                    if (sockets.has(socket.id)) {
                        sockets.delete(socket.id);

                        // Notify other users in the room
                        this.io.to(`eln-${elnId}`).emit('eln-user-left', {
                            elnId,
                            userId: socket.request.decodedToken?.id,
                            socketId: socket.id
                        });

                        // Clean up empty rooms
                        if (sockets.size === 0) {
                            this.rooms.delete(elnId);
                        }
                    }
                }
            });
        });
    }

    // Method to broadcast updates from server-side (e.g., from API calls)
    broadcastELNUpdate(elnId, content, userId) {
        this.io.to(`eln-${elnId}`).emit('eln-entry-update', {
            elnId,
            content,
            userId,
            timestamp: new Date().toISOString()
        });
    }

    // Get room information
    getRoomInfo(elnId) {
        const room = this.io.sockets.adapter.rooms.get(`eln-${elnId}`);
        return {
            elnId,
            connectedUsers: room ? room.size : 0,
            users: this.rooms.get(elnId) ? Array.from(this.rooms.get(elnId)) : []
        };
    }
}

module.exports = ELNSocketHandlers;