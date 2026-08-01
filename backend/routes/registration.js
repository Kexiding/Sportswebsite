const express = require('express');
const router = express.Router();
const reg = require('../controllers/registrationController');

// 公开接口 - 报名提交
router.post('/staff/apply', reg.staffApply);
router.post('/volunteer/apply', reg.volunteerApply);
router.post('/guest/apply', reg.guestApply);

module.exports = router;
