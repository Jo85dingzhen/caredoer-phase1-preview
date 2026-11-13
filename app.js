'use strict';

const categories = {
  all: '全部岗位', child: '儿童与托育', senior: '老人照护', home: '家庭安全', pet: '宠物照护',
};
const get = (id) => document.getElementById(id);
const dialog = get('dialog');
const dialogBody = get('dialog-body');
const storageKey = 'caredoer-jojo-preview-v1';
let activeCategory = 'all';
let activeRole = '23';

function drawRoles() {
  const list = roles.filter((role) => activeCategory === 'all' || role.category === activeCategory);
  get('role-count').textContent = list.length + ' 个岗位';
  get('role-filters').innerHTML = Object.entries(categories).map(([id, label]) =>
    `<button class="filter" type="button" data-filter="${id}" aria-pressed="${id === activeCategory}">${label}</button>`
  ).join('');
  get('role-list').innerHTML = list.map((role) => `
    <button class="role-button" type="button" data-role="${role.id}" aria-pressed="${role.id === activeRole}" aria-controls="role-detail">
      <span>${role.id}</span><span><b>${role.title}</b><small lang="en">${role.english}</small></span>
    </button>`
  ).join('');
  drawDetail();
}

function drawDetail() {
  const role = roles.find(({ id }) => id === activeRole);
  const training = role.courses.map((id) => `
    <button type="button" data-course="${id}" data-for-role="${role.id}">${courses[id].title} · ${courses[id].status}</button>`
  ).join('');
  get('role-detail').innerHTML = `
    <p class="meta">岗位 ${role.id} · ${role.scene}</p>
    <h3 id="role-title" tabindex="-1">${role.title}</h3>
    <p class="role-summary"><span lang="en">${role.english}</span> · ${role.summary}</p>
    <div class="step"><b>需要学什么</b><p>${role.training}</p><div class="role-courses">${training}</div></div>
    <div class="step"><b>需要哪些凭证与资格</b><p>${role.credential}</p></div>
    <div class="step"><b>培训后怎么上岗或开办</b><p>${role.nextStep}</p></div>
    <button class="button button-secondary" type="button" data-role-interest="${role.id}">登记这个岗位的意向</button>`;
}

function showDialog(title, content) {
  get('dialog-title').textContent = title;
  dialogBody.innerHTML = content;
  if (!dialog.open) dialog.showModal();
}

function showCourse(id, roleId) {
  const course = courses[id];
  if (course.mode) {
    showForm(course.mode, id, roleId);
    return;
  }
  const links = (course.links || []).map(({ label, url }) =>
    `<a class="button button-secondary" href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`
  ).join('');
  showDialog(course.title, `<p class="dialog-copy">${course.description}</p><p class="dialog-copy">${course.credential}</p><div class="actions">${links}</div>`);
}

function showForm(mode, courseId = '', roleId = '') {
  const course = courses[courseId];
  const role = roles.find(({ id }) => id === roleId);
  const registration = mode === 'registration';
  const roleInterest = mode === 'role';
  const button = registration ? '保存测试报名' : '保存测试意向';
  const sessionOptions = registration ? course.sessions.map((date) => `<option value="${date}">${date}</option>`).join('') : '';
  showDialog(course?.title || role.title, `
    <p class="dialog-copy">${course?.description || role.nextStep}</p>
    ${course ? `<p class="dialog-copy">${course.credential}</p>` : ''}
    ${role && course ? `<p class="dialog-copy">对应岗位 · ${role.title}</p>` : ''}
    <form id="preview-form">
      <label class="field">测试姓名 <input name="name" required maxlength="100" autocomplete="off" placeholder="例如 Test Learner"></label>
      <label class="field">测试邮箱 <input name="email" type="email" required maxlength="160" autocomplete="off" placeholder="例如 learner@example.com"></label>
      ${registration ? `<label class="field">演示班次<select name="session" required><option value="">选择示例班次</option>${sessionOptions}</select></label>` : ''}
      ${registration || roleInterest ? '<label class="check"><input name="caredoer" type="checkbox" value="yes">我愿意登记为 CareDoer，并接受后续资格核验。</label>' : ''}
      <p class="form-message" role="status"></p>
      <div class="actions"><button class="button button-secondary" type="submit">${button}</button></div>
    </form>`);
  get('preview-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const message = event.currentTarget.querySelector('.form-message');
    if (!fields.get('name').trim()) {
      message.textContent = '请输入测试姓名。';
      return;
    }
    try {
      const records = readRecords();
      records.push({
        id: String(Date.now()) + '-' + Math.random().toString(36).slice(2),
        name: fields.get('name').trim(),
        email: fields.get('email').trim(),
        courseId, roleId, mode,
        session: fields.get('session') || '',
        caredoer: fields.get('caredoer') === 'yes',
        status: registration ? 'registered' : 'interest',
        created: new Date().toISOString(),
      });
      writeRecords(records);
    } catch {
      message.textContent = '浏览器无法保存测试记录。请使用允许本地存储的浏览器重试。';
      return;
    }
    showDialog('测试记录已保存', '<p class="dialog-copy">可以在测试记录中查看或导出。此次操作仅记录在当前浏览器。</p><button class="button button-secondary" type="button" data-records>查看测试记录</button>');
    dialogBody.querySelector('button').focus();
  });
}

function readRecords() {
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
}

function writeRecords(records) {
  localStorage.setItem(storageKey, JSON.stringify(records));
}

const statusLabels = { registered: '已报名', interest: '意向登记', cancelled: '已取消', refunded: '已退款' };

function showRecords() {
  let records;
  try {
    records = readRecords();
  } catch {
    showDialog('测试记录', '<p>浏览器无法读取本地测试记录。</p>');
    return;
  }
  showDialog('测试记录', records.length ? `
    <p class="dialog-copy">按课汇总使用班次和报名状态。CareDoer 意向名单只包含勾选意向的记录。</p>
    <div class="actions"><button class="button button-secondary" data-export="summary" type="button">导出按课报名</button><button class="button button-outline" data-export="interest" type="button">导出 CareDoer 意向</button><button class="button button-outline" data-export="all" type="button">导出全部记录</button></div>
    <p id="record-message" class="form-message" role="status"></p><ul class="record-list" id="record-list"></ul>` :
    '<p>还没有测试记录。可从课程或岗位详情提交一条测试数据。</p>');
  if (!records.length) return;
  for (const record of records.slice().reverse()) {
    const item = document.createElement('li');
    const title = document.createElement('strong');
    const details = document.createElement('p');
    const role = roles.find(({ id }) => id === record.roleId);
    title.textContent = courses[record.courseId]?.title || role?.title || '岗位意向';
    details.textContent = [record.name, record.session, statusLabels[record.status]].filter(Boolean).join(' · ');
    item.append(title, details);
    const nextStatus = { registered: 'cancelled', cancelled: 'refunded' }[record.status];
    if (nextStatus) {
      const actions = document.createElement('div');
      const button = document.createElement('button');
      actions.className = 'actions';
      button.className = 'button button-outline';
      button.type = 'button';
      button.dataset.recordId = record.id;
      button.textContent = nextStatus === 'cancelled' ? '模拟取消' : '模拟退款';
      actions.append(button);
      item.append(actions);
    }
    get('record-list').append(item);
  }
}

function advanceRecord(id) {
  try {
    const records = readRecords();
    const record = records.find((entry) => entry.id === id);
    const nextStatus = { registered: 'cancelled', cancelled: 'refunded' }[record?.status];
    if (!nextStatus) return;
    record.status = nextStatus;
    writeRecords(records);
    showRecords();
    dialogBody.querySelector('button').focus();
    get('record-message').textContent = '测试订单已更新为' + statusLabels[nextStatus] + '。';
  } catch {
    get('record-message').textContent = '无法更新本地测试记录。';
  }
}

function csvCell(value) {
  const text = String(value ?? '');
  const safe = /^\s*[=+@-]/.test(text) || /^[\t\r\n]/.test(text) ? "'" + text : text;
  return '"' + safe.replaceAll('"', '""') + '"';
}

function summaryRows(records) {
  const totals = new Map();
  for (const record of records) {
    if (record.mode !== 'registration') continue;
    const key = record.courseId + ':' + record.session;
    if (!totals.has(key)) totals.set(key, {
      title: courses[record.courseId].title, session: record.session, registered: 0, cancelled: 0, refunded: 0,
    });
    totals.get(key)[record.status] += 1;
  }
  return [
    ['课程', '演示班次', '已确认报名', '已取消', '已退款'],
    ...Array.from(totals.values(), ({ title, session, registered, cancelled, refunded }) => [title, session, registered, cancelled, refunded]),
  ];
}

function downloadCsv(kind) {
  let records = readRecords();
  if (kind === 'interest') records = records.filter((record) => record.caredoer);
  const rows = kind === 'summary' ? summaryRows(records) : [
    ['姓名', '邮箱', '课程', '演示班次', '岗位编号', 'caredoer_interest', '状态', '记录时间（UTC）'],
    ...records.map((record) => [
      record.name, record.email, courses[record.courseId]?.title, record.session,
      record.roleId, record.caredoer ? 'yes' : 'no', statusLabels[record.status], record.created,
    ]),
  ];
  const contents = '\ufeff' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([contents], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'caredoer-preview-' + kind + '.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

get('course-grid').innerHTML = Object.entries(courses).map(([id, course]) => `
  <article class="course-card">
    <span class="status">${course.status}</span>
    <h3>${course.title}</h3>
    <p>${course.description}</p>
    <button type="button" class="button button-outline" data-course="${id}">${course.action}</button>
  </article>`
).join('');

drawRoles();
get('open-records').addEventListener('click', showRecords);
get('close-dialog').addEventListener('click', () => dialog.close());
document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const { filter, role, course, forRole, roleInterest, records, recordId, export: exportKind } = button.dataset;
  if (filter) {
    activeCategory = filter;
    if (filter !== 'all' && !roles.some((item) => item.id === activeRole && item.category === filter)) {
      activeRole = roles.find((item) => item.category === filter).id;
    }
    drawRoles();
    get('role-filters').querySelector(`[data-filter="${filter}"]`).focus();
  }
  if (role) {
    activeRole = role;
    for (const option of get('role-list').querySelectorAll('button')) {
      option.setAttribute('aria-pressed', String(option.dataset.role === role));
    }
    drawDetail();
    get('role-title').focus();
  }
  if (course) showCourse(course, forRole);
  if (roleInterest) showForm('role', '', roleInterest);
  if (records !== undefined) showRecords();
  if (recordId) advanceRecord(recordId);
  if (exportKind) downloadCsv(exportKind);
});
