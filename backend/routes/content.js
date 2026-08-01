/**
 * 展会展示内容路由
 * 提供首页 / 资讯 / 日程 / 品牌数据接口
 * @desc 展会展示内容接口
 * @author IFSIE 组委会
 * @version 1.0.0
 */
const express = require('express');
const router = express.Router();
const {
  exhibitionData,
  scheduleData,
  brandsData,
  newsData
} = require('../data/contentData');

// 展会概况统计
router.get('/exhibition', (req, res) => {
  res.json({ code: 1, msg: 'ok', data: exhibitionData });
});

// 展会日程（支持 ?day=1|2|3 过滤）
router.get('/schedule', (req, res) => {
  const day = req.query.day ? Number(req.query.day) : null;
  const data = day ? scheduleData.filter(item => item.day === day) : scheduleData;
  res.json({ code: 1, msg: 'ok', data });
});

// 参展品牌
router.get('/brands', (req, res) => {
  res.json({ code: 1, msg: 'ok', data: brandsData });
});

// 展会资讯
router.get('/news', (req, res) => {
  res.json({ code: 1, msg: 'ok', data: newsData });
});

module.exports = router;
