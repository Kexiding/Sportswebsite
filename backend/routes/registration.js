const express = require('express');
const router = express.Router();
const reg = require('../controllers/registrationController');
const attendee = require('../controllers/attendeeController');

// 公开接口 - 报名提交
router.post('/staff/apply', reg.staffApply);
router.post('/volunteer/apply', reg.volunteerApply);
router.post('/guest/apply', reg.guestApply);
router.post('/attendee/apply', attendee.apply);

module.exports = router;
