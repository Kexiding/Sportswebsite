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
            border-top-color: var(--color-green, #00b894);
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
            border-color: var(--color-green, #00b894) !important;
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
            max-width: 90%; white-space: nowrap; pointer-events: none;
        }
        .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        .toast.toast-error { background: #e53935; color: #fff; }
        .toast.toast-success { background: var(--color-green, #00b894); color: #fff; }
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
                .confirm-icon { font-size: 40px; color: var(--color-green, #00b894); margin-bottom: 12px; }
                .confirm-msg { font-size: 16px; color: #333; margin-bottom: 24px; line-height: 1.5; }
                .confirm-actions { display: flex; gap: 12px; justify-content: center; }
                .confirm-btn {
                    padding: 10px 28px; border-radius: 8px; border: none;
                    font-size: 15px; cursor: pointer; font-weight: 600;
                    transition: all 0.2s;
                }
                .confirm-btn.cancel { background: #f0f0f0; color: #666; }
                .confirm-btn.cancel:hover { background: #e0e0e0; }
                .confirm-btn.ok { background: var(--color-green, #00b894); color: #fff; }
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

// ========== 原有功能保持不变 ==========
document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initHeader();
    initScheduleTabs();
    initSmoothScroll();
    initRegistrationForms();
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
        return await response.json();
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
        return await response.json();
    } catch (error) {
        console.error('API fetch error:', error);
        return null;
    }
}

async function fetchBrands() {
    try {
        const response = await fetch(`${API_BASE_URL}/brands`);
        if (!response.ok) throw new Error('Failed to fetch brands');
        return await response.json();
    } catch (error) {
        console.error('API fetch error:', error);
        return null;
    }
}

async function fetchNews() {
    try {
        const response = await fetch(`${API_BASE_URL}/news`);
        if (!response.ok) throw new Error('Failed to fetch news');
        return await response.json();
    } catch (error) {
        console.error('API fetch error:', error);
        return null;
    }
}

function updateHeroStats(data) {
    if (!data) return;
    const statValues = document.querySelectorAll('.info-value');
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
                <div class="schedule-time-value">${item.time || ''}</div>
                <div class="schedule-time-period">${item.period || ''}</div>
            </div>
            <div class="schedule-content">
                <h4 class="schedule-title">${item.title || ''}</h4>
                <div class="schedule-speaker">${item.speaker || ''}</div>
                <div class="schedule-location">${item.location || ''}</div>
                <span class="schedule-category">${item.category || ''}</span>
            </div>
        </div>
    `).join('');
}

function renderBrands(containerId, brands) {
    const container = document.getElementById(containerId);
    if (!container || !brands) return;
    container.innerHTML = brands.map(brand => `
        <div class="brand-item">
            <div class="brand-logo">${brand.shortName || brand.name.charAt(0)}</div>
            <div class="brand-name">${brand.name || ''}</div>
        </div>
    `).join('');
}

function renderNews(containerId, news) {
    const container = document.getElementById(containerId);
    if (!container || !news) return;
    container.innerHTML = news.map(item => `
        <div class="news-card">
            <div class="news-image">
                <div class="news-image-icon"><i class="fas fa-newspaper"></i></div>
            </div>
            <div class="news-content">
                <div class="news-date">${item.date || ''}</div>
                <h3 class="news-title">${item.title || ''}</h3>
                <p class="news-excerpt">${item.excerpt || ''}</p>
                <a href="${item.url || '#'}" class="news-readmore">阅读全文</a>
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
}

document.addEventListener('DOMContentLoaded', () => { loadPageData(); });
