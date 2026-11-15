import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import {connectDB} from './config/database.js';

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
}));

// Start server
async function startServer() {
    try {
        await connectDB();

        app.listen(env.PORT, () => {
            console.log(`[server] running on port ${env.PORT}`);
        });

    } catch (error) {
        console.error('[server] startup failed:', error.message);
        process.exit(1);
    }
}

startServer();
