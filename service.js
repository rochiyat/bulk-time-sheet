const axios = require('axios');

const url = 'https://hr.talenta.co/api/web/time-sheet/store';
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
        console.log('error', error)
        throw error.response ? error.response.data : error.message;
    }
}

module.exports = {
    callTalentaAPI
};
