import dotenv from 'dotenv';
dotenv.config();

const configKeys = {

VITE_MONGO_URL: process.env.VITE_MONGO_URL,
VITE_SALT_ROUNDS: process.env.VITE_SALT_ROUNDS,
VITE_JWT_SECRET: process.env.VITE_JWT_SECRET,
VITE_CLOUD_NAME: process.env.VITE_CLOUD_NAME,
VITE_API_KEY: process.env.VITE_API_KEY,
VITE_API_SECRET: process.env.VITE_API_SECRET
    
    
  };

export default configKeys;
