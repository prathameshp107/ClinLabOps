/**
 * Express.js Request/Response Logger Middleware
 * Logs all incoming requests and outgoing responses in a minimal format
 */

const logger = (req, res, next) => {
    // Capture the start time of the request
    const start = Date.now();
    
    // Store the original send function
    const originalSend = res.send;
    
    // Override the send function to capture the response
    res.send = function (body) {
        // Calculate response time
        const responseTime = Date.now() - start;
        
        // Log the request and response in one line
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${responseTime}ms)`);
        
        // Call the original send function
        return originalSend.call(this, body);
    };
    
    // Continue to the next middleware/route handler
    next();
};

module.exports = logger;
