// timesheet.route.js
import express from 'express';
import * as timesheetController from '../controllers/timesheet.controller.js';

const router = express.Router();

router.get('/last-week', timesheetController.last);
router.get('/date/:date', timesheetController.timesheetByDate);
router.get('/this-week', timesheetController.timesheetThisWeek);
router.get('/range-date/:startDate/:endDate', timesheetController.timesheetByRangeDate);
router.get('/check-valid/:year/:month', timesheetController.checkTimesheet);

router.put('/update/:id', timesheetController.updateTimesheet);

router.post('/bulk', timesheetController.bulk);

router.delete('/delete/:id', timesheetController.deleteTimesheet);

export default router;
