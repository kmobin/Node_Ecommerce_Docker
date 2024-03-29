import dotenv from 'dotenv'
dotenv.config()


export const {
    DEBUG_MODE,
    DB_URL,
    APP_PORT,
    JWT_SECRET,
    DB_URL_LOCAL,
    REFRESH_SECRET,
    APP_URL 
} = process.env