// app.js
const express = require('express');
const axios = require('axios');
const moment = require('moment');
const app = express();
const port = 4000;
const { callTalentaAPI } = require('./service');

const taskId = 127536;
const startTime = '09:00:00';
const endTime = '17:00:00';
const url = 'https://hr.talenta.co/api/web/time-sheet/store';

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/bulk', async (req, res) => {
    try {
        const {cookie} = req.headers;
        const data = req.body;
        let response;

        if (!cookie) {
            throw new Error('Cookie is required');
        }

        if (!data) {
            throw new Error('Data is required');
        }

        const diffDays = moment(data.endTime).diff(moment(data.startTime), 'days');
        console.log('diffDays', diffDays);
        if (diffDays < 0) {
            throw new Error('End time should be greater than start time');
        } else if (diffDays === 0) {
            payload = {
                task_id: taskId,
                activity: data.activity,
                start_time: moment(data.startTime).format(`YYYY-MM-DD ${startTime}`),
                end_time: moment(data.endTime).format(`YYYY-MM-DD ${endTime}`),
            }
            response = await callTalentaAPI(payload, cookie);
        } else if (diffDays > 0) {
            let promises = [];
            for (let i = 0; i <= diffDays; i++) {
                const date = moment(data.startTime).add(i, 'days').format('YYYY-MM-DD');
                payload = {
                    task_id: taskId,
                    activity: data.activity,
                    start_time: moment(date).format(`YYYY-MM-DD ${startTime}`),
                    end_time: moment(date).format(`YYYY-MM-DD ${endTime}`),
                }
                promises.push(callTalentaAPI(payload, cookie));
            }
            response = await Promise.all(promises);
        }
        res.send(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
