const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'zhanlt_admin_2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * 管理员登录
 */
function login(req, res) {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.json({ code: 0, msg: '密码错误' });
  }
  const token = jwt.sign({ role: 'admin', time: Date.now() }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ code: 1, msg: '登录成功', data: { token } });
}

/**
 * 验证 token 中间件
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 0, msg: '未授权，请先登录' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ code: 0, msg: 'token 已失效，请重新登录' });
  }
}

/**
 * 统计数据概览
 */
async function stats(req, res, next) {
  try {
    const [[{ visitorTotal }]] = await db.execute('SELECT COUNT(*) as visitorTotal FROM visitor_registrations');
    const [[{ exhibitorTotal }]] = await db.execute('SELECT COUNT(*) as exhibitorTotal FROM exhibitor_applications');
    const [[{ visitorToday }]] = await db.execute('SELECT COUNT(*) as visitorToday FROM visitor_registrations WHERE DATE(created_at) = CURDATE()');
    const [[{ exhibitorToday }]] = await db.execute('SELECT COUNT(*) as exhibitorToday FROM exhibitor_applications WHERE DATE(created_at) = CURDATE()');

    res.json({
      code: 1,
      msg: 'success',
      data: { visitorTotal, exhibitorTotal, visitorToday, exhibitorToday }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 获取观展预约列表
 */
async function visitorList(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;
    const keyword = req.query.keyword || '';

    let whereSql = '';
    let params = [];
    if (keyword.trim()) {
      whereSql = 'WHERE name LIKE ? OR phone LIKE ? OR company LIKE ? OR email LIKE ?';
      const kw = `%${keyword.trim()}%`;
      params = [kw, kw, kw, kw];
    }

    const [rows] = await db.execute(
      `SELECT * FROM visitor_registrations ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, String(size), String(offset)]
    );

    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) as total FROM visitor_registrations ${whereSql}`,
      params
    );

    res.json({ code: 1, msg: 'success', data: { list: rows, total, page, size } });
  } catch (err) {
    next(err);
  }
}

/**
 * 获取参展报名列表
 */
async function exhibitorList(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;
    const keyword = req.query.keyword || '';

    let whereSql = '';
    let params = [];
    if (keyword.trim()) {
      whereSql = 'WHERE contact_name LIKE ? OR phone LIKE ? OR company LIKE ? OR email LIKE ?';
      const kw = `%${keyword.trim()}%`;
      params = [kw, kw, kw, kw];
    }

    const [rows] = await db.execute(
      `SELECT * FROM exhibitor_applications ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, String(size), String(offset)]
    );

    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) as total FROM exhibitor_applications ${whereSql}`,
      params
    );

    res.json({ code: 1, msg: 'success', data: { list: rows, total, page, size } });
  } catch (err) {
    next(err);
  }
}

/**
 * 获取单条详情
 */
async function detail(req, res, next) {
  try {
    const { type, id } = req.params;
    const table = type === 'visitor' ? 'visitor_registrations' : 'exhibitor_applications';

    const [rows] = await db.execute(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.json({ code: 0, msg: '记录不存在' });
    }

    // 解析 JSON 字段
    const item = rows[0];
    if (item.interest) {
      try { item.interest = JSON.parse(item.interest); } catch (e) { }
    }
    if (item.services) {
      try { item.services = JSON.parse(item.services); } catch (e) { }
    }

    res.json({ code: 1, msg: 'success', data: item });
  } catch (err) {
    next(err);
  }
}

/**
 * 更新状态
 */
async function updateStatus(req, res, next) {
  try {
    const { type, id } = req.params;
    const { status } = req.body;
    const table = type === 'visitor' ? 'visitor_registrations' : 'exhibitor_applications';

    await db.execute(`UPDATE ${table} SET status = ? WHERE id = ?`, [status, id]);
    res.json({ code: 1, msg: '状态更新成功' });
  } catch (err) {
    next(err);
  }
}

/**
 * 删除记录
 */
async function remove(req, res, next) {
  try {
    const { type, id } = req.params;
    const table = type === 'visitor' ? 'visitor_registrations' : 'exhibitor_applications';

    await db.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
    res.json({ code: 1, msg: '删除成功' });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, authMiddleware, stats, visitorList, exhibitorList, detail, updateStatus, remove };
