// app.js
const express = require('express');
const axios = require('axios');
const moment = require('moment');
const env = require('dotenv');
const app = express();
const port = 4000;
const { callTalentaAPI } = require('./service');
const { formatTaskData } = require('./utils');

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

        const diffDays = moment(data.endDate).diff(moment(data.startDate), 'days');

        if (diffDays < 0) {
            throw new Error('End time should be greater than start time');
        } else if (diffDays === 0) {
            payload = formatTaskData(data);
            response = await callTalentaAPI(payload, cookie);
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
        res.send(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
