const db = require('../config/db');

/**
 * 观展预约 - 提交
 */
async function register(req, res, next) {
  try {
    const { name, phone, email, city, company, position, type: visitorType, visitDate, visitCount, interest, message } = req.body;

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
    if (!company || !company.trim()) {
      return res.json({ code: 0, msg: '请输入公司名称' });
    }
    if (!position || !position.trim()) {
      return res.json({ code: 0, msg: '请输入职位' });
    }
    if (!visitDate) {
      return res.json({ code: 0, msg: '请选择意向观展日期' });
    }
    if (!visitCount) {
      return res.json({ code: 0, msg: '请选择参观人数' });
    }

    // 将 interest 数组转为 JSON 字符串存储
    const interestStr = Array.isArray(interest) ? JSON.stringify(interest) : (interest || null);

    const [result] = await db.execute(
      `INSERT INTO visitor_registrations (name, phone, email, city, company, position, visitor_type, visit_date, visit_count, interest, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), phone, email.trim(), city || null, company.trim(), position.trim(), visitorType || '普通观众', visitDate, visitCount, interestStr, message || null]
    );

    res.json({
      code: 1,
      msg: '观展预约成功！',
      data: { id: result.insertId }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 观展预约 - 获取列表 (管理用)
 */
async function getList(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;

    const [rows] = await db.execute(
      'SELECT * FROM visitor_registrations ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [String(size), String(offset)]
    );

    const [[{ total }]] = await db.execute('SELECT COUNT(*) as total FROM visitor_registrations');

    res.json({
      code: 1,
      msg: 'success',
      data: { list: rows, total, page, size }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, getList };
