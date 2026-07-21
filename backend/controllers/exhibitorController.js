const db = require('../config/db');

/**
 * 参展报名 - 提交
 */
async function apply(req, res, next) {
  try {
    const { name, phone, email, company, brand, website, isFirst, boothType, exhibitArea, exhibitType, services, products, boothRequirements } = req.body;

    // 参数验证
    if (!name || !name.trim()) {
      return res.json({ code: 0, msg: '请输入联系人姓名' });
    }
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.json({ code: 0, msg: '请输入有效的联系电话' });
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
    if (!boothType) {
      return res.json({ code: 0, msg: '请选择展位类型' });
    }
    if (!exhibitArea) {
      return res.json({ code: 0, msg: '请选择展位面积' });
    }
    if (!exhibitType) {
      return res.json({ code: 0, msg: '请选择参展类别' });
    }

    // 将 services 数组转为 JSON 字符串存储
    const servicesStr = Array.isArray(services) ? JSON.stringify(services) : (services || null);

    const [result] = await db.execute(
      `INSERT INTO exhibitor_applications (contact_name, phone, email, company, brand, website, is_first, booth_type, exhibit_area, exhibit_type, services, products, booth_requirements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), phone, email.trim(), company.trim(), brand || null, website || null, isFirst || null, boothType, exhibitArea, exhibitType, servicesStr, products || null, boothRequirements || null]
    );

    res.json({
      code: 1,
      msg: '参展报名成功！组委会将在3个工作日内联系您',
      data: { id: result.insertId }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 参展报名 - 获取列表 (管理用)
 */
async function getList(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;

    const [rows] = await db.execute(
      'SELECT * FROM exhibitor_applications ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [String(size), String(offset)]
    );

    const [[{ total }]] = await db.execute('SELECT COUNT(*) as total FROM exhibitor_applications');

    res.json({
      code: 1,
      msg: 'success',
      data: { list: rows, total, page, size }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { apply, getList };
