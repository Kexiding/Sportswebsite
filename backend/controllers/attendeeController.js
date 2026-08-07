const db = require('../config/db');

/**
 * 参会报名 - 提交
 */
async function apply(req, res, next) {
  try {
    const { name, phone, email, company, position, city, sessions, dietary, remark } = req.body;

    // 参数验证
    if (!name || !name.trim()) {
      return res.json({ code: 0, msg: '请输入姓名' });
    }
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.json({ code: 0, msg: '请输入有效的手机号码' });
    }
    if (!email || !email.trim()) {
      return res.json({ code: 0, msg: '请输入邮箱地址' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.json({ code: 0, msg: '请输入有效的邮箱地址' });
    }
    if (!sessions || (Array.isArray(sessions) && sessions.length === 0) || !sessions.trim) {
      return res.json({ code: 0, msg: '请至少选择一场参会场次' });
    }

    // 将 sessions 数组转为 JSON 字符串存储
    const sessionsStr = Array.isArray(sessions) ? JSON.stringify(sessions) : sessions;

    const [result] = await db.execute(
      `INSERT INTO attendee_registrations (name, phone, email, company, position, city, sessions, dietary, remark)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), phone, email.trim(), company || null, position || null, city || null, sessionsStr, dietary || null, remark || null]
    );

    res.json({
      code: 1,
      msg: '参会报名成功！组委会将为您预留席位，请留意查收确认信息',
      data: { id: result.insertId }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 参会报名 - 获取列表 (管理用)
 */
async function getList(req, res, next) {
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
      `SELECT * FROM attendee_registrations ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, String(size), String(offset)]
    );

    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) as total FROM attendee_registrations ${whereSql}`,
      params
    );

    res.json({ code: 1, msg: 'success', data: { list: rows, total, page, size } });
  } catch (err) {
    next(err);
  }
}

module.exports = { apply, getList };
