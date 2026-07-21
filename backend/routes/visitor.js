const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

// 观展预约提交
router.post('/register', visitorController.register);

// 获取观展预约列表 (管理用)
router.get('/list', visitorController.getList);

module.exports = router;
