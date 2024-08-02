// index.js
import express from 'express';
import config from "./config/config.js";    // Import the config module
import timesheetRoute from './routes/timesheet.route.js'; // Import the timesheet route module with extension .js

const app = express();
const port = config.port || 4000;

app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api/timesheet', timesheetRoute);

app.listen(port, () => {
    console.log(`Timesheet app listening at http://localhost:${port}`);
});