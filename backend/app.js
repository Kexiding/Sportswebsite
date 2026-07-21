const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const visitorRoutes = require('./routes/visitor');
const exhibitorRoutes = require('./routes/exhibitor');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件 - 直接托管项目根目录的 HTML
app.use(express.static(path.join(__dirname, '..')));

// 路由
app.use('/api/visitor', visitorRoutes);
app.use('/api/exhibitor', exhibitorRoutes);
app.use('/api/admin', adminRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ code: 1, msg: '服务运行正常', data: { time: new Date().toISOString() } });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ code: 0, msg: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ code: 0, msg: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`后端服务已启动: http://localhost:${PORT}`);
  console.log(`API 地址: http://localhost:${PORT}/api`);
});
