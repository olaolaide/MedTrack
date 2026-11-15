import mongoose from 'mongoose';
import env from './env.js';

// Import the Mongoose model created in Subtask 1.2
import Patient from '../models/Patient.js';

// Mongoose configuration
mongoose.set('strictQuery', true);

// Connect to MongoDB
export async function connectDB() {

    try {

        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        await mongoose.connect(env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000
        });

        console.log(
            `[db] connected → ${mongoose.connection.name}`
        );

        console.log(
            `[db] collection → ${Patient.collection.name}`
        );

        return mongoose.connection;

    } catch (error) {

        console.error('[db] connection failed:', error.message);

        throw error;
    }
}

// Disconnect from MongoDB
export async function disconnectDB() {

    await mongoose.disconnect();

    console.log('[db] disconnected');
}

export default mongoose;
