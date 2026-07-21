const express = require('express');
const router = express.Router();
const exhibitorController = require('../controllers/exhibitorController');

// 参展报名提交
router.post('/apply', exhibitorController.apply);

// 获取参展报名列表 (管理用)
router.get('/list', exhibitorController.getList);

module.exports = router;
