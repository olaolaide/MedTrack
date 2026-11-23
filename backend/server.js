import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './config/env.js';
import {connectDB, disconnectDB} from './config/database.js';
import patientRoutes from './routes/PatientRoutes.js';

const app = express();

app.disable('x-powered-by');

// Middleware
app.use(helmet())
const allowedOrigins = [
    env.CORS_ORIGIN,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
}));


app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok'
    });
});

// Patient API routes
app.use('/api', patientRoutes);

// Unknown API route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Central error handler
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON body'
        });
    }

    console.error('[server] Error:', err);

    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Connect to MongoDB and start server
try {
    await connectDB();
    app.listen(env.PORT, () => {
        console.log(`[server] running on port ${env.PORT}`);
    });

} catch (error) {
    console.error('[server] startup failed:', error.message);
    await disconnectDB();
    process.exit(1);
}