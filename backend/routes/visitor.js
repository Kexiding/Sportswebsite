const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

// 专业观众报名提交
router.post('/register', visitorController.register);

// 获取专业观众报名列表 (管理用)
router.get('/list', visitorController.getList);

module.exports = router;
