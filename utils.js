// utils.js

const moment = require('moment');
const env = require('dotenv');

env.config();
const startTime = process.env.START_TIME;
const endTime = process.env.END_TIME;

function formatTaskData(payload) {
    const { taskId, activity, startDate, endDate } = payload;
    return {
        task_id: taskId,
        activity: activity,
        start_time: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        end_time: moment(endDate).format(`YYYY-MM-DD ${endTime}`),
    }
}

module.exports = {
    formatTaskData
};
