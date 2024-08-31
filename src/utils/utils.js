// utils.js
import moment from 'moment';
import env from 'dotenv';
import * as timesheetServices from "../services/timesheet.service.js";

env.config();
const startTime = process.env.START_TIME;
const endTime = process.env.END_TIME;

export function formatTaskData(payload) {
    const { taskId, activity, startDate, endDate } = payload;
    return {
        task_id: taskId,
        activity: activity,
        start_time: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        end_time: moment(endDate).format(`YYYY-MM-DD ${endTime}`),
    }
}

export function formatUpdateTaskData(payload) {
    const { taskId, activity, startDate, endDate, id } = payload;
    return {
        id: Number(id),
        task_id: taskId,
        activity: activity,
        start_time: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        end_time: moment(endDate).format(`YYYY-MM-DD ${startTime}`),
    }
}

export function responseSuccess(res, data) {
    const response = {
        status: 'success',
        data,
    }
    res.status(200).send(response);
}

export function responseError(res, error) {
    const response = {
        status: 'error',
        error: error.message,
    }
    res.status(500).send(response);
}

export function dataFormated(response) {
    return response.map((dt) => {
        return {
            date: dt.date,
            total_duration: dt.total_duration,
            data: dt.data.map((d) => {
                return {
                    id: d.id,
                    task_id: d.task_id,
                    task_title: d.task_title,
                    start_time: d.start_time,
                    end_time: d.end_time,
                    duration: d.activity_duration,
                    activity: d.activity,
                }
            })
        }
    });
}

// get week with params startDate and endDate
export function getWeeks(startDate, endDate) {
    let start = moment(startDate);
    let end = moment(endDate);
    let weeks = [];

    // Ensure start date is Monday
    if (start.day() !== 1) {
        start = start.day(1);
    }

    while (start.isBefore(end)) {
        let weekStart = start.clone();
        let weekEnd = start.clone().day(7); // End on Sunday of the same week
        if (weekEnd.isAfter(end)) {
            weekEnd = end.clone();
        }

        weeks.push({
            start: weekStart.format('YYYY-MM-DD'),
            end: weekEnd.format('YYYY-MM-DD'),
        });

        // Move to next week
        start.add(1, 'weeks');
    }

    return weeks;
}

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

export function getMonthStartAndEnd(year, month) {
    const paddedMonth = month.toString().padStart(2, '0');
    const startDate = moment(`${year}-${paddedMonth}-01`, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
    return { startDate, endDate };
}
