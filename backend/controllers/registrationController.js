const db = require('../config/db');

/**
 * 工作人员报名 - 提交
 */
async function staffApply(req, res, next) {
  try {
    const { name, phone, email, idCard, department, position, workType, workExperience, emergencyContact, emergencyPhone, remark } = req.body;

    if (!name || !name.trim()) return res.json({ code: 0, msg: '请输入姓名' });
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) return res.json({ code: 0, msg: '请输入有效的手机号码' });

    const [result] = await db.execute(
      `INSERT INTO staff_registrations (name, phone, email, id_card, department, position, work_type, work_experience, emergency_contact, emergency_phone, remark)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), phone, email || null, idCard || null, department || null, position || null, workType || null, workExperience || null, emergencyContact || null, emergencyPhone || null, remark || null]
    );

    res.json({ code: 1, msg: '工作人员报名成功！组委会将在3个工作日内与您联系', data: { id: result.insertId } });
  } catch (err) { next(err); }
}

/**
 * 志愿者报名 - 提交
 */
async function volunteerApply(req, res, next) {
  try {
    const { name, phone, email, idCard, gender, age, school, major, education, availableDates, serviceType, languages, volunteerExperience, selfIntro, emergencyContact, emergencyPhone, remark } = req.body;

    if (!name || !name.trim()) return res.json({ code: 0, msg: '请输入姓名' });
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) return res.json({ code: 0, msg: '请输入有效的手机号码' });

    const serviceTypeStr = Array.isArray(serviceType) ? JSON.stringify(serviceType) : (serviceType || null);

    const [result] = await db.execute(
      `INSERT INTO volunteer_registrations (name, phone, email, id_card, gender, age, school, major, education, available_dates, service_type, languages, volunteer_experience, self_intro, emergency_contact, emergency_phone, remark)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), phone, email || null, idCard || null, gender || null, age || null, school || null, major || null, education || null, availableDates || null, serviceTypeStr, languages || null, volunteerExperience || null, selfIntro || null, emergencyContact || null, emergencyPhone || null, remark || null]
    );

    res.json({ code: 1, msg: '志愿者报名成功！组委会将在3个工作日内与您联系', data: { id: result.insertId } });
  } catch (err) { next(err); }
}

/**
 * 嘉宾报名 - 提交
 */
async function guestApply(req, res, next) {
  try {
    const { name, phone, email, company, position, title, introduction, photoUrl, isPublic, remark } = req.body;

    if (!name || !name.trim()) return res.json({ code: 0, msg: '请输入姓名' });
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) return res.json({ code: 0, msg: '请输入有效的手机号码' });
    if (!email || !email.trim()) return res.json({ code: 0, msg: '请输入邮箱地址' });
    if (!company || !company.trim()) return res.json({ code: 0, msg: '请输入所在单位' });

    const [result] = await db.execute(
      `INSERT INTO guest_registrations (name, phone, email, company, position, title, introduction, photo_url, is_public, remark)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), phone, email.trim(), company.trim(), position || null, title || null, introduction || null, photoUrl || null, isPublic !== undefined ? isPublic : 1, remark || null]
    );

    res.json({ code: 1, msg: '嘉宾报名成功！组委会将在3个工作日内与您联系', data: { id: result.insertId } });
  } catch (err) { next(err); }
}

/**
 * 获取列表 (管理用)
 */
async function getList(req, res, next) {
  try {
    const { type } = req.params;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;
    const keyword = req.query.keyword || '';

    const tableMap = { staff: 'staff_registrations', volunteer: 'volunteer_registrations', guest: 'guest_registrations' };
    const nameFieldMap = { staff: 'name', volunteer: 'name', guest: 'name' };
    const table = tableMap[type];
    const nameField = nameFieldMap[type];

    if (!table) return res.json({ code: 0, msg: '类型错误' });

    let whereSql = '';
    let params = [];
    if (keyword.trim()) {
      whereSql = `WHERE ${nameField} LIKE ? OR phone LIKE ?`;
      const kw = `%${keyword.trim()}%`;
      params = [kw, kw];
    }

    const [rows] = await db.execute(
      `SELECT * FROM ${table} ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, String(size), String(offset)]
    );

    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) as total FROM ${table} ${whereSql}`,
      params
    );

    res.json({ code: 1, msg: 'success', data: { list: rows, total, page, size } });
  } catch (err) { next(err); }
}

/**
 * 获取详情 (管理用)
 */
async function getDetail(req, res, next) {
  try {
    const { type, id } = req.params;
    const tableMap = { staff: 'staff_registrations', volunteer: 'volunteer_registrations', guest: 'guest_registrations' };
    const table = tableMap[type];
    if (!table) return res.json({ code: 0, msg: '类型错误' });

    const [rows] = await db.execute(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    if (rows.length === 0) return res.json({ code: 0, msg: '记录不存在' });

    // 解析 JSON 字段
    const item = rows[0];
    if (item.service_type) {
      try { item.service_type = JSON.parse(item.service_type); } catch (e) { }
    }

    res.json({ code: 1, msg: 'success', data: item });
  } catch (err) { next(err); }
}

/**
 * 更新状态 (管理用)
 */
async function updateStatus(req, res, next) {
  try {
    const { type, id } = req.params;
    const { status } = req.body;
    const tableMap = { staff: 'staff_registrations', volunteer: 'volunteer_registrations', guest: 'guest_registrations' };
    const table = tableMap[type];
    if (!table) return res.json({ code: 0, msg: '类型错误' });

    await db.execute(`UPDATE ${table} SET status = ? WHERE id = ?`, [status, id]);
    res.json({ code: 1, msg: '状态更新成功' });
  } catch (err) { next(err); }
}

/**
 * 删除记录 (管理用)
 */
async function remove(req, res, next) {
  try {
    const { type, id } = req.params;
    const tableMap = { staff: 'staff_registrations', volunteer: 'volunteer_registrations', guest: 'guest_registrations' };
    const table = tableMap[type];
    if (!table) return res.json({ code: 0, msg: '类型错误' });

    await db.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
    res.json({ code: 1, msg: '删除成功' });
  } catch (err) { next(err); }
}

module.exports = { staffApply, volunteerApply, guestApply, getList, getDetail, updateStatus, remove };
