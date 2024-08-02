// timesheet.controller.js
import moment from 'moment';
import env from 'dotenv';
import * as timesheetServices from '../services/timesheet.service.js';
import {
    dataFormated, formatTaskData, responseError, responseSuccess,
    getRangeDate, getMonthStartAndEnd,
} from '../utils/utils.js';

env.config();
export async function bulk(req, res) {
    try {
        const {cookie} = req.headers;
        const data = req.body;
        let response;
        let payload

        if (!cookie) {
            return res.status(500).send('Cookie is required');
        }

        if (!data) {
            return res.status(500).send('Data is required');
        }

        const diffDays = moment(data.endDate).diff(moment(data.startDate), 'days');

        if (diffDays < 0) {
            return res.status(500).send('End time should be greater than start time');
        } else if (diffDays === 0) {
            payload = formatTaskData(data);
            response = await timesheetServices.inputTimesheet(payload, cookie);
        } else if (diffDays > 0) {
            let promises = [];
            let payloadData;
            let date;
            for (let i = 0; i <= diffDays; i++) {

                date = moment(data.startDate).add(i, 'days');
                if (date.day() === 0 || date.day() === 6) {
                    continue;
                }
                payloadData = {
                    taskId: data.taskId,
                    activity: data.activity,
                    startDate: moment(date).format('YYYY-MM-DD'),
                    endDate: moment(date).format('YYYY-MM-DD'),
                }
                payload = formatTaskData(payloadData);
                promises.push(callTalentaAPI(payload, cookie));
            }
            response = await Promise.all(promises);
        }
        return responseSuccess(res, response);
    } catch (error) {
      return res.status(500).send(error);
    }
}

export async function last(req, res) {
    try {
        const {cookie} = req.headers;
        if (!cookie) {
            return res.status(500).send('Cookie is required');
        }
        const response = await timesheetServices.lastTimesheet(cookie);
        if (response.status !== 200) {
            return res.status(500).send(response.error);
        }
        return responseSuccess(res, dataFormated(response.data));
    } catch (error) {
        return responseError(res, error);
    }
}

export async function timesheetByDate(req, res) {
    try {
        const {cookie} = req.headers;
        const {date} = req.params;
        if (!cookie) {
            return res.status(500).send('Cookie is required');
        }
        const response = await timesheetServices.timesheetByDate(cookie, date);
        if (response.status !== 200) {
            return res.status(500).send(response.error);
        }
        const formatData = {
            duration_week: response.data.duration_week,
            daily: dataFormated(response.data.daily),
        }
        const data = formatData.daily.filter((dt) => dt.date === date);
        return responseSuccess(res, data);
    } catch (error) {
        return responseError(res, error);
    }
}

export async function timesheetThisWeek(req, res) {
    try {
        const {cookie} = req.headers;
        if (!cookie) {
            return res.status(500).send('Cookie is required');
        }
        const response = await timesheetServices.timesheetByDate(cookie, moment().format('YYYY-MM-DD'));
        if (response.status !== 200) {
            return res.status(500).send(response.error);
        }
        const formatData = {
            duration_week: response.data.duration_week,
            daily: dataFormated(response.data.daily),
        }
        return responseSuccess(res, formatData);
    } catch (error) {
        return responseError(res, error);
    }
}

export async function timesheetByRangeDate(req, res) {
    try {
        const {cookie} = req.headers;
        const {startDate, endDate} = req.params;
        if (!cookie) {
            return res.status(500).send('Cookie is required');
        }
        const formatData = await getRangeDate(cookie, startDate, endDate);
        return responseSuccess(res, formatData);
    } catch (error) {
        return responseError(res, error);
    }
}

export function deleteTimesheet(req, res) {
    try {
        const {cookie} = req.headers;
        const {id} = req.params;
        if (!cookie) {
            return res.status(500).send('Cookie is required');
        }
        const response = timesheetServices.deleteTimesheet(cookie, id);
        return responseSuccess(res, response.data);
    } catch (error) {
        return responseError(res, error);
    }
}

export async function updateTimesheet(req, res) {
    try {
        const {cookie} = req.headers;
        const data = req.body;
        if (!cookie) {
            return res.status(500).send('Cookie is required');
        }
        if (!data) {
            return res.status(500).send('Data is required');
        }

        const payloadData = {
            id: data.id,
            task_id: data.taskId,
            activity: data.activity,
            start_time: moment(date).format('YYYY-MM-DD'),
            end_time: moment(date).format('YYYY-MM-DD'),
        }

        const response = await timesheetServices.updateTimesheet(cookie, payloadData);
        return responseSuccess(res, response.data);
    } catch (error) {
        return responseError(res, error);
    }
}

export async function checkTimesheet(req, res) {
    try {
        const {cookie} = req.headers;
        const {year, month} = req.params;
        if (!cookie) {
            return res.status(500).send('Cookie is required');
        }

        const { startDate, endDate } = getMonthStartAndEnd(year, month);
        const formatData = await getRangeDate(cookie, startDate, endDate);
        let dateData;
        const result = formatData.map((data) => {
            dateData = moment(data.date);
            return {
                date: data.date,
                day: moment(data.date).format('dddd'),
                total_duration: data.total_duration,
                days: dateData.day(),
                is_valid: dateData.day() === 0 || dateData.day() === 6 ?
                    data.total_duration === '00:00:00'
                    : data.total_duration === '08:00:00',
            }
        });
        return responseSuccess(res, result);
    } catch (error) {
        return responseError(res, error);
    }
}
