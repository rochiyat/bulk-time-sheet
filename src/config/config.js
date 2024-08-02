// config.js
import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.APP_PORT,
    startTime: process.env.START_TIME,
    endTime: process.env.END_TIME,
    urlTalenta: process.env.URL_TALENTA,
};

export default config;
