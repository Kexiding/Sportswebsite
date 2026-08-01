const express = require('express');
const router = express.Router();
const path = require('path');
const exhibitorController = require('../controllers/exhibitorController');

// 参展报名提交
router.post('/apply', exhibitorController.apply);

// 获取参展报名列表 (管理用)
router.get('/list', exhibitorController.getList);

// 下载参展合同模板
router.get('/contract', (req, res) => {
  const contractPath = path.join(__dirname, '../../Word/2026国际健身体育产业博览会参展合同.doc');
  res.download(contractPath, '2026国际健身体育产业博览会参展合同.doc', (err) => {
    if (err) {
      console.error('合同下载失败:', err);
      res.status(404).json({ code: 0, msg: '合同模板文件不存在' });
    }
  });
});

module.exports = router;
