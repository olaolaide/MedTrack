import mongoose from 'mongoose';
import env from './env.js';

mongoose.set('strictQuery', true);

export async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    await mongoose.connect(env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
    });

    console.log(`[db] connected → ${mongoose.connection.name}`);

    return mongoose.connection;
}

export async function disconnectDB() {
    await mongoose.disconnect();

    console.log('[db] disconnected');
}

export default mongoose;
