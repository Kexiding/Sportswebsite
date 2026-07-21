const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');

// 登录（不需要 token）
router.post('/login', admin.login);

// 以下路由需要 token 认证
router.use(admin.authMiddleware);

// 统计数据
router.get('/stats', admin.stats);

// 观展预约管理
router.get('/visitor/list', admin.visitorList);

// 参展报名管理
router.get('/exhibitor/list', admin.exhibitorList);

// 通用管理（type 参数: visitor / exhibitor）
router.get('/:type/detail/:id', admin.detail);
router.put('/:type/status/:id', admin.updateStatus);
router.delete('/:type/delete/:id', admin.remove);

module.exports = router;
