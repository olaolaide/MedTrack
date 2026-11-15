import dotenv from 'dotenv';

dotenv.config();

const env = {
    PORT: process.env.PORT || 5000,

    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://Abimbola2003:Abimbola2003@kalixy.u0jcskt.mongodb.net/medtrack',

    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

export default env;
