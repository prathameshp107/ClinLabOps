import { io } from 'socket.io-client';

class ELNWebSocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.listeners = new Map();
    }

    connect() {
        if (this.isConnected) return;

        // Use the same API URL as the rest of the application
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const wsUrl = apiUrl.replace('http', 'ws'); // Convert HTTP URL to WebSocket URL

        this.socket = io(wsUrl, {
            transports: ['websocket'],
            withCredentials: true,
        });

        this.socket.on('connect', () => {
            console.log('Connected to ELN WebSocket server');
            this.isConnected = true;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from ELN WebSocket server:', reason);
            this.isConnected = false;
        });

        this.socket.on('eln-entry-update', (data) => {
            this.emit('eln-entry-update', data);
        });

        this.socket.on('eln-user-joined', (data) => {
            this.emit('eln-user-joined', data);
        });

        this.socket.on('eln-user-left', (data) => {
            this.emit('eln-user-left', data);
        });

        this.socket.on('eln-comment-added', (data) => {
            this.emit('eln-comment-added', data);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.isConnected = false;
        }
    }

    // Join a specific ELN room for real-time collaboration
    joinELNRoom(elnId) {
        if (this.socket) {
            this.socket.emit('join-eln-room', { elnId });
        }
    }

    // Leave a specific ELN room
    leaveELNRoom(elnId) {
        if (this.socket) {
            this.socket.emit('leave-eln-room', { elnId });
        }
    }

    // Send updates to the specific ELN room
    sendELNUpdate(elnId, content, userId) {
        if (this.socket) {
            this.socket.emit('eln-update', { elnId, content, userId });
        }
    }

    // Add event listener
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    // Remove event listener
    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    // Emit event to all listeners
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} listener:`, error);
                }
            });
        }
    }
}

// Create a singleton instance
const elnWebSocketService = new ELNWebSocketService();

export default elnWebSocketService;