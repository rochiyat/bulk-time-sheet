// utils.js
import moment from 'moment';
import env from 'dotenv';
import * as timesheetServices from "../services/timesheet.service.js";

env.config();
const startTime = process.env.START_TIME;
const endTime = process.env.END_TIME;

/**
 * Formats task data by converting date fields into a specific string format.
 *
 * @param {Object} payload - The task data to format.
 * @param {string} payload.taskId - The unique identifier for the task.
 * @param {string} payload.activity - The activity description of the task.
 * @param {string} payload.startDate - The start date of the task.
 * @param {string} payload.endDate - The end date of the task.
 * @returns {Object} An object containing the formatted task data.
 */
export function formatTaskData(payload) {
    const { taskId, activity, startDate, endDate } = payload;
    return {
        task_id: taskId,
        activity: activity,
        start_time: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        end_time: moment(endDate).format(`YYYY-MM-DD ${endTime}`),
    }
}

/**
 * Formats task data for updating an existing task.
 *
 * @param {Object} payload - The task data to format.
 * @param {string} payload.taskId - The unique identifier for the task.
 * @param {string} payload.activity - The activity description of the task.
 * @param {string} payload.startDate - The start date of the task.
 * @param {string} payload.endDate - The end date of the task.
 * @param {string|number} payload.id - The unique identifier of the task entry.
 * @returns {Object} An object containing the formatted task data for updating.
 */
export function formatUpdateTaskData(payload) {
    const { taskId, activity, startDate, endDate, id } = payload;
    return {
        id: Number(id), // Convert id to a number
        task_id: taskId,
        activity: activity,
        // Format start and end times using the global startTime variable
        start_time: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        end_time: moment(endDate).format(`YYYY-MM-DD ${startTime}`),
    }
}


/**
 * Sends a standardized success response with a 200 status code.
 *
 * @param {Object} res - The response object used to send the success response.
 * @param {*} data - The data to be included in the success response.
 */
export function responseSuccess(res, data) {
    // Create a standardized response object
    const response = {
        status: 'success', // Indicate that the operation was successful
        data, // Include the provided data in the response
    }
    // Send the response with a 200 (OK) status code
    res.status(200).send(response);
}


/**
 * Sends a standardized error response with a 500 status code.
 *
 * @param {Object} res - The response object used to send the error response.
 * @param {Object} error - The error object containing the error message.
 */
export function responseError(res, error) {
    const response = {
        status: 'error',
        error: error.message,
    }
    res.status(500).send(response);
}

/**
 * Formats timesheet data from the API response into a more structured format.
 *
 * @param {Array} response - The raw timesheet data from the API.
 * @returns {Array} An array of formatted timesheet entries.
 */
export function dataFormated(response) {
    return response.map((dt) => {
        return {
            // Preserve the date and total duration from the original data
            date: dt.date,
            total_duration: dt.total_duration,
            // Transform the 'data' array for each day
            data: dt.data.map((d) => {
                return {
                    // Extract and rename relevant fields from each entry
                    id: d.id,
                    task_id: d.task_id,
                    task_title: d.task_title,
                    start_time: d.start_time,
                    end_time: d.end_time,
                    duration: d.activity_duration, // Rename activity_duration to duration
                    activity: d.activity,
                }
            })
        }
    });
}


/**
 * Generates an array of week objects between two dates.
 * 
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Array<Object>} An array of week objects, each containing start and end dates.
 */
export function getWeeks(startDate, endDate) {
    // Convert input strings to moment objects
    let start = moment(startDate);
    let end = moment(endDate);
    let weeks = [];

    // Ensure start date is Monday
    if (start.day() !== 1) {
        start = start.day(1);
    }

    // Iterate through weeks until we reach or pass the end date
    while (start.isBefore(end)) {
        let weekStart = start.clone();
        let weekEnd = start.clone().day(7); // End on Sunday of the same week

        // If the week end is after the overall end date, use the overall end date
        if (weekEnd.isAfter(end)) {
            weekEnd = end.clone();
        }

        // Add the week object to the array
        weeks.push({
            start: weekStart.format('YYYY-MM-DD'),
            end: weekEnd.format('YYYY-MM-DD'),
        });

        // Move to next week
        start.add(1, 'weeks');
    }

    return weeks;
}

/**
 * Retrieves timesheet data for a given date range.
 *
 * @async
 * @function getRangeDate
 * @param {string} cookie - The authentication cookie for API requests.
 * @param {string} startDate - The start date of the range in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date of the range in 'YYYY-MM-DD' format.
 * @returns {Promise<Array>} A promise that resolves to an array of formatted timesheet data.
 * @throws {Error} If there's an error in fetching the timesheet data.
 *
 * @description
 * This function performs the following steps:
 * 1. Generates an array of week objects between the start and end dates.
 * 2. For each week, it fetches the timesheet data for the week's end date.
 * 3. Formats the fetched data using the dataFormated function.
 * 4. Combines all the formatted data into a single array.
 * 5. Filters the combined data to include only entries within the specified date range.
 */

export async function getRangeDate(cookie, startDate, endDate) {
    const weeks = getWeeks(startDate, endDate);

    const promises = weeks.map(async (week) => {
        const response = await timesheetServices.timesheetByDate(cookie, week.end);
        if (response.status !== 200) {
            throw new Error(response.error);
        }
        return dataFormated(response.data.daily);
    });
    const result = await Promise.all(promises);
    const data = result.reduce((acc, val) => acc.concat(val), []);

    return data.map((dt) => {
        if (dt.date >= startDate && dt.date <= endDate) {
            return dt;
        }
    }).filter((dt) => dt);
}
/**
 * Formats task data by converting date fields into a specific string format.
 *
 * @param {Object} payload - The task data to format.
 * @param {string} payload.taskId - The unique identifier for the task.
 * @param {string} payload.activity - The activity description of the task.
 * @param {string} payload.startDate - The start date of the task.
 * @param {string} payload.endDate - The end date of the task.
 * @returns {Object} An object containing the formatted task data with
 *                   `task_id`, `activity`, `start_time`, and `end_time`.
 */
export function getMonthStartAndEnd(year, month) {
    const paddedMonth = month.toString().padStart(2, '0');
    const startDate = moment(`${year}-${paddedMonth}-01`, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
    return { startDate, endDate };
}
