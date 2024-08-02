import axios from 'axios';

const url = process.env.URL_TALENTA;
export async function inputTimesheet(payload, cookie) {
    try {
        const response = await axios.post(`${url}/store`, payload, {
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

export async function lastTimesheet(cookie) {
    try {
        const response = await axios.get(url, {
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

export async function timesheetByDate(cookie, date) {
    try {
        const params = `report?assigneeid=&date=${date}`;
        const response = await axios.get(`${url}/${params}`, {
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

export async function deleteTimesheet(cookie, id) {
    try {
        const payload = {
            id,
        }
        const response = await axios.delete(`${url}/delete`, payload, {
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

export async function updateTimesheet(cookie, payload) {
    try {
        const response = await axios.put(`${url}/update`, payload, {
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
