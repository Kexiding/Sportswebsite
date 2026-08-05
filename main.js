const API_BASE_URL = '/api';
const SUBMITTING = {};

// ========== Toast 提示 ==========
function showToast(type, message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

function showError(message) { showToast('error', message); }
function showSuccess(message) { showToast('success', message); }

// ========== 加载遮罩 ==========
function showLoading() {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><p>提交中...</p></div>`;
        document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.remove('active');
}

// ========== 加载遮罩样式 ==========
const loadingStyleId = 'loading-override-style';
if (!document.getElementById(loadingStyleId)) {
    const style = document.createElement('style');
    style.id = loadingStyleId;
    style.textContent = `
        #loading-overlay {
            display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.55);
            z-index: 99999; align-items: center; justify-content: center;
            backdrop-filter: blur(4px);
        }
        #loading-overlay.active { display: flex; }
        .loading-spinner { text-align: center; }
        .spinner {
            width: 48px; height: 48px; border: 4px solid rgba(255,255,255,0.2);
            border-top-color: var(--color-primary-rose, #d81b60);
            border-radius: 50%; animation: spin 0.8s linear infinite;
            margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-spinner p { color: #fff; font-size: 16px; }

        /* 表单验证高亮 */
        .form-control.error {
            border-color: #e53935 !important;
            box-shadow: 0 0 0 3px rgba(229,57,53,0.15) !important;
        }
        .form-control.success {
            border-color: var(--color-primary-rose, #d81b60) !important;
        }
        .form-error-msg {
            color: #e53935; font-size: 13px; margin-top: 4px;
            display: none; font-weight: 500;
        }
        .form-error-msg.show { display: block; }

        /* Toast 增强 */
        .toast {
            position: fixed; top: 24px; left: 50%; transform: translateX(-50%) translateY(-20px);
            padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600;
            z-index: 99998; opacity: 0; transition: all 0.35s ease;
            max-width: min(90vw, 520px); white-space: normal; text-align: center; pointer-events: none;
        }
        .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        .toast.toast-error { background: #e53935; color: #fff; }
        .toast.toast-success { background: var(--color-primary-rose, #d81b60); color: #fff; }
        /* 合同下载模态框 */
        .contract-modal-overlay {
            display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
            z-index: 100001; align-items: center; justify-content: center;
            backdrop-filter: blur(3px);
        }
        .contract-modal-overlay.show { display: flex; }
        .contract-modal-box {
            background: #fff; border-radius: 16px; padding: 36px 40px;
            max-width: 420px; width: 90%; text-align: center;
            box-shadow: 0 8px 40px rgba(0,0,0,0.18);
            animation: scale-in 0.3s ease;
        }
        .contract-modal-icon {
            width: 64px; height: 64px; margin: 0 auto 16px;
            background: var(--color-primary-rose-light, #fce4ec);
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
        }
        .contract-modal-icon i {
            font-size: 30px; color: var(--color-primary-rose, #d81b60);
        }
        .contract-modal-title {
            font-family: var(--font-display, 'Orbitron', sans-serif);
            font-size: 1.25rem; font-weight: 700; color: #1a1a2e;
            margin-bottom: 12px;
        }
        .contract-modal-desc {
            font-size: 0.95rem; color: #666; line-height: 1.6; margin-bottom: 28px;
        }
        .contract-modal-actions {
            display: flex; gap: 12px; justify-content: center;
        }
        .contract-modal-btn {
            padding: 10px 32px; border-radius: 8px; border: none;
            font-size: 15px; cursor: pointer; font-weight: 600;
            transition: all 0.2s; min-width: 100px;
        }
        .contract-modal-btn.no {
            background: #f0f0f0; color: #666;
        }
        .contract-modal-btn.no:hover { background: #e0e0e0; }
        .contract-modal-btn.yes {
            background: var(--color-primary-rose, #d81b60); color: #fff;
        }
        .contract-modal-btn.yes:hover { opacity: 0.85; }
        .contract-modal-btn.yes i { margin-right: 6px; }
    `;
    document.head.appendChild(style);
}

// ========== 防 XSS 转义 ==========
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ========== 表单验证规则 ==========
const VALIDATORS = {
    name: {
        test: v => v.trim().length > 0,
        msg: '请输入姓名',
        msg2: '姓名不能包含特殊字符',
        sanitize: v => v.trim().replace(/[<>]/g, '')
    },
    phone: {
        test: v => /^1[3-9]\d{9}$/.test(v.trim()),
        msg: '请输入11位有效手机号码',
        autoFix: v => v.replace(/\D/g, '')
    },
    email: {
        test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        msg: '请输入有效的邮箱地址',
        sanitize: v => v.trim()
    },
    company: {
        test: v => v.trim().length > 0,
        msg: '请输入公司名称'
    },
    position: {
        test: v => v.trim().length > 0,
        msg: '请输入职位'
    },
    visitDate: {
        test: v => v !== '',
        msg: '请选择意向观展日期'
    },
    visitCount: {
        test: v => v !== '',
        msg: '请选择参观人数'
    },
    boothType: {
        test: v => v !== '',
        msg: '请选择展位类型'
    },
    exhibitArea: {
        test: v => v !== '',
        msg: '请选择展位面积'
    },
    exhibitType: {
        test: v => v !== '',
        msg: '请选择参展类别'
    }
};

// ========== 单个字段实时验证 ==========
function validateField(input) {
    const field = input.name || input.id;
    const value = input.value;
    const rule = VALIDATORS[field];
    const errorEl = input.parentElement.querySelector('.form-error-msg');
    
    // 清除状态
    input.classList.remove('error', 'success');
    if (errorEl) errorEl.classList.remove('show');
    
    // 如果字段为空且非必填，跳过
    if (!rule) return true;
    if (!value && !input.required) return true;
    if (!value && input.required) {
        input.classList.add('error');
        if (errorEl) { errorEl.textContent = rule.msg; errorEl.classList.add('show'); }
        return false;
    }
    
    const valid = rule.test(value);
    input.classList.add(valid ? 'success' : 'error');
    if (errorEl) {
        errorEl.textContent = rule.msg;
        errorEl.classList.toggle('show', !valid);
    }
    return valid;
}

// ========== 为表单字段绑定实时验证 ==========
function initFieldValidation(form) {
    form.querySelectorAll('input[required], select[required]').forEach(input => {
        // 添加错误提示容器
        const wrapper = input.parentElement;
        if (!wrapper.querySelector('.form-error-msg')) {
            const err = document.createElement('div');
            err.className = 'form-error-msg';
            wrapper.appendChild(err);
        }
        
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error') || input.classList.contains('success')) {
                validateField(input);
            }
        });
        input.addEventListener('change', () => {
            if (input.tagName === 'SELECT') validateField(input);
        });
    });
}

// ========== 全表单验证（含滚动到首个错误） ==========
function validateForm(data, type) {
    const form = type === 'visitor' 
        ? document.getElementById('visitor-form')
        : document.getElementById('exhibit-form');
    
    // 遍历所有必填字段做验证
    let firstError = null;
    form.querySelectorAll('input[required], select[required]').forEach(input => {
        if (!validateField(input)) {
            if (!firstError) firstError = input;
        }
    });
    
    if (firstError) {
        // 滚动到首个错误字段
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const top = firstError.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
        setTimeout(() => firstError.focus(), 400);
        return false;
    }
    
    return true;
}

// ========== 确认对话框 ==========
function showConfirm(msg) {
    return new Promise((resolve) => {
        const existing = document.querySelector('.confirm-overlay');
        if (existing) existing.remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        overlay.innerHTML = `
            <div class="confirm-box">
                <div class="confirm-icon"><i class="fas fa-exclamation-circle"></i></div>
                <p class="confirm-msg">${escapeHtml(msg)}</p>
                <div class="confirm-actions">
                    <button class="confirm-btn cancel">取消</button>
                    <button class="confirm-btn ok">确定提交</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 10);
        
        const confirmStyleId = 'confirm-style';
        if (!document.getElementById(confirmStyleId)) {
            const s = document.createElement('style');
            s.id = confirmStyleId;
            s.textContent = `
                .confirm-overlay {
                    display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
                    z-index: 100000; align-items: center; justify-content: center;
                    backdrop-filter: blur(3px);
                }
                .confirm-overlay.show { display: flex; }
                .confirm-box {
                    background: #fff; border-radius: 16px; padding: 32px 36px;
                    max-width: 380px; text-align: center; box-shadow: 0 8px 40px rgba(0,0,0,0.18);
                }
                .confirm-icon { font-size: 40px; color: var(--color-primary-rose, #d81b60); margin-bottom: 12px; }
                .confirm-msg { font-size: 16px; color: #333; margin-bottom: 24px; line-height: 1.5; }
                .confirm-actions { display: flex; gap: 12px; justify-content: center; }
                .confirm-btn {
                    padding: 10px 28px; border-radius: 8px; border: none;
                    font-size: 15px; cursor: pointer; font-weight: 600;
                    transition: all 0.2s;
                }
                .confirm-btn.cancel { background: #f0f0f0; color: #666; }
                .confirm-btn.cancel:hover { background: #e0e0e0; }
                .confirm-btn.ok { background: var(--color-primary-rose, #d81b60); color: #fff; }
                .confirm-btn.ok:hover { opacity: 0.85; }
            `;
            document.head.appendChild(s);
        }
        
        overlay.querySelector('.confirm-btn.cancel').addEventListener('click', () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
            resolve(false);
        });
        overlay.querySelector('.confirm-btn.ok').addEventListener('click', () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
            resolve(true);
        });
    });
}

// ========== 参展合同下载模态框 ==========
function showContractDownloadModal() {
    const existing = document.querySelector('.contract-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'contract-modal-overlay';
    overlay.innerHTML = `
        <div class="contract-modal-box">
            <div class="contract-modal-icon">
                <i class="fas fa-file-word"></i>
            </div>
            <div class="contract-modal-title">参展合同模板</div>
            <div class="contract-modal-desc">
                恭喜您已成功提交参展报名信息！<br>
                是否立即下载参展合同模板？
            </div>
            <div class="contract-modal-actions">
                <button class="contract-modal-btn no" id="contract-no">否</button>
                <button class="contract-modal-btn yes" id="contract-yes"><i class="fas fa-download"></i> 是，下载合同</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('show'), 10);

    overlay.querySelector('#contract-no').addEventListener('click', () => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    });

    overlay.querySelector('#contract-yes').addEventListener('click', () => {
        // 触发下载
        const downloadUrl = `${API_BASE_URL}/exhibitor/contract`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = '2026国际健身体育产业博览会参展合同.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 关闭模态框
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    });
}

// ========== 提交处理 ==========
async function handleFormSubmit(form, type) {
    const formId = form.id;
    
    // 防止重复提交
    if (SUBMITTING[formId]) return;
    
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        const v = typeof value === 'string' ? value.trim() : value;
        if (data[key]) {
            data[key] = Array.isArray(data[key]) ? [...data[key], v] : [data[key], v];
        } else {
            data[key] = v;
        }
    });
    
    // 前端验证
    if (!validateForm(data, type)) return;
    
    // 确认对话框
    const confirmMsg = type === 'visitor'
        ? `确认提交观展预约？\n姓名：${escapeHtml(data.name)}\n手机：${data.phone}`
        : `确认提交参展报名？\n联系人：${escapeHtml(data.name)}\n手机：${data.phone}`;
    
    const confirmed = await showConfirm(confirmMsg);
    if (!confirmed) return;
    
    // 标记提交中，防止二次点击
    SUBMITTING[formId] = true;
    showLoading();
    
    try {
        const endpoint = type === 'visitor' ? '/visitor/register' : '/exhibitor/apply';
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.code === 1) {
            showSuccess(result.msg);
            form.reset();
            // 清除验证状态
            form.querySelectorAll('.form-control').forEach(el => {
                el.classList.remove('success', 'error');
            });
            // 参展报名成功后，弹出合同下载提示
            if (type === 'exhibit') {
                setTimeout(showContractDownloadModal, 800);
            }
        } else {
            showError(result.msg || '提交失败，请稍后重试');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showError('网络异常，请检查网络后重试');
    } finally {
        hideLoading();
        delete SUBMITTING[formId];
    }
}

// ========== 初始化表单 ==========
function initRegistrationForms() {
    const visitorForm = document.getElementById('visitor-form');
    const exhibitForm = document.getElementById('exhibit-form');
    
    if (visitorForm) {
        initFieldValidation(visitorForm);
        visitorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleFormSubmit(visitorForm, 'visitor');
        });
    }
    
    if (exhibitForm) {
        initFieldValidation(exhibitForm);
        exhibitForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleFormSubmit(exhibitForm, 'exhibit');
        });
    }
}

// ========== 招募/人员报名 表单处理 ==========
const RECRUIT_VALIDATORS = {
  ...VALIDATORS,
  idCard: {
    test: v => !v || /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(v.trim()),
    msg: '请输入有效身份证号'
  },
  workType: { test: v => true, msg: '' },
  workExperience: { test: v => true, msg: '' },
  emergencyContact: { test: v => true, msg: '' },
  emergencyPhone: { test: v => true, msg: '' },
  department: { test: v => true, msg: '' },
  gender: { test: v => true, msg: '' },
  age: { test: v => !v || (Number(v) >= 16 && Number(v) <= 65), msg: '年龄范围16-65岁' },
  school: { test: v => true, msg: '' },
  major: { test: v => true, msg: '' },
  education: { test: v => true, msg: '' },
  availableDates: { test: v => true, msg: '' },
  languages: { test: v => true, msg: '' },
  volunteerExperience: { test: v => true, msg: '' },
  selfIntro: { test: v => true, msg: '' },
  company: {
    test: v => v.trim().length > 0,
    msg: '请输入所在单位'
  },
  position: { test: v => true, msg: '' },
  title: { test: v => true, msg: '' },
  guestType: { test: v => true, msg: '' },
  topic: { test: v => true, msg: '' },
  introduction: { test: v => true, msg: '' },
  isPublic: { test: v => true, msg: '' },
  remark: { test: v => true, msg: '' }
};

const API_ROUTE_MAP = {
  staff: '/registration/staff/apply',
  volunteer: '/registration/volunteer/apply',
  guest: '/registration/guest/apply'
};

async function handleRecruitFormSubmit(form, type) {
  const formId = form.id;
  if (SUBMITTING[formId]) return;

  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    const v = typeof value === 'string' ? value.trim() : value;
    if (key === 'serviceType' || key === 'availableDates') {
      data[key] = data[key] || [];
      data[key].push(v);
    } else if (key === 'isPublic') {
      data[key] = 1;
    } else {
      data[key] = v;
    }
  });

  // 必填字段验证
  const requiredFields = form.querySelectorAll('[required]');
  let firstError = null;
  requiredFields.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      if (!firstError) firstError = input;
    } else {
      input.classList.remove('error');
    }
  });
  if (firstError) return showError('请填写所有必填项');

  const confirmed = await showConfirm(`确认提交${type === 'staff' ? '工作人员' : type === 'volunteer' ? '志愿者' : '嘉宾'}报名？`);
  if (!confirmed) return;

  SUBMITTING[formId] = true;
  showLoading();

  try {
    const response = await fetch(`${API_BASE_URL}${API_ROUTE_MAP[type]}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.code === 1) {
      showSuccess(result.msg);
      form.reset();
      form.querySelectorAll('.form-control').forEach(el => el.classList.remove('success', 'error'));
    } else {
      showError(result.msg || '提交失败，请稍后重试');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showError('网络异常，请检查网络后重试');
  } finally {
    hideLoading();
    delete SUBMITTING[formId];
  }
}

function initRecruitForms() {
  const recruitForms = [
    { id: 'staff-form', type: 'staff' },
    { id: 'volunteer-form', type: 'volunteer' },
    { id: 'guest-form', type: 'guest' }
  ];

  recruitForms.forEach(({ id, type }) => {
    const form = document.getElementById(id);
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleRecruitFormSubmit(form, type);
      });
    }
  });

  // 招募类型切换
  const tabs = document.querySelectorAll('.recruit-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.recruit-section').forEach(s => s.classList.remove('active'));
      const section = document.getElementById(`section-${target}`);
      if (section) section.classList.add('active');
    });
  });
}

// ========== register.html 嘉宾表单处理 ==========
function initRegisterGuestForm() {
  const guestForm = document.getElementById('register-guest-form');
  if (guestForm) {
    guestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleRecruitFormSubmit(guestForm, 'guest');
    });
  }

  // register.html Tab 切换 (.register-tab / .register-section)
  const registerTabs = document.querySelectorAll('.register-tab');
  registerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      registerTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.register-section').forEach(s => s.classList.remove('active'));
      const section = document.getElementById(target);
      if (section) section.classList.add('active');
    });
  });
}

// ========== 滚动入场动画（IntersectionObserver） ==========
const REVEAL_SELECTORS = [
    '.section-header',
    '.highlight-card',
    '.forum-card',
    '.news-card',
    '.guide-card',
    '.brand-item',
    '.speaker-card',
    '.info-item',
    '.schedule-item',
    '.content-card'
];

let revealObserver = null;
let revealCounter = 0;

function observeReveals() {
    if (!revealObserver) return;
    document.querySelectorAll(REVEAL_SELECTORS.join(',')).forEach(el => {
        if (el.classList.contains('reveal') || el.classList.contains('in-view')) return;
        if (!el.dataset.revealIndex) el.dataset.revealIndex = revealCounter++;
        // 入场动画结束后移除类，避免干扰后续 hover 变换与状态
        el.classList.add('reveal');
        el.style.transitionDelay = `${(el.dataset.revealIndex % 8) * 55}ms`;
        revealObserver.observe(el);
    });
}

function initRevealAnimation() {
    // 用户偏好减少动效时，直接跳过入场动画
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('in-view');
            revealObserver.unobserve(el);
            // 动画结束后清除入场类与延迟，恢复默认样式
            setTimeout(() => {
                el.classList.remove('reveal', 'in-view');
                el.style.transitionDelay = '';
            }, 800);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    observeReveals();
}

// ========== 原有功能保持不变 ==========
document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initHeader();
    initScheduleTabs();
    initSmoothScroll();
    initRegistrationForms();
    initRecruitForms();
    initRegisterGuestForm();
    initRevealAnimation();
});

function initLoading() {
    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        setTimeout(() => loadingOverlay.classList.add('hidden'), 1500);
    }
}

function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    burgerMenu?.addEventListener('click', () => navLinks?.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navLinks?.classList.remove('active'));
    });
}

function initScheduleTabs() {
    const tabs = document.querySelectorAll('.schedule-tab');
    const containers = document.querySelectorAll('.schedule-container');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetDay = tab.getAttribute('data-day');
            tabs.forEach(t => t.classList.remove('active'));
            containers.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetContainer = document.getElementById(targetDay);
            if (targetContainer) targetContainer.classList.add('active');
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = 70;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

async function fetchExhibitionData() {
    try {
        const response = await fetch(`${API_BASE_URL}/exhibition`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        return result && result.code === 1 ? result.data : null;
    } catch (error) {
        console.error('API fetch error:', error);
        return null;
    }
}

async function fetchSchedule(day = null) {
    try {
        const endpoint = day ? `/schedule?day=${day}` : '/schedule';
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const result = await response.json();
        return result && result.code === 1 ? result.data : null;
    } catch (error) {
        console.error('API fetch error:', error);
        return null;
    }
}

async function fetchBrands() {
    try {
        const response = await fetch(`${API_BASE_URL}/brands`);
        if (!response.ok) throw new Error('Failed to fetch brands');
        const result = await response.json();
        return result && result.code === 1 ? result.data : null;
    } catch (error) {
        console.error('API fetch error:', error);
        return null;
    }
}

async function fetchNews() {
    try {
        const response = await fetch(`${API_BASE_URL}/news`);
        if (!response.ok) throw new Error('Failed to fetch news');
        const result = await response.json();
        return result && result.code === 1 ? result.data : null;
    } catch (error) {
        console.error('API fetch error:', error);
        return null;
    }
}

function updateHeroStats(data) {
    if (!data) return;
    const statValues = document.querySelectorAll('.hero-stat-value');
    const labels = ['exhibitors', 'visitors', 'area', 'forums'];
    statValues.forEach((el, index) => {
        const key = labels[index];
        if (data[key]) el.textContent = data[key];
    });
}

function renderScheduleItems(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container || !items) return;
    container.innerHTML = items.map(item => `
        <div class="schedule-item">
            <div class="schedule-time">
                <div class="schedule-time-value">${escapeHtml(item.time || '')}</div>
                <div class="schedule-time-period" ${item.periodI18n ? `data-i18n="${item.periodI18n}"` : ''}>${escapeHtml(item.period || '')}</div>
            </div>
            <div class="schedule-content">
                <h4 class="schedule-title" ${item.titleI18n ? `data-i18n="${item.titleI18n}"` : ''}>${escapeHtml(item.title || '')}</h4>
                <div class="schedule-speaker" ${item.speakerI18n ? `data-i18n="${item.speakerI18n}"` : ''}>${escapeHtml(item.speaker || '')}</div>
                <div class="schedule-location" ${item.locationI18n ? `data-i18n="${item.locationI18n}"` : ''}>${escapeHtml(item.location || '')}</div>
                <span class="schedule-category" ${item.categoryI18n ? `data-i18n="${item.categoryI18n}"` : ''}>${escapeHtml(item.category || '')}</span>
            </div>
        </div>
    `).join('');
}

function renderBrands(containerId, brands) {
    const container = document.getElementById(containerId);
    if (!container || !brands) return;
    container.innerHTML = brands.map(brand => `
        <div class="brand-item">
            <div class="brand-logo">${escapeHtml(brand.shortName || (brand.name || '').charAt(0))}</div>
            <div class="brand-name">${escapeHtml(brand.name || '')}</div>
        </div>
    `).join('');
}

function renderNews(containerId, news) {
    const container = document.getElementById(containerId);
    if (!container || !news) return;
    container.innerHTML = news.map(item => `
        <div class="news-card">
            <div class="news-image">
                <div class="news-image-text">NEWS</div>
            </div>
            <div class="news-content">
                <div class="news-date">${escapeHtml(item.date || '')}</div>
                <h3 class="news-title" ${item.titleI18n ? `data-i18n="${item.titleI18n}"` : ''}>${escapeHtml(item.title || '')}</h3>
                <p class="news-excerpt" ${item.excerptI18n ? `data-i18n="${item.excerptI18n}"` : ''}>${escapeHtml(item.excerpt || '')}</p>
                <a href="${escapeHtml(item.url || '#')}" class="news-readmore" data-i18n="news.readmore">阅读全文</a>
            </div>
        </div>
    `).join('');
}

async function loadPageData() {
    const [exhibition, schedule, brands, news] = await Promise.all([
        fetchExhibitionData(),
        fetchSchedule(),
        fetchBrands(),
        fetchNews()
    ]);
    updateHeroStats(exhibition);
    if (schedule && schedule.length > 0) {
        renderScheduleItems('day1', schedule.filter(item => item.day === 1));
        renderScheduleItems('day2', schedule.filter(item => item.day === 2));
        renderScheduleItems('day3', schedule.filter(item => item.day === 3));
    }
    if (brands) renderBrands('brands-container', brands);
    if (news) renderNews('news-container', news.slice(0, 3));
    // 动态渲染的内容重新应用多语言翻译
    if (window.i18n && typeof window.i18n.translate === 'function') {
        window.i18n.translate();
    }
    // 动态渲染的新元素补加入场动画观察
    observeReveals();
}

document.addEventListener('DOMContentLoaded', () => { loadPageData(); });

// ========== 返回顶部按钮 ==========
(function initBackToTop() {
    const btn = document.createElement('div');
    btn.id = 'back-to-top';
    btn.title = '返回顶部';
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(btn);

    // 注入样式
    if (!document.getElementById('back-to-top-style')) {
        const style = document.createElement('style');
        style.id = 'back-to-top-style';
        style.textContent = `
            #back-to-top {
                position: fixed; right: 28px; bottom: 28px; z-index: 999;
                width: 44px; height: 44px; border-radius: 50%;
                background: var(--color-gradient-rose-navy, linear-gradient(135deg, #d81b60, #0d2b6e));
                color: #fff; display: flex; align-items: center; justify-content: center;
                font-size: 16px; cursor: pointer; opacity: 0; pointer-events: none;
                transform: translateY(12px); transition: all var(--transition-normal, 0.4s ease);
                box-shadow: 0 6px 20px rgba(26, 115, 232, 0.35);
            }
            #back-to-top.show { opacity: 1; pointer-events: auto; transform: translateY(0); }
            #back-to-top:hover { transform: translateY(-3px); box-shadow: 0 8px 26px rgba(0, 184, 148, 0.4); }
            @media (max-width: 768px) { #back-to-top { right: 16px; bottom: 16px; width: 40px; height: 40px; } }
        `;
        document.head.appendChild(style);
    }

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
})();

// ========== FAQ 手风琴 ==========
(function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    if (!document.getElementById('faq-accordion-style')) {
        const style = document.createElement('style');
        style.id = 'faq-accordion-style';
        style.textContent = `
            .faq-item { cursor: pointer; transition: box-shadow var(--transition-fast, 0.2s ease); }
            .faq-item:hover { box-shadow: var(--shadow-glow-rose, 0 0 20px rgba(216,27,96,0.2)); }
            .faq-item .faq-q { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
            .faq-item .faq-q .faq-icon { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: var(--color-primary-rose-light, #fce4ec); color: var(--color-primary-rose, #d81b60); display: flex; align-items: center; justify-content: center; font-size: 12px; transition: transform var(--transition-normal, 0.4s ease); }
            .faq-item .faq-a { max-height: 0; overflow: hidden; transition: max-height var(--transition-normal, 0.4s ease), padding var(--transition-normal, 0.4s ease), margin var(--transition-normal, 0.4s ease); margin: 0; padding: 0; }
            .faq-item.open { border-color: var(--color-primary-rose, #d81b60); }
            .faq-item.open .faq-icon { transform: rotate(45deg); background: var(--color-primary-rose, #d81b60); color: #fff; }
            .faq-item.open .faq-a { max-height: 400px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--color-card-border, #d5eae8); }
        `;
        document.head.appendChild(style);
    }
    faqItems.forEach(item => {
        const q = item.querySelector('h4');
        const a = item.querySelector('p');
        if (!q || !a) return;
        a.classList.add('faq-a');
        q.classList.add('faq-q');
        const icon = document.createElement('span');
        icon.className = 'faq-icon';
        icon.textContent = '+';
        q.appendChild(icon);
        item.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(other => other.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });
})();
