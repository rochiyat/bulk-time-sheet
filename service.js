const axios = require('axios');
const env = require('dotenv');

env.config();
const url = process.env.URL_TALENTA;
async function callTalentaAPI(payload, cookie) {
    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

module.exports = {
    callTalentaAPI
};
