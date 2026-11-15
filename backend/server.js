import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import {connectDB, disconnectDB} from './config/database.js'; // 1.3 (imports the 1.2 model)
import patientRoutes from './routes/patientRoutes.js';

const app = express();
app.disable('x-powered-by');

// Middleware
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({success: true, status: 'ok'});
});

app.use('/api', patientRoutes);

// Unknown API route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Central error handler (malformed JSON bodies and anything uncaught)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({success: false, message: 'Invalid JSON body'});
    }
    console.error('[server] unhandled error:', err);
    res.status(500).json({success: false, message: 'Internal server error'});
});

// Start server
let server;

async function startServer() {
    try {
        await connectDB();

        server = app.listen(env.PORT, () => {
            console.log(`[server] running on port ${env.PORT}`);
        });

        // Port already in use, permission errors, etc.
        server.on('error', async (error) => {
            console.error('[server] listen failed:', error.message);
            await disconnectDB();
            process.exit(1);
        });

    } catch (error) {
        console.error('[server] startup failed:', error.message);
        await disconnectDB();
        process.exit(1);
    }
}

// Graceful shutdown: stop accepting requests, then close MongoDB
async function shutdown(signal) {
    console.log(`[server] ${signal} received, shutting down`);

    if (!server) {
        await disconnectDB();
        process.exit(0);
    }

    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// // Vitest sets NODE_ENV=test, so importing `app` in a test opens no port and no DB connection
// if (process.env.NODE_ENV !== 'test') {
//     startServer();
// }
startServer();

export default app;