(() => {
  'use strict';
  const data = window.CAREDODO_DATA;
  const main = document.getElementById('main');
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  let lang = 'en';
  let route = '';
  let params = new URLSearchParams();
  let homeZip = '';
  // Memory only. Kept across language changes, cleared when leaving the assessment.
  let assessmentAnswers = {};
  let assessmentComplete = false;
  let assessmentStep = 0;
  const t = (en, zh) => lang === 'zh' ? zh : en;
  const local = value => value?.[lang] || '';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const url = (path = '', values = {}) => {
    const query = new URLSearchParams(Object.entries(values).filter(([, v]) => v != null && v !== ''));
    return `#/${lang}${path ? '/' + path : ''}${query.size ? '?' + query : ''}`;
  };
  const link = (path, label, cls = '', values = {}) => `<a class="${cls}" href="${esc(url(path, values))}">${label}</a>`;
  const button = (path, label, values = {}, secondary = false) => link(path, esc(label) + '<span aria-hidden="true">↗</span>', `button ${secondary ? 'button-outline' : 'button-primary'}`, values);
  const active = () => data.services.filter(s => s.status === 'active');
  const serviceById = id => data.services.find(s => s.id === id);
  const cityById = id => data.cities.find(c => c.id === id);
  const cityName = c => `${local(c.name)}, ${c.state}`;
  const cityForZip = zip => data.cities.find(c => c.zips.includes(zip));
  const price = () => t('Price to be confirmed · Consult first', '价格待定 · 预约咨询');
  const scope = () => t('Bay Area & Los Angeles · Launch areas planned', '湾区与洛杉矶 · 首发规划区');
  const demoNote = () => t('Preview only. Cities, ZIP codes and availability statuses below are examples, not confirmed service coverage. All requests stay in this page; nothing is sent.', '仅供预览。下方城市、邮编与服务状态均为示例，不代表已确认的服务区域。所有登记仅在本页演示，不会发送。');
  const coverageNote = () => `<p class="notice">${esc(demoNote())}</p>`;
  const list = items => `<ul class="clean-list">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
  const photos = {
    hero: ['hero-caregiver-home.jpg', 'A caregiver and an older adult reading together at home · 照护者与长者在家一起阅读', 1920, 1279],
    companion: ['companionship-tea.jpg', 'Two older adults talking over tea · 两位长者喝茶聊天', 1920, 1279],
    assist: ['daily-living-getting-ready.jpg', 'An older adult and a caregiver holding hands at home · 长者与照护者在家握手交流', 1920, 1279],
    home: ['housekeeping-making-bed.jpg', 'An older adult relaxing while a caregiver makes the bed · 长者休息，照护者在一旁整理床铺', 1920, 1279],
    portrait: ['caregiver-portrait.jpg', 'Portrait of a caregiver in a home setting · 居家环境中的照护者人像', 1920, 1279],
    training: ['caregiver-training-class.jpg', 'Adults attending a training workshop · 成人参加培训工作坊', 1920, 1279],
    community: ['caregivers-community-team.jpg', 'Caregivers and an older adult sharing a book · 照护者与长者一起看书', 1920, 1280],
    family: ['family-asian-cooking.jpg', 'Three generations making dumplings together · 一家三代一起包饺子', 1920, 1279],
    bay: ['bay-area-victorian-homes.jpg', 'Victorian homes in San Francisco · 旧金山的维多利亚式住宅', 1920, 1279],
    la: ['los-angeles-residential-street.jpg', 'A palm-lined residential street in Los Angeles · 洛杉矶棕榈树下的住宅街道', 1920, 1279],
    tea: ['detail-hands-teacup.jpg', 'An older woman holding a teacup · 长者手捧茶杯', 1920, 2880],
    interior: ['detail-home-interior.jpg', 'A sunlit dining table at home · 阳光下的居家餐桌', 1920, 1279]
  };
  const photo = (key, cls = '', eager = false) => {
    const [file, alt, width, height] = photos[key] || photos.interior;
    return `<div class="photo ${cls}"><img src="assets/photos/${file}" alt="${esc(alt)}" width="${width}" height="${height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`;
  };
  const pagePhoto = () => {
    if (route.includes('assessment') || route.includes('requirements')) return 'training';
    if (route === 'join') return 'portrait';
    if (route === 'community') return 'community';
    if (route.startsWith('cities/') || route === 'cities' || route === 'areas') {
      const city = cityById(route.split('/')[1]);
      return city?.region === 'los-angeles-area' ? 'la' : 'bay';
    }
    if (route.startsWith('services/')) return photos[route.split('/')[1]] ? route.split('/')[1] : 'interior';
    return 'interior';
  };
  const heading = (eyebrow, title, intro = '', withPhoto = true) => `<div class="page-heading"><div><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1>${intro ? `<p class="lead">${esc(intro)}</p>` : ''}</div>${withPhoto ? photo(pagePhoto(), 'page-photo') : ''}</div><!-- page-heading-end -->`;
  const sectionHead = (n, title, intro = '') => `<div class="section-heading"><p class="eyebrow">${n}</p><h2>${esc(title)}</h2>${intro ? `<p class="muted">${esc(intro)}</p>` : ''}</div>`;
  const faq = (items, title = t('Questions, answered', '常见问题')) => `<section class="section faq-section"><div class="shell faq-layout"><div><p class="eyebrow">FAQ</p><h2>${esc(title)}</h2></div><div class="faq-list">${items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></div></section>`;
  const commonFaq = () => [
    [t('Can I request support for a parent?', '可以替父母提出需求吗？'), t('Yes. The request separates the person receiving support from the booking contact and any family member authorized to view service summaries.', '可以。需求表区分服务对象、预约联系人，以及获授权查看服务摘要的家属。')],
    [t('Is this medical care?', '这是医疗护理吗？'), t('The pilot focuses on companionship, daily living assistance and light housekeeping. Medical nursing and clinical procedures are outside this scope and require human assessment.', '试点聚焦老人陪伴、日常生活协助和适老化轻家务。医疗护理与临床操作不在首期范围内，相关需求需人工评估。')],
    [t('Does a request confirm a visit?', '登记后就确定上门吗？'), t('No. Operations must confirm the task, staffing and time, then both parties confirm the arrangement. This preview does not send requests or book visits.', '不会。运营需先确认任务、人手和时间，再由双方确认安排。本预览不发送需求，也不创建真实预约。')],
    [t('What does it cost?', '费用是多少？'), t('Pricing, minimum visit duration, cancellation and refund rules are awaiting confirmation. Consult first; there is no payment in this preview.', '价格、最低服务时长、取消和退款规则均待确认。请先预约咨询；本预览没有付款功能。')]
  ];
  const status = (zip, service) => service.status === 'coming'
    ? 'coming'
    : (data.zipAvailability[zip]?.[service.id] || 'interest');
  const selectedZip = city => city?.zips.includes(params.get('zip')) ? params.get('zip') : '';
  const badge = (zip, service) => {
    const state = status(zip, service);
    const label = state === 'coming' ? t('Coming soon', '即将开放') : `${t('Example: ', '示例：')}${local(data.availability[state])}`;
    return `<span class="badge badge-${state}">${esc(label)}</span>`;
  };
  const serviceCard = (s, city) => `<article class="service-card"><div class="card-top"><span class="index">${s.code}</span><span class="product">${esc(s.product || t('Future service', '后续服务'))}</span>${s.status === 'coming' ? badge('', s) : ''}</div><h3>${link(city ? `cities/${city.id}/${s.id}` : `services/${s.id}`, esc(local(s.name)), '', { zip: selectedZip(city) })}</h3><p>${esc(local(s.summary))}</p>${selectedZip(city) && s.status === 'active' ? badge(selectedZip(city), s) : ''}<div class="card-bottom">${link(city ? `cities/${city.id}/${s.id}` : `services/${s.id}`, esc(t('Explore service', '查看服务')) + ' <span aria-hidden="true">→</span>', 'text-link', { zip: selectedZip(city) })}</div></article>`;
  const servicesGrid = (services = active(), city) => `<div class="service-grid">${services.map(s => serviceCard(s, city)).join('')}</div>`;
  const plansGrid = () => `<div class="plan-grid">${data.plans.map(p => `<article class="plan-card"><p class="product">${p.name}</p><h3>${esc(local(p.title))}</h3><p>${esc(local(p.description))}</p><p class="price">${esc(price())}</p>${link('request', esc(t('Discuss this plan', '咨询此计划')) + ' →', 'text-link', { plan: p.id })}</article>`).join('')}</div>`;
  const processSteps = () => [
    [t('Tell us about your day', '说明家庭日常'), t('Share your ZIP code, the tasks you need help with, language and preferred times.', '说明邮编、需要协助的任务、语言与偏好时段。')],
    [t('Review the possibilities', '人工核对需求'), t('Operations reviews the service scope, qualifications, staffing and travel area.', '运营核对服务范围、人员资格、人手与交通半径。')],
    [t('Agree on the details', '双方确认安排'), t('Both parties confirm the person, tasks, time, price and terms before a visit.', '上门前，双方确认人选、任务、时间、费用与条款。')],
    [t('Visit, then follow through', '到访、交接与反馈'), t('A visit record and authorized family summary support feedback and the next arrangement.', '记录到访与交接，获授权家属查看摘要，再沟通反馈与后续安排。')]
  ];
  const processGrid = () => `<ol class="process-grid">${processSteps().map(([title, copy], i) => `<li><span class="step-number">0${i + 1}</span><h3>${esc(title)}</h3><p>${esc(copy)}</p></li>`).join('')}</ol>`;
  const zipForm = (value = '', onHome = false) => `<form id="zip-form" class="zip-form">
    <label for="zip">${esc(t('ZIP code', '邮编'))}</label>
    <div class="zip-controls">
      <input id="zip" name="zip" type="text" inputmode="numeric" autocomplete="postal-code" pattern="[0-9]{5}" maxlength="5" placeholder="${t('Enter ZIP code', '输入 5 位邮编')}" value="${esc(value)}" required aria-describedby="zip-hint">
      <button class="button button-primary" type="submit">${esc(t('Check your area', '查询您所在的地区'))}</button>
    </div>
    <p class="small" id="zip-hint">${esc(onHome
      ? t('Preview only · Service areas are illustrative.', '仅供演示 · 服务区域为示例。')
      : t('Enter a five-digit US ZIP code. Try 94301 for an example.', '请输入 5 位美国邮编，可用 94301 查看示例。'))}</p>
  </form>`;
  const cta = () => `<section class="section cta-section"><div class="shell closing-cta"><div><p class="eyebrow">${esc(t('A good place to start', '从家庭需求开始'))}</p><h2>${esc(t('Let’s talk about your family’s day.', '聊聊您和家人的日常需要。'))}</h2><p>${esc(t('Share the tasks you have in mind. Timing, scope and availability come next.', '先说明希望获得的支持，再确认范围、时段与人手。'))}</p></div>${button('request', t('Request a consultation', '预约咨询'))}</div></section>`;
  const meta = (title, description) => { document.title = `${title} | CareDoDo`; document.querySelector('meta[name="description"]').content = description; };

  function renderChrome() {
    main.inert = false;
    footer.inert = false;
    const navItems = [
      ['services', t('Find support', '找服务')],
      ['plans', t('Family plans', '家庭服务计划')],
      ['safety', t('Trust & safety', '信任与安全')]
    ];
    const nav = navItems.map(([path, label]) => {
      const current = route === path || route.startsWith(path + '/') ||
        (path === 'services' && /^(cities|areas)(\/|$)/.test(route));
      return `<a href="${url(path)}"${current ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
    }).join('');
    header.innerHTML = `<header class="masthead"><div class="shell header-inner">
      ${link('', '<span class="brand-name">CareDoDo</span><span class="brand-sub" lang="zh-CN">康都都</span>', 'brand')}
      <nav id="primary-nav" aria-label="${t('Main navigation', '主导航')}">
        ${nav}${link('account', esc(t('Log in', '登录')), 'header-login')}
        <div class="mobile-nav-extra">${link('cities', esc(t('Service cities', '服务城市')))}${link('community', esc(t('Community & advancement', '社区与晋阶')))}${button('request', t('Request a consultation', '预约咨询'))}</div>
      </nav>
      <div class="header-tools">
        <button id="language-switch" class="language-button" type="button" lang="${lang === 'en' ? 'zh-CN' : 'en'}" aria-label="${t('Switch to Chinese', 'Switch to English')}">${t('中文', 'EN')}</button>
        ${link('join', esc(t('Become a CareDoer', '成为康都人')), 'button button-primary career-link')}
        <button id="menu-toggle" class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="${t('Open menu', '打开菜单')}"><span></span><span></span></button>
      </div>
    </div></header>`;
    const groups = [
      [t('At home', '家庭服务'), active().map(s => [`services/${s.id}`, local(s.name)]).concat([['plans', t('Family plans', '家庭服务计划')], ['how', t('How it works', '如何运作')]])],
      [t('Our places', '服务城市'), [['cities', t('Bay Area & Los Angeles', '湾区与洛杉矶')], ['cities/palo-alto', 'Palo Alto'], ['cities/los-angeles', 'Los Angeles']]],
      [t('CareDoers', '康都人'), [['join', t('Become a CareDoer', '成为康都人')], ['join/assessment', t('Career self-assessment', '职业自评')], ['join/requirements', t('Qualifications & training', '认证与培训')], ['community', t('Community & advancement', '社区与晋阶')]]],
      [t('CareDoDo', '公司与政策'), [['about', t('About us', '关于我们')], ['contact', t('Contact & partnerships', '联系与机构合作')], ['safety', t('Trust & safety', '信任与安全')], ['account', t('Account preview', '账号规划')], ['privacy', t('Privacy · Draft', '隐私 · 待定稿')], ['terms', t('Terms · Draft', '条款 · 待定稿')]]]
    ];
    footer.innerHTML = `<footer><div class="shell"><div class="footer-top"><div>${link('', '<span class="brand-name">CareDoDo.</span><span class="brand-sub">康都都</span>', 'brand')}<p>${esc(t('A little more company. A little help at home.', '多一份陪伴，也为日常搭一把手。'))}</p><p>${esc(scope())}</p><button id="footer-language" class="language-button" type="button">${t('中文', 'English')}</button></div><nav aria-label="${t('Footer navigation', '页尾导航')}">${groups.map(([title, items]) => `<div><h2>${esc(title)}</h2>${items.map(([path, label]) => link(path, esc(label))).join('')}</div>`).join('')}</nav></div><div class="footer-bottom"><span>CareDoDo × CareDoer</span><span>${esc(t('Non-medical support · Static planning preview', '非医疗生活支持 · 静态规划预览'))}</span><a href="assets/photos/CREDITS.md">${esc(t('Photography credits', '图片来源'))}</a><a href="${esc(data.careerSiteUrl)}">CareDoer ↗</a></div></div></footer>`;
    document.querySelector('.skip-link').textContent = t('Skip to content', '跳至正文');
    const switchLanguage = () => {
      if (!route) homeZip = document.getElementById('zip')?.value || '';
      window.location.hash = `#/${lang === 'en' ? 'zh' : 'en'}${route ? '/' + route : ''}${params.size ? '?' + params : ''}`; };
    document.getElementById('language-switch').addEventListener('click', switchLanguage);
    document.getElementById('footer-language').addEventListener('click', switchLanguage);
    const toggle = document.getElementById('menu-toggle');
    const setMenu = open => {
      document.getElementById('primary-nav').classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? t('Close menu', '关闭菜单') : t('Open menu', '打开菜单'));
      document.body.classList.toggle('menu-open', open);
      main.inert = open;
      footer.inert = open;
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    toggle.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
    header.onkeydown = event => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') { setMenu(false); toggle.focus(); }
      if (event.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true') {
        const items = [...header.querySelectorAll('a, button')].filter(el => el.getClientRects().length);
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
  }

  const homeFaq = () => [...commonFaq(),
    [t('Where are you planning to start?', '计划先在哪些地区开展？'), t('The Bay Area (Silicon Valley) and Los Angeles are the two planned launch areas. City and ZIP listings are examples; actual coverage is awaiting confirmation.', '湾区（硅谷）与洛杉矶是两个首发规划区。城市与邮编列表均为示例，实际服务范围待确认。')],
    [t('Can we discuss Chinese-language support?', '可以沟通中文服务需求吗？'), t('Yes. Include your language preference in the consultation. English, Chinese and other language needs are checked against actual staffing before confirmation.', '可以在咨询时填写语言偏好。英文、中文及其他语言需求均需结合实际人手核对确认。')],
    [t('How are CareDoers prepared and reviewed?', '康都人如何培训和核验？'), t('The planned path starts with CPR and role learning, then internal assessment and applicable HCO and HCA checks. Background-check scope and training hours are to be determined. A course alone does not authorize service.', '规划从 CPR 与岗位学习开始，再完成内部考核及适用的 HCO 与 HCA 核验。背景审核范围和培训小时数待定。完成课程不等于获准服务。')],
    [t('Can we request the same person regularly?', '可以申请固定同一位康都人吗？'), t('A consistent person is a priority preference for ongoing support. Specific staffing and times need operations confirmation; changes are discussed with the family.', '持续支持优先考虑固定人选。具体人员与时段需经运营确认，变更需与家庭沟通。')],
    [t('Who can see visit summaries?', '哪些家属可以查看服务摘要？'), t('The recipient, booking contact and authorized family members are separate roles. Access is based on verified consent and permissions; account functions are not connected in this preview.', '服务对象、预约联系人与获授权家属为不同角色，访问需核验同意及权限。本预览尚未接通账号功能。')],
    [t('Does training guarantee a job?', '完成培训保证录用吗？'), t('No. Learning, credentials, employment review and task permissions are separate. Pay, fees and the employment model remain to be confirmed.', '不保证。学习、资格、录用审核与任务权限分别确认，薪资、费用与用工模式仍待定。')]
  ];

  function editorialServices() {
    return `<div class="editorial-services">${active().map((s, i) => `<article class="service-feature">${photo(s.id)}<div class="service-copy"><p class="eyebrow"><span class="service-index">0${i + 1}</span>${s.product}</p><h3>${link(`services/${s.id}`, esc(local(s.name)))}</h3><p>${esc(local(s.audience))}</p>${list(local(s.tasks))}<div class="scope-note"><h4>${esc(t('Outside this service', '服务边界'))}</h4><p>${esc(local(s.boundary))}</p></div>${link(`services/${s.id}`, esc(t('Explore ' + s.product, '了解' + local(s.name))) + ' <span aria-hidden="true">→</span>', 'text-link')}</div></article>`).join('')}</div>`;
  }

  const supportGrid = () => editorialServices();

  function homePage() {
    meta(t('Support at home for you and your family', '为自己或家人找到居家支持'), t('Explore non-medical companionship, daily living assistance and light housekeeping. CareDoDo plans to start in the Bay Area and Los Angeles.', '了解老人陪伴、日常生活协助与适老化轻家务。CareDoDo 计划从湾区与洛杉矶开展非医疗居家支持。'));
    const stories = [
      ['01', t('Company, on an ordinary afternoon.', '让普通的午后，多一点陪伴。'), t('A daughter who lives elsewhere wants more company for her father. They discuss Chinese-language conversation, a shared book and a walk on a familiar route; the handoff goes only to an authorized contact.', '女儿住在外地，希望父亲白天有人聊聊天。咨询时约定中文交流、一起读书或沿熟悉路线散步，并明确由哪位获授权联系人接收交接。'), 'companion'],
      ['02', t('A familiar routine, with a little help.', '熟悉的生活，有人搭一把手。'), t('An older adult wants to keep making simple meals at home. The family discusses an agreed shopping list and preparation tasks, confirms spending permission, and checks what can fit within Assist.', '长者希望继续在家准备简单餐食。家人先说明采购清单和备餐任务，确认支出授权，再与运营逐项核对 Assist 可以提供的支持。'), 'assist'],
      ['03', t('A home that feels ready for the week.', '把家收拾好，安心开始新一周。'), t('Laundry and everyday tidying are becoming tiring. A family asks about help in the bedroom and living room, agrees on supplies and areas, and keeps repairs and deep cleaning outside the request.', '洗衣和整理逐渐费力。家人咨询卧室与客厅的轻家务，先约定区域与用品；维修、改造和深度保洁另作安排。'), 'home']
    ];
    const regions = [
      ['bay', 'NORTHERN CALIFORNIA', t('Bay Area', '湾区'), t('Silicon Valley & nearby neighborhoods', '硅谷与周边社区'), data.cities.filter(c => ['silicon-valley', 'bay-area'].includes(c.region))],
      ['la', 'SOUTHERN CALIFORNIA', t('Los Angeles', '洛杉矶'), t('Los Angeles & the San Gabriel Valley', '洛杉矶与圣盖博谷'), data.cities.filter(c => c.region === 'los-angeles-area')]
    ];
    return `<section class="hero" aria-labelledby="home-heading"><div class="shell hero-layout"><div class="hero-copy"><p class="eyebrow">${esc(t('At home. In good company.', '在家，就有一份好陪伴。'))}</p><h1 id="home-heading">${t('A little help<br>at home.', '让家里的日常<br>多一点帮手。')}</h1><p class="lead">${esc(t('A conversation over tea. Help with a meal. A home put in order. Non-medical companionship and practical support for older adults, shaped around your family’s day.', '喝茶聊天，准备一餐，整理房间。为长者与家人提供非医疗陪伴和生活协助，从每天具体的小事开始。'))}</p>${zipForm(homeZip, true)}<div class="hero-actions">${link('request', esc(t('Let’s talk about your family', '聊聊家人的需要')) + ' →', 'text-link')}${link('services', esc(t('Explore our services', '了解三项服务')) + ' →', 'text-link')}</div><p class="hero-footnote">${esc(t('Planned for the Bay Area & Los Angeles. Availability and pricing to be confirmed.', '首发规划：湾区与洛杉矶。实际可用情况及费用待确认。'))}</p></div><figure class="hero-image">${photo('hero', '', true)}<figcaption><span>${t('THE EVERYDAY, TOGETHER', '一起，好好过日常')}</span><span>CareDoDo · California</span></figcaption></figure></div></section>
    <div class="trust-strip shell"><span>Bay Area & Los Angeles</span><span>${esc(t('Non-medical home support', '非医疗居家支持'))}</span><span>${esc(t('CareDoer certification path · Planned', '康都人认证路径 · 规划中'))}</span><span>${esc(t('English & Chinese preferences', '可沟通中英双语需求'))}</span></div>
    <section class="section home-support" aria-labelledby="home-support-title"><div class="shell"><div class="editorial-heading"><div><p class="eyebrow">${esc(t('A little help, every day', '日常里，搭一把手'))}</p><h2 id="home-support-title">${esc(t('Care begins with the everyday.', '照应，藏在日常的小事里。'))}</h2></div><p>${esc(t('Three starting points. We agree on the tasks and boundaries before discussing a match.', '从三项具体的支持开始。先说清楚做什么、不做什么，再沟通合适的人选。'))}</p></div>${editorialServices()}<div class="section-tail">${link('services', esc(t('All services & future categories', '全部服务与后续分类')) + ' →', 'text-link')}<span class="small">${esc(price())}</span></div></div></section>
    <section class="section white-section"><div class="shell">${sectionHead(t('How it works', '服务流程'), t('A conversation before a commitment.', '先沟通，再安心确认。'))}${processGrid()}${link('how', esc(t('Understand each step', '了解每一步')) + ' →', 'text-link')}</div></section>
    <section class="section"><div class="shell quality-layout"><figure class="quality-photo">${photo('portrait')}<figcaption>${esc(t('Stock photograph · Not a CareDoDo team endorsement', '素材照片 · 不代表 CareDoDo 在岗人员或代言'))}</figcaption></figure><div>${sectionHead(t('The people who show up', '来到您身边的人'), t('Preparation comes before the front door.', '走进家门前，先做好准备。'), t('CareDoer connects learning with reviewed service permissions. These are planned checks, not a claim that a team is already approved.', 'CareDoer 将学习与服务权限核验相衔接。以下为规划要求，不代表现有团队已经全部获准上岗。'))}<ol class="quality-steps"><li><span>01</span><div><h3>${esc(t('CPR → Role learning → Certificate', 'CPR → 岗位学习 → 内部证书'))}</h3><p>${esc(t('Required CPR, practical learning and internal assessment. Training hours: to be determined.', '必修 CPR、岗位实操学习与内部考核。培训小时数：待定。'))}</p></div></li><li><span>02</span><div><h3>${esc(t('Qualifications and background review', '资格与背景核验'))}</h3><p>${esc(t('Organization licensing and worker registration are separate. Applicable checks, scope and review cycle: to be confirmed.', '机构许可与人员注册分别核验。适用背景审核项目、范围与周期：待确认。'))}</p></div></li><li><span>03</span><div><h3>${esc(t('Authorized tasks & ongoing learning', '核准任务权限，持续学习'))}</h3><p>${esc(t('Operations reviews region, tasks and qualification validity. Family feedback informs learning and the next arrangement.', '运营核对地区、任务及资格有效期，家属反馈回到复训与后续安排。'))}</p></div></li></ol><div class="section-tail">${link('join/requirements', esc(t('Read the qualification pathway', '查看认证与上岗步骤')) + ' →', 'text-link')}${link('join/assessment', esc(t('Explore a care career', '探索康养职业')) + ' →', 'text-link')}</div></div></div></section>
    <section class="numbers-section"><div class="shell"><p class="eyebrow">${esc(t('The plan, in perspective', '用数字了解规划'))}</p><div class="numbers">${[['2',t('Planned launch areas', '首发规划地区')], ['3', t('Initial service categories', '首期服务分类')], ['55',t('Roles in the career plan', '职业规划中的岗位')], ['8 × 3',t('Internal certificate framework', '内部证书体系规划')]].map(([n,l]) => `<div><strong>${n}</strong><p>${esc(l)}</p></div>`).join('')}</div><p class="small">${esc(t('Planning figures from the supplied CareDoDo and CareDoer documents. Not customer counts, live jobs or confirmed service coverage.', '数字来自现有 CareDoDo 与 CareDoer 规划文档，不代表客户数、开放职位或已确认覆盖范围。'))}</p></div></section>
    <section class="section"><div class="shell"><div class="editorial-heading">${sectionHead(t('Around the family table', '家人的日常'), t('Different days. Familiar needs.', '不同的日常，熟悉的牵挂。'))}<p>${esc(t('Illustrative scenarios, not customer testimonials. Every arrangement begins with an individual conversation.', '以下均为示例场景，并非客户评价。每一次具体安排，都从单独沟通开始。'))}</p></div><div class="family-layout">${photo('family')}<div class="stories">${stories.map(([n,title,copy,service]) => `<article><p class="eyebrow">${n} · ${t('Illustrative scenario', '示例场景')}</p><h3>${esc(title)}</h3><p>${esc(copy)}</p>${link(`services/${service}`, esc(local(serviceById(service).name)) + ' →', 'text-link')}</article>`).join('')}</div></div></div></section>
    <section class="section white-section"><div class="shell">${sectionHead(t('Close to home', '从身边的社区开始'), t('Two places to begin.', '从两个地区，慢慢开始。'), t('Bay Area and Los Angeles are planned in parallel. The directory below is illustrative; coverage is confirmed by ZIP, task and local readiness.', '湾区与洛杉矶并列为首发规划区。以下为样例目录，服务范围需按邮编、任务及当地运营条件确认。'))}<div class="region-spread">${regions.map(([key,eyebrow,title,subtitle,cities]) => `<article>${photo(key)}<p class="eyebrow">${eyebrow}</p><h3>${esc(title)}</h3><p class="muted">${esc(subtitle)}</p><ul class="region-cities">${cities.map(c => `<li>${link(`cities/${c.id}`, esc(local(c.name)) + '<span aria-hidden="true">↗</span>')}</li>`).join('')}</ul></article>`).join('')}</div></div></section>
    <section class="section"><div class="shell community-teaser">${photo('community')}<div><p class="eyebrow">CareDoDo × CareDoer</p><h2>${esc(t('A place to learn. A path to grow.', '在社区学习，也在社区成长。'))}</h2><p>${esc(t('Start with CPR, explore a role, learn with peers and prepare for reviewed service. Our community plan connects families with people who keep building their skills.', '从 CPR 开始，探索岗位、与同伴一起学习，为通过核验后服务做好准备。社区规划让家庭支持与康都人的持续成长相互衔接。'))}</p>${link('community', esc(t('Community & career advancement', '了解社区与职业晋阶')) + ' →', 'text-link')}</div></div></section>
    ${faq(homeFaq())}${cta()}`;
  }

  function servicesPage() {
    meta(t('Home support services', '居家服务目录'), t('Compare Companion, Assist and Home in the initial non-medical pilot. Cleaning, cooking, pets, gardening and more are future categories.', '比较首期三项非医疗服务：老人陪伴、日常生活协助与适老化轻家务。保洁、做饭、宠物、园艺等为即将开放分类。'));
    return `<section class="section shell service-directory">${heading(scope(), t('Support for everyday life.', '支持日常生活的居家服务。'), t('Start with the task your family needs. Service availability is confirmed by ZIP code, task, staffing and time.', '从家庭需要完成的任务开始，按邮编、服务范围、人手与时间确认可用情况。'))}${supportGrid()}<div class="section-heading future-heading"><p class="eyebrow">${esc(t('Looking ahead', '后续服务'))}</p><h2>${esc(t('More ways to help, in time.', '更多生活服务，逐步开放。'))}</h2><p class="muted">${esc(t('These categories are not open for matching. Simple meal preparation and shopping remain limited to the agreed Assist scope.', '以下分类暂不开放匹配。简单备餐和购物仅限 Assist 中约定的试点任务。'))}</p></div>${servicesGrid(data.services.filter(s => s.status === 'coming'))}</section>${faq(commonFaq())}${cta()}`;
  }

  function servicePage(service, city) {
    const name = local(service.name);
    const place = city ? cityName(city) : t('Bay Area & Los Angeles', '湾区与洛杉矶');
    const coming = service.status === 'coming';
    const title = `${name} · ${place}`;
    meta(title, t(`${name} in ${place}: ${local(service.summary)} ${coming ? 'Coming soon; interest only.' : 'Explore tasks, scope and consultation.'} Sample availability; price to be confirmed.`, `${place}${name}：${local(service.summary)}${coming ? '即将开放，仅登记意向。' : '了解任务、边界与咨询安排。'}区域状态仅为示例，价格待定。`));
    const zip = selectedZip(city);
    const values = { service: service.id, zip };
    const cityInfo = city ? `${coverageNote()}${zip ? badge(zip, service) : ''}<p class="small section-note">${esc(t(`Sample ZIP codes: ${city.zips.join(', ')}. These are not the city's full postal coverage.`, `示例邮编：${city.zips.join('、')}，并非该城市的完整邮编范围。`))}</p>` : '';
    const core = coming ? `<div class="content-panel"><h2>${esc(t('Not open for matching yet', '暂未开放服务匹配'))}</h2><p>${esc(t('This is a future category. Tasks, provider requirements, coverage and launch dates have not been confirmed. Courses on CareDoer do not mean this service is available on CareDoDo.', '这是后续服务分类。任务、人员条件、开放地区与启用日期均待确认。CareDoer 有相关课程，不代表 CareDoDo 已可提供此项服务。'))}</p></div>` : `<div class="detail-grid"><article class="content-panel"><p class="eyebrow">${esc(t('What a visit can include', '典型服务任务'))}</p><h2>${esc(t('Practical, agreed tasks.', '先约定具体任务。'))}</h2>${list(local(service.tasks))}<h3>${esc(t('Who this is for', '适合哪些家庭'))}</h3><p>${esc(local(service.audience))}</p></article><article class="content-panel"><p class="eyebrow">${esc(t('Before matching', '匹配前确认'))}</p><h2>${esc(t('Details that matter.', '需要沟通的细节。'))}</h2>${list(local(service.confirm))}<h3>${esc(t('Frequency & duration', '频次与时长'))}</h3><p>${esc(local(service.frequency))}</p></article></div><aside class="boundary"><h2>${esc(t('Service boundary', '服务边界'))}</h2><p>${esc(local(service.boundary))}</p></aside>`;
    const localFaq = [
      [t(`Is ${name.toLowerCase()} available in ${place}?`, `${place}可以预约${name}吗？`), coming ? t('This category is coming soon. You can only try an interest form; there is no live matching.', '本分类即将开放，目前只能体验意向登记，没有真实匹配。') : t(`This ${city ? 'city' : 'Bay Area and Los Angeles'} page demonstrates the service only. ${zip ? `The example status is “${local(data.availability[status(zip, service)])}”. ` : ''}Actual ZIP coverage, staff and times require operational confirmation.`, `本${city ? '城市' : '湾区与洛杉矶'}页面仅演示服务。${zip ? `示例状态为“${local(data.availability[status(zip, service)])}”。` : ''}实际邮编范围、人手和时段需由运营确认。`)],
      [t(`What does ${name.toLowerCase()} include?`, `${name}包含哪些内容？`), `${local(service.summary)} ${coming ? t('The final service scope is still to be confirmed.', '具体服务范围仍待确认。') : local(service.boundary)}`],
      [t(`How much does ${name.toLowerCase()} cost in ${place}?`, `${place}${name}费用是多少？`), t('Price and minimum duration are to be confirmed. This preview offers consultation or interest registration only, with no payment.', '价格与最低时长待定。本预览仅演示咨询或意向登记，不提供付款。')],
      [t('What happens after a request?', '提出需求后如何安排？'), t('In the planned process, operations reviews the tasks, checks permissions, proposes a person and asks both parties to confirm. Nothing is sent from this preview.', '按规划，运营确认任务并核对权限后推荐人选，由双方确认。本预览不会发送需求。')]
    ];
    return `<section class="section shell service-detail"><nav class="breadcrumbs" aria-label="${t('Breadcrumb', '面包屑导航')}">${link('', esc(t('Home', '首页')))}<span aria-hidden="true">›</span>${link(city ? `cities/${city.id}` : 'services', esc(city ? cityName(city) : t('Services', '服务')))}<span aria-hidden="true">›</span><span>${esc(name)}</span></nav>${heading(service.product || t('Future category', '后续分类'),
        city ? title : name, local(service.summary))}${cityInfo}${core}<div class="booking-strip"><div><b>${esc(price())}</b><p class="small">${esc(coming ? t('Future category · No live booking', '后续服务 · 暂不提供预约') : t('Task, time, person and terms must be confirmed before a visit.', '上门前需确认任务、时间、人选与条款。'))}</p></div>${button('request', coming ? t('Register interest', '登记意向') : t('Request a consultation', '预约咨询'), values)}</div>${city ? `<div class="section-tail">${link(`cities/${city.id}`, esc(t(`All support in ${cityName(city)}`, `查看${cityName(city)}全部服务`)) + ' →', 'text-link')}</div>` : `<div class="section-heading"><h2>${esc(t('Explore by city', '按城市了解服务'))}</h2><p class="small">${esc(t('City pages are coverage examples, not a service launch announcement.', '城市页面仅展示区域示例，不代表服务已经开放。'))}</p></div><div class="city-chips">${data.cities.map(c => link(`cities/${c.id}/${service.id}`, esc(cityName(c)), 'city-chip')).join('')}</div>`}</section>${faq(localFaq)}`;
  }

  function citiesPage() {
    meta(t('Service cities & ZIP code lookup', '服务城市与邮编查询'), t(`Explore ${data.cities.length} sample cities, including Bay Area and Los Angeles launch plans. ZIP codes and service availability are illustrative.`, `浏览 ${data.cities.length} 个样例城市，包括湾区与洛杉矶首发规划区。邮编及服务状态仅为示例。`));
    return `<section class="section shell">${heading(t('Places & people', '城市与家庭'), t('Start with your neighborhood.', '从您所在的地区开始。'), t('Bay Area (Silicon Valley) and Los Angeles are planned in parallel. Other cities illustrate later expansion, subject to local readiness.', '湾区（硅谷）与洛杉矶并列为首发规划区。其他城市展示后续扩展结构，按本地运营条件逐步推进。'))}${coverageNote()}<div class="city-tools"><label class="field">${esc(t('Search city or sample ZIP', '搜索城市或示例邮编'))}<input type="search" id="city-search" name="citySearch" placeholder="${t('City name or ZIP code', '城市名称或邮编')}"></label><label class="field">${esc(t('Region', '地区'))}<select id="region-filter" name="region"><option value="all">${t('All sample cities', '全部样例城市')}</option>${data.regions.map(r => `<option value="${r.id}">${esc(local(r.name))}</option>`).join('')}</select></label><output id="city-count" aria-live="polite"></output></div><div class="city-grid" id="city-grid">${data.cities.map(c => `<article class="city-card" data-city="${c.id}"><p class="eyebrow">${c.state} · ${esc(data.regions.find(r => r.id === c.region)?.launch ? t('Planned launch area', '首发规划区') : t('Future coverage example', '后续区域示例'))}</p><h2>${link(`cities/${c.id}`, esc(cityName(c)))}</h2><p class="small">${esc(t('Sample ZIPs: ', '示例邮编：') + c.zips.join(', '))}</p>${link(`cities/${c.id}`, esc(t('Explore local services', '查看本地服务')) + ' →', 'text-link')}</article>`).join('')}</div><p id="city-empty" class="empty-state" hidden>${esc(t('No sample city found. Try another name or register interest for your ZIP code.', '未找到样例城市。可更换名称，或为您的邮编登记服务意向。'))} ${link('request', esc(t('Register interest', '登记意向')), 'text-link')}</p><div class="content-panel section-note"><h2>${esc(t('Have a different ZIP code?', '不在样例城市中？'))}</h2>${zipForm()}</div></section>${faq([[t('Does a listed city mean service is open?', '列出的城市都已开放服务吗？'), t('No. All listed coverage is illustrative. Matching is configured by ZIP code and service, and still requires staff and time confirmation.', '不是。所有区域均为示例，匹配需按邮编和服务配置，并确认实际人员与时段。')], [t('What if my ZIP code is not listed?', '我的邮编没有列出怎么办？'), t('You can try an interest registration. An unlisted ZIP code is not evidence that the entire city is unavailable.', '可以体验意向登记。邮编未列出不代表整个城市都无法提供服务。')]])}`;
  }

  function cityPage(city) {
    meta(t(`Home support in ${cityName(city)}`, `${cityName(city)}居家生活支持`), t(`Explore companionship, daily living assistance and light housekeeping in ${cityName(city)}. Example ZIPs: ${city.zips.join(', ')}. Availability and prices need confirmation.`, `了解${cityName(city)}的老人陪伴、生活协助和适老化轻家务。示例邮编：${city.zips.join('、')}。可用情况与价格待确认。`));
    return `<section class="section shell"><nav class="breadcrumbs" aria-label="${t('Breadcrumb', '面包屑导航')}">${link('cities', esc(t('Service cities', '服务城市')))}<span aria-hidden="true">›</span><span>${esc(cityName(city))}</span></nav>${heading(t(`Local support · ${city.state}`, `本地服务 · ${city.state}`), t(`Everyday support in ${cityName(city)}.`, `${cityName(city)}的日常生活支持。`), t('Choose a service to see tasks, boundaries and the next step for your family.', '选择服务，了解典型任务、服务边界与家庭的下一步。'))}${coverageNote()}<p class="small section-note">${esc(t('Sample ZIP codes: ', '示例邮编：') + city.zips.join(', '))}</p>${servicesGrid(active(), city)}<div class="booking-strip"><p>${esc(price())}</p>${button('request', t('Discuss your needs', '咨询家庭需求'), { zip: selectedZip(city) })}</div></section>${faq([[t(`Can I request support in ${cityName(city)}?`, `可以在${cityName(city)}提出需求吗？`), t('This city has sample service statuses only. A real request needs the exact ZIP code, task, staffing and time to be confirmed.', '本城市仅展示示例服务状态。真实需求需按具体邮编、任务、人手和时间确认。')], ...commonFaq().slice(1, 3)])}`;
  }

  function areasPage() {
    const zip = params.get('zip') || '';
    if (!/^[0-9]{5}$/.test(zip)) return notFound();
    const city = cityForZip(zip);
    meta(t(`Home support near ZIP ${zip}`, `邮编 ${zip} 的居家支持`), t(`Explore example service options for ZIP ${zip}${city ? ` in ${cityName(city)}` : ''}. All matching and availability require confirmation.`, `查看邮编 ${zip}${city ? `（${cityName(city)}）` : ''}的服务示例。匹配与实际可用情况均需确认。`));
    return `<section class="section shell area-results">${heading(t('ZIP code lookup', '邮编查询'), city ? `${zip} · ${cityName(city)}` : t(`Let us know about ${zip}.`, `为邮编 ${zip} 登记需求。`), city ? t('Compare the sample status for each service. These are not live availability results.', '比较各项服务的示例状态，以下并非实时可用结果。') : t('This ZIP code is not in the sample list. You can try registering interest while local service conditions are assessed.', '该邮编不在样例列表中。您可以体验意向登记，实际服务条件需进一步评估。'), false)}${coverageNote()}${city ? servicesGrid(active(), city) : `<div class="content-panel"><h2>${esc(t('Interest registration', '服务意向登记'))}</h2><p>${esc(t('No service availability has been confirmed for this ZIP code in the preview.', '预览尚未确认该邮编的任何服务可用情况。'))}</p>${button('request', t('Register interest for this ZIP', '为此邮编登记意向'), { zip })}</div>`}<div class="content-panel section-note"><h2>${esc(t('Check another ZIP code', '查询其他邮编'))}</h2>${zipForm(zip)}</div></section>${faq([[t(`Is a visit confirmed for ${zip}?`, `邮编 ${zip} 已确认可上门吗？`), t('No. These are sample results. Even a “May request matching” status requires operations to confirm scope, available people and timing.', '没有。此处为示例结果，即使显示“可申请匹配”，仍需运营确认范围、可用人手和时间。')], ...commonFaq().slice(0, 1)])}`;
  }

  function howPage() {
    meta(t('How matching & visits work', '匹配与上门服务如何运作'), t('From a ZIP code and family needs to human-reviewed matching, mutual confirmation, visits and feedback. Understand the CareDoDo pilot process.', '从邮编、家庭需求到人工审核匹配、双方确认、上门与反馈，了解 CareDoDo 试点流程。'));
    return `<section class="section shell">${heading(t('How it works', '如何运作'), t('From a request to a shared plan.', '从提出需求，到共同确认安排。'), t('Pilot matching is confirmed by people. A submitted request is the start of a conversation.', '试点采用人工确认匹配。提出需求，是开始沟通的第一步。'))}${processGrid()}<div class="process-line">${esc(t('ZIP code → Service → Request → Operations review → Suggested match → Mutual confirmation → Visit → Feedback or rebooking', '输入邮编 → 选择服务 → 提交需求 → 运营确认任务 → 推荐人选 → 双方确认 → 上门服务 → 反馈或再次预约'))}</div><div class="detail-grid"><article class="content-panel"><h2>${esc(t('Before the visit', '上门之前'))}</h2><p>${esc(t('Operations checks the service entity, region, task permissions, qualifications, language, schedule and travel radius. Families review tasks, estimated duration, total cost and cancellation terms. The CareDoer also accepts the arrangement.', '运营核对服务主体、地区、任务权限、资格有效期、语言、时段与交通半径。家庭确认任务、预计时长、总费用和取消条款，CareDoer 同时确认接受安排。'))}</p></article><article class="content-panel"><h2>${esc(t('After the visit', '服务之后'))}</h2><p>${esc(t('The CareDoer records arrival and handoff. Families see the authorized summary and can request another visit, make suggestions, complain or commend specific service. If staffing changes, operations proposes a waitlist, reschedule or replacement for family confirmation.', 'CareDoer 提交到访与交接记录。家庭查看获准共享的摘要，可再次预约、提出建议、投诉或表彰。人员缺位时，运营提出候补、改期或改派方案，由家庭确认。'))}</p></article></div></section>${faq(commonFaq())}${cta()}`;
  }

  function plansPage() {
    meta(t('Basic, Plus & Family service plans', 'Basic、Plus、Family 家庭服务计划'), t('Compare occasional, recurring and ongoing family support. Plan prices, minimum duration and cancellation rules are awaiting confirmation.', '比较按需预约、固定频次与持续服务场景。计划价格、最低时长及取消规则尚待确认。'));
    return `<section class="section shell plans-page">${heading(t('Family service plans', '家庭服务计划'), t('A plan around your family’s routine.', '围绕家庭日常安排的服务计划。'), t('These are proposed use cases for Basic, Plus and Family. Details are discussed before any arrangement is confirmed.', '以下为 Basic、Plus、Family 的建议使用场景，具体安排需先沟通确认。'))}${plansGrid()}<aside class="boundary"><h2>${esc(t('Details still to be confirmed', '待确认的计划细则'))}</h2><p>${esc(t('Prices, minimum duration, plan entitlements, cancellation and refund rules will be published after confirmation. A regular CareDoer is a priority matching preference; specific people and times depend on operations confirmation.', '价格、最低时长、计划权益、取消与退款规则确认后发布。固定 CareDoer 是优先匹配安排，具体人选和时段以运营确认为准。'))}</p></aside></section>${faq([[t('Can I keep the same CareDoer?', '可以固定同一位 CareDoer 吗？'), t('Ongoing service prioritizes a consistent person, subject to future availability and confirmation. Operations discusses any changes with the family.', '持续服务优先安排固定人选，仍需确认未来可用时间；发生变更时由运营与家庭沟通。')], ...commonFaq().slice(2)])}`;
  }

  function safetyPage() {
    meta(t('Trust, safety & service quality', '信任、安全与服务品质'), t('Learn what must be checked before matching, how family access works, and the planned handling of feedback, complaints and safety incidents.', '了解匹配前需核验的内容、家属访问权限，以及建议、投诉、安全事件与表彰的规划处理流程。'));
    const points = [
      [t('Who provides the service?', '谁是实际服务主体？'), t('The actual service entity, applicable permissions or cooperation basis, staffing arrangements, insurance and family terms must be confirmed before a paid pilot. They are not yet specified in the V1.3 documents.', '付费试点前需明确实际服务主体、适用许可或合作依据、人员用工安排、保险与家庭条款。V1.3 文档尚未提供这些具体信息。')],
      [t('What is checked before matching?', '匹配前核验哪些内容？'), t('The planned checks include task permissions, service region, qualification validity and agreement status. The exact background-check scope and provider-specific evidence still need confirmation; this preview makes no claim that any person has passed checks.', '按规划核对任务权限、服务地区、资格有效期与协议状态。背景核验的具体范围及服务主体证明仍需确认，本预览不声称任何人员已通过核验。')],
      [t('What happens if permission expires?', '资格到期或权限暂停怎么办？'), t('New matching stops when qualifications expire or permissions are paused. Operations reviews existing arrangements. Matching and confirmation both recheck relevant permissions.', '资格到期或权限暂停时停止新匹配，已有预约交运营复核。推荐和确认预约时均需复核相关权限。')],
      [t('Who can see family information?', '谁能查看家庭信息？'), t('Access follows roles and family authorization. Detailed addresses, entry instructions and authorized contacts are completed at confirmation. Identity documents and background-check material stay in controlled review systems.', '访问按角色和家属授权开放。详细地址、进门指引与授权联系人在确认阶段补齐。身份证件与背景核验资料保留在受控审核后台。')]
    ];
    return `<section class="section shell safety-page">${heading(t('Trust & safety', '信任与安全'), t('Clear responsibilities. Thoughtful care.', '明确责任，认真对待每次服务。'), t('The pilot is non-medical. Service scope, permissions and a clear route to help are part of confirming every visit.', '首期服务为非医疗支持。服务范围、人员权限与问题处理入口都是确认安排的一部分。'))}<div class="detail-grid">${points.map(([title, copy]) => `<article class="content-panel"><h2>${esc(title)}</h2><p>${esc(copy)}</p></article>`).join('')}</div><div class="section-heading future-heading"><h2>${esc(t('Feedback with a next step.', '反馈之后，有明确的下一步。'))}</h2><p class="muted">${esc(t('Planned official workflow; case submission and progress tracking are not connected in this preview.', '以下为规划中的官方流程；本预览尚未接通工单提交和进度查询。'))}</p></div><div class="feedback-list">${[[t('Suggestions & reviews', '评价与建议'), t('Linked to the order; customer support decides whether to reply or assign improvement work.', '关联订单，由客服判断是否回应或建立改进任务。')], [t('Complaints', '投诉'), t('A restricted case, a named owner, both parties’ accounts, a handling deadline, a conclusion and review.', '建立受限工单，指定负责人，核对双方说明，记录处理期限、结论与复核结果。')], [t('Safety incidents', '安全事件'), t('A dedicated reporting and escalation process, with operations reviewing future visits and permissions when necessary.', '进入专用上报与升级流程，必要时由运营复核后续预约与派单权限。')], [t('Commendations', '客户表彰'), t('Specific actions are verified and shared only as authorized. With permission, examples can inform recognition and learning on CareDoer.', '核实具体服务行为，并按授权范围共享。取得授权后，可进入 CareDoer 表彰与案例学习。')]].map(([title, copy]) => `<article><h3>${esc(title)}</h3><p>${esc(copy)}</p></article>`).join('')}</div><aside class="emergency"><h2>${esc(t('Immediate danger or a medical emergency?', '遇到即时危险或医疗紧急情况？'))}</h2><p>${esc(t('In the US, call 911. This preview form is not monitored and cannot handle emergencies. The official service incident channel and support hours are still to be confirmed.', '在美国请拨打 911。本预览表单无人监控，无法处理紧急情况。正式服务的事件上报渠道及客服时段仍待确认。'))}</p></aside><div class="section-tail">${link('contact', esc(t('Contact & feedback preview', '联系与反馈演示')) + ' →', 'text-link')}${link('privacy', esc(t('Privacy & family authorization', '隐私与家属授权')) + ' →', 'text-link')}</div></section>${faq([[t('Is training the same as permission to serve?', '完成培训就能接单吗？'), t('No. Course completion, internal skills certificates, applicable government qualifications and platform task permissions are separate. Matching requires the relevant review and authorization.', '不是。课程结业、内部技能证书、适用政府资格与平台任务权限分别核验。匹配前需完成相关审核与授权。')], ...commonFaq().slice(1, 3)])}`;
  }

  function platformSection() {
    const pillars = [
      [t('A path to W-2 employment', '可成为 W-2 正式员工'), t('The plan includes employment within CareDoDo and a route into supervision. The employing entity and W-2 or 1099 arrangements are awaiting confirmation.', '规划包含在 CareDoDo 任职及走向督导的机会；雇用主体、W-2 或 1099 具体安排待确认。')],
      [t('Career advancement', '职业进阶'), t('Connect required CPR, role learning, service feedback and ongoing development, with skills and management paths.', '把必修 CPR、岗位学习、服务反馈与持续成长衔接起来，提供技能及管理发展方向。')],
      [t('Community management', '社区化管理'), t('Organize locally with a designated coordinator, peer learning and mentors. Family demand and CareDoer preparation develop together.', '按社区组织，规划专人协调、同伴学习与导师支持，家庭需求和康都人培养同步推进。')],
      [t('AI assistance', 'AI 辅助'), t('Planned assistance with learning plans, organizing needs and scheduling suggestions. People review qualifications, service permissions and safety decisions.', '规划辅助学习方案、需求整理及排程建议；资格、服务权限与安全事项由指定人员审核。')]
    ];
    return `<section class="section white-section"><div class="shell">${sectionHead('CareDoDo × CareDoer', t('Care that grows with its people.', '让家庭支持与职业成长相互促进。'), local(data.positioning))}<figure class="care-loop"><figcaption>${esc(t('A connected learning and service cycle · Planned', '学习与服务闭环 · 规划中'))}</figcaption><div class="loop-flow"><div><h3>${esc(t('Families', '家庭端'))}</h3><p>${esc(t('Needs · Visits · Feedback · Rebooking', '提出需求 · 获得服务 · 反馈 · 复购'))}</p>${link('request', esc(t('Explore home support', '了解家庭服务')), 'text-link')}</div><span class="loop-arrow" aria-hidden="true">↔</span><div class="loop-platform"><h3>CareDoDo</h3><p>${esc(t('Local coordination · Human review · AI assistance planned', '社区协调 · 人工审核 · AI 辅助规划'))}</p></div><span class="loop-arrow" aria-hidden="true">↔</span><div><h3>${esc(t('CareDoers', '康都人'))}</h3><p>${esc(t('Assessment · Learning · Checks · Service · Advancement', '评测 · 学习 · 核验 · 上岗 · 进阶'))}</p>${link('join', esc(t('Explore a career', '了解职业路径')), 'text-link')}</div></div><p class="small">${esc(t('Start with existing CPR learners → prepare role skills on CareDoer → qualify and serve on CareDoDo → use feedback for further learning and repeat service.', '从现有 CPR 学员出发 → 在 CareDoer 学习岗位技能 → 核验后到 CareDoDo 上岗服务 → 反馈回到持续学习与家庭复购。'))}</p></figure><p class="section-note muted">${esc(t('Papa and Home Instead are reference models discussed by the team. CareDoDo’s intended distinction is the combination below: employment opportunities, advancement, community organization and AI assistance. These are our plans; no claims about competitors’ employment or service practices are made here.', '团队以 Papa、Home Instead 为参考。CareDoDo 计划以正式员工机会、职业进阶、社区化组织与 AI 辅助的组合形成自身特色。以下描述本平台规划，竞品具体用工与服务方式不在此作判断。'))}</p><div class="detail-grid section-note">${pillars.map(([title, copy]) => `<article class="content-panel"><h3>${esc(title)}</h3><p>${esc(copy)}</p></article>`).join('')}</div><div class="section-tail">${button('join/assessment', t('Find my career direction', '评测我的职业方向'))}${link('community', esc(t('Community & career advancement', '康都人社区与职业进阶')) + ' →', 'text-link')}</div></div></section>`;
  }

  function careerFaq() {
    return [[t('Does this assessment qualify me to work?', '评测结果代表可以上岗吗？'), t('No. This is a preference-based exploration demo, not a validated aptitude test, practical assessment or employment decision. Qualifications, contracts and task permissions require separate review.', '不代表。这是按偏好生成建议的探索演示，不是经过验证的职业能力测验、实操考核或录用决定。资格、签约与任务权限需另行审核。')], [t('Does a certificate guarantee work?', '获得证书是否保证接单？'), t('No. Courses, internal skills certificates, government qualifications and platform permissions are separate. Work depends on approved local services, family demand and scheduling.', '不保证。课程、内部能力证书、政府资格与平台权限分别核验；工作取决于本地服务获准范围、家庭需求与排班。')]];
  }

  function joinPage() {
    meta(t('Become a CareDoer · Explore your path', '成为康都人 · 探索职业路径'), t('Try a local career assessment, explore recommended roles and required CPR learning, then review qualifications and the CareDoer course preview.', '本地职业自评、岗位建议、必修 CPR 学习及资格核验说明，衔接 CareDoer 课程辅站。'));
    return `<section class="section shell">${heading('CareDoDo × CareDoer', t('Start learning. Build a career in your community.', '从学习开始，在社区建立职业路径。'), t('Already a CPR learner, or new to care? Explore a direction, prepare role skills and understand the checks before serving families.', '无论已是 CPR 学员，还是初次了解照护，都可以先探索方向、学习岗位技能，再了解服务家庭前的核验要求。'))}<div class="detail-grid"><article class="content-panel"><p class="eyebrow">${esc(t('Career exploration', '职业探索'))}</p><h2>${esc(t('What could suit your interests?', '哪些工作适合你的兴趣？'))}</h2><p>${esc(t('Answer 10 questions about interests, experience and readiness. Recommendations are calculated in this page. No contact details, external submission or saved profile.', '回答 10 道兴趣、经验与准备情况问题，在本页计算岗位和学习建议。不收集联系方式，不对外提交，不保存档案。'))}</p>${button('join/assessment', t('Start my self-assessment', '开始职业自评'))}</article><article class="content-panel"><p class="eyebrow">${esc(t('Learning to service', '从学习到服务'))}</p><h2>${esc(t('A clear route, with human review.', '路径清晰，每步经过核验。'))}</h2><p>${esc(t('Assessment → role suggestions → required CPR + role courses → applicable California HCO and HCA checks → review and signing → authorized dispatch.', '职业评测 → 推荐岗位 → CPR 必修与岗位课程 → 适用加州 HCO 与 HCA 核验 → 审核签约 → 获准外派。'))}</p>${link('join/requirements', esc(t('Understand qualification and work steps', '了解认证与上岗步骤')) + ' →', 'text-link')}<a class="text-link" href="${esc(data.careerSiteUrl)}">${esc(t('Browse CareDoer courses without assessment', '跳过自评，前往 CareDoer 浏览课程'))} ↗</a></article></div><div class="section-tail">${link('community', esc(t('Explore community & advancement', '了解社区与职业进阶')) + ' →', 'text-link')}<span class="small">${esc(t('Pay · Course prices · Platform fees: to be determined', '薪资 · 课程价格 · 平台抽成：待定'))}</span></div></section>${faq(careerFaq())}`;
  }

  function courseList(ids) {
    return `<ol class="learning-list">${ids.map((id, i) => { const course = data.careerCourses[id]; return `<li><span class="eyebrow">${esc(i === 0 ? t('Start with CPR', 'CPR 必修课程') : t('Role preparation', '岗位学习'))}</span><h3>${esc(local(course.name))}</h3><p>${esc(local(course.status))}</p></li>`; }).join('')}</ol>`;
  }

  function assessmentResult() {
    const result = window.CAREDODO_CAREER.evaluate(data, assessmentAnswers);
    if (!assessmentComplete || !result) return '';
    const top = result.ranked[0];
    return `<p class="eyebrow">${esc(t('Your exploration result', '你的职业探索建议'))}</p><h2>${esc(t('Start by exploring: ', '建议优先了解：') + local(top.role.name))}</h2><p>${esc(result.needsPreparation ? t('Begin with learning and a discussion of readiness before applying. Your answers suggest that training commitment, CPR or service boundaries need more preparation.', '建议先了解课程并沟通准备情况，再考虑申请。你的回答提示培训投入、CPR 或服务边界仍需进一步准备。') : t('You are open to training and human-reviewed service boundaries. These preferences can guide a learning conversation; they do not establish work readiness.', '你愿意接受培训并按人工核准的范围服务，可据此进一步沟通学习方案；这些偏好不代表已经具备上岗能力。'))}</p><div class="service-grid section-note">${result.ranked.map(({ role, reasons }, i) => `<article class="service-card"><p class="eyebrow">${esc(i === 0 ? t('Explore first', '优先探索') : t('Also compare', '同时比较'))}</p><h3>${esc(local(role.name))}</h3><p>${esc(local(role.description))}</p><h4>${esc(t('Why this direction', '建议依据'))}</h4>${reasons.length ? list(reasons.map(({ option }) => local(option.label))) : `<p>${esc(t('An alternative to compare; no direct preference was selected for this role.', '可作为比较方向；本次没有选择直接支持该岗位的偏好。'))}</p>`}</article>`).join('')}</div><div class="content-panel section-note"><h3>${esc(t('Your learning path', '你的学习路径'))}</h3><p>${esc(result.verifyCpr ? t('CPR remains required. Ask the training team to verify the scope and validity of your existing credential; do not assume a waiver.', 'CPR 仍为必修项。请由培训方核验已有凭证的范围及有效期，不自动视为免修。') : t('Start with required CPR learning, then add the recommended role preparation below.', '先完成必修 CPR 学习，再准备下列岗位课程。'))}</p>${courseList(['adult', ...top.role.courses])}${result.cna ? `<aside class="boundary"><h3>${esc(t('Optional longer path: CNA', '可进一步了解：CNA 路径'))}</h3><p>${esc(t('Your interest in further study makes NA career preparation and an approved CNA program worth exploring. Higher education alone does not establish entry eligibility or CNA qualification. Confirm admission, practical training and certification with the authorized program; clinical work is outside the initial CareDoDo service scope.', '你对继续学习有兴趣，可了解 NA 职业预备课与获批 CNA 项目衔接。高等教育经历本身不等于入学资格或 CNA 资格；入学、实操及认证要求由获批项目核验。临床工作不属于 CareDoDo 首期服务范围。'))}</p><p class="small">${esc(local(data.careerCourses.na.name))} · ${esc(local(data.careerCourses.na.status))}</p></aside>` : ''}<p class="small">${esc(t('These are course planning snapshots from the supplied documents. Confirm availability with the course provider. Course prices, pay and platform fees: to be determined.', '课程状态取自所提供文档，仅为规划快照；实际开课以教学方确认为准。课程价格、薪资与平台抽成：待定。'))}</p><div class="section-tail">${button('join/requirements', t('Next: qualifications & work steps', '下一步：认证与上岗'))}<a class="button button-outline" href="${esc(data.careerSiteUrl)}">${esc(t('CareDoer course & registration preview', '前往 CareDoer 课程与报名预览'))} ↗</a></div><p class="small section-note">${esc(t('The separate CareDoer preview has its own demo registration flow. Answers are not passed to it. HS, HCA and NA courses are planning directions and are not all listed there.', '独立 CareDoer 辅站提供自己的演示报名流程，本次答案不会传过去。HS、HCA 和 NA 为规划方向，辅站尚未全部上架。'))}</p></div>`;
  }

  function assessmentPage() {
    meta(t('Local CareDoer career assessment', '康都人本地职业自评'), t('Ten questions produce local role recommendations and a CPR-first learning plan. No external submission or persistent storage.', '10 道问题在本地生成岗位建议与 CPR 必修学习路径，不外部提交或持久保存。'));
    return `<section class="section shell assessment-page">${heading(t('Career exploration', '职业探索'), t('Find a direction to explore.', '找到值得了解的职业方向。'), t('Ten questions about your interests and preparation, not a hiring or validated aptitude test. Answers stay in memory and clear when you leave or reload.', '用 10 题了解兴趣和准备情况，不是录用判断或经过验证的能力测验。答案仅暂存在内存，离开或刷新即清除。'), false)}<form id="assessment-form" class="assessment-form" aria-describedby="assessment-progress" novalidate><div class="assessment-meta"><output id="assessment-progress" aria-live="polite"></output><span id="assessment-step-label"></span></div><div id="assessment-meter" class="assessment-track" role="progressbar" aria-label="${t('Questions answered', '已答题数')}" aria-valuemin="0" aria-valuemax="10" aria-valuenow="0"><div id="assessment-fill"></div></div><p id="assessment-error" class="assessment-error" role="alert" hidden></p><div class="assessment-questions">${data.assessmentQuestions.map((q, i) => `<fieldset id="assessment-question-${i}" class="assessment-question" tabindex="-1" ${i === assessmentStep ? '' : 'hidden'}><legend><span class="question-number">${t('Question', '问题')} ${String(i + 1).padStart(2, '0')}</span>${esc(local(q.prompt))}</legend>${q.options.map(o => `<label class="assessment-option"><input type="radio" name="${q.id}" value="${o.id}" required ${assessmentAnswers[q.id] === o.id ? 'checked' : ''}><span>${esc(local(o.label))}</span></label>`).join('')}</fieldset>`).join('')}</div><div class="assessment-controls"><button id="assessment-back" class="button button-outline" type="button">← ${esc(t('Previous', '上一题'))}</button><button id="assessment-next" class="button button-primary" type="button">${esc(t('Next question', '下一题'))} →</button><button id="assessment-submit" class="button button-primary" type="submit">${esc(t('See roles & learning path', '查看岗位与学习路径'))} →</button><button class="assessment-reset text-link" type="reset">${esc(t('Clear & restart', '清空重测'))}</button></div></form><section id="assessment-result" class="assessment-result section-note" tabindex="-1" aria-label="${t('Assessment suggestions', '职业自评建议')}" ${assessmentComplete ? '' : 'hidden'}>${assessmentResult()}</section></section>${faq(careerFaq())}`;
  }

  function requirementsPage() {
    meta(t('CareDoer qualification & work steps', '康都人认证与上岗步骤'), t('Understand learning, separate HCO and HCA checks, review, employment planning and authorized service matching.', '了解学习、分别核验 HCO 与 HCA、审核签约、用工规划和获准服务匹配。'));
    return `<section class="section shell">${heading(t('Learning → Verification → Service', '学习 → 核验 → 服务'), t('Prepare for each step before serving.', '逐步准备，通过核验后再服务。'), t('This explains the process in the supplied documents. Formal requirements depend on the operating entity, employment model, region and task; the final operating process is awaiting confirmation.', '以下按所提供文档解释流程。正式要求取决于经营主体、用工模式、地区及具体任务；最终运营口径待确认。'))}<ol class="career-steps">${data.careerSteps.map((s, i) => `<li><span class="step-number">0${i + 1}</span><div><h2>${esc(local(s.name))}</h2><p>${esc(local(s.description))}</p></div></li>`).join('')}</ol><div class="content-panel section-note"><h2>${esc(t('Continue on CareDoer', '前往 CareDoer 继续了解'))}</h2><p>${esc(t('Use the course cards for existing CPR courses or the EC-L1 preparation status. This opens a separate static preview with demo registration; no answers, account or authorization are transferred.', '通过课程卡查看现有 CPR 课程或 EC-L1 备课状态。链接打开独立静态辅站与演示报名流程，不传递问卷答案、账号或服务授权。'))}</p><a class="button button-primary" href="${esc(data.careerSiteUrl)}">${esc(t('Open courses & registration preview', '打开课程与报名预览'))} ↗</a></div><div class="section-tail">${link('join/assessment', esc(t('Return to self-assessment', '返回职业自评')), 'text-link')}${link('community', esc(t('See community & advancement', '了解社区与晋阶')), 'text-link')}</div></section>${faq(careerFaq())}`;
  }

  function communityPage() {
    meta(t('CareDoer community & career advancement', '康都人社区与职业进阶'), t('Explore a planned path from learner to certified CareDoer, senior practitioner and community lead, supported by peer learning and local management.', '了解学员、认证康都人、资深及社区组长与站长的规划路径，同伴互助与社区管理。'));
    return `<section class="section shell">${heading(t('CareDoer community', '康都人社区'), t('Learn together. Grow within your community.', '相互帮助，相互学习，在社区持续成长。'), t('A local community with designated coordination, peer questions, mentors and learning groups. These pages explain the plan; member discussions and applications are not connected.', '按社区组织，规划专人协调、同伴问答、导师与学习小组。本页介绍规划，尚未接通成员讨论与申请。'))}<ol class="career-ladder">${data.careerLadder.map((step, i) => `<li><span class="step-number">0${i + 1}</span><h2>${esc(local(step.name))}</h2><p>${esc(local(step.description))}</p></li>`).join('')}</ol><p class="notice section-note">${esc(t('Illustrative development stages, not automatic promotions. Internal skill levels (L1, L2 and L3), government qualifications, task permissions and management appointments are reviewed separately. Criteria, openings and pay are to be determined.', '以上为发展阶段示意，不自动晋升。内部技能等级（L1、L2、L3）、政府资格、任务权限与管理任职分别审核。评审条件、岗位空缺与薪资待定。'))}</p><div class="detail-grid section-note">${[
      [t('Peer learning & mentors', '同伴学习与导师'), t('Ask role questions, read reviewed answers, join learning groups and prepare practical assessments with mentors. Recognized contributions can inform development reviews.', '围绕岗位提问、查看审核答案、组建学习小组，并在导师支持下准备实操。经核实的贡献可作为成长评审参考。')],
      [t('Local coordination', '社区专人管理'), t('A designated local coordinator is planned to manage handoffs, staffing issues and learning needs. Operations reviews any replacement assignment and permissions.', '规划由社区专人协调交接、人员安排与学习需求。替班和任务权限须由运营重新核验安排。')],
      [t('Professional and management paths', '技能与管理两条路径'), t('Maintain credentials, build advanced skills and mentor others. Apply for supervisor, community lead or station manager roles as actual operations need them; W-2 opportunities remain subject to the confirmed employment model.', '维持资格、提升专业技能并参与带教；按实际业务需求申请督导、社区组长或站长岗位。W-2 任职机会以最终用工方案为准。')],
      [t('Feedback becomes learning', '服务反馈回到学习'), t('Reviewed family feedback informs retraining and improvement. De-identify learning cases; orders, complaints and safety incidents go to official operations channels.', '经核实的家庭反馈用于复训与改进；学习案例应去标识化。订单、投诉与安全事件由官方运营渠道处理。')]
    ].map(([title, copy]) => `<article class="content-panel"><h2>${esc(title)}</h2><p>${esc(copy)}</p></article>`).join('')}</div><div class="section-tail">${button('join/assessment', t('Start with a career self-assessment', '从职业自评开始'))}${link('join/requirements', esc(t('Review work-entry steps', '查看上岗步骤')), 'text-link')}</div></section>${faq([[t('Is the community open now?', '现在可以参加社区吗？'), t('This is a public planning page. Questions, mentor matching, membership and promotion applications are not active in the preview.', '这是公开规划页，预览尚未开放提问、导师匹配、成员账号或晋阶申请。')], ...careerFaq().slice(1)])}`;
  }

  function aboutPage() {
    meta(t('About CareDoDo · Careers, AI & community', '关于 CareDoDo · 职业、AI 与社区'), local(data.positioning));
    return `<section class="section shell">${heading(t('About CareDoDo', '关于康都都'), t('Home support, built around people’s growth.', '以人的成长，支持家庭的日常。'), local(data.positioning))}<div class="detail-grid"><article class="content-panel"><h2>${esc(t('Two sides, developing together', '家庭与康都人同步推进'))}</h2><p>${esc(t('CareDoer develops learners into role-ready candidates; CareDoDo coordinates approved family services. Existing CPR learners are the starting community. Further learning and family rebooking support a continuing service cycle; work and revenue are not guaranteed.', 'CareDoer 培养具备岗位准备的学员，CareDoDo 协调获准家庭服务。以现有 CPR 学员为起点，通过持续学习和家庭复购形成业务闭环；不承诺就业或收益。'))}</p></article><article class="content-panel"><h2>${esc(t('Start locally, expand in stages', '从首发区出发，逐步扩展'))}</h2><p>${esc(t('Bay Area (Silicon Valley) and Los Angeles are the planned launch areas. The long-term ambition is to reach US cities with populations above 5,000, subject to local readiness. The sample directory is not a nationwide service announcement.', '湾区（硅谷）与洛杉矶并列为首发规划区。长期目标是逐步覆盖美国人口超过 5,000 的城市，并按本地条件推进。样例目录不代表已提供全国服务。'))}</p></article></div></section>${platformSection()}${faq(commonFaq().slice(0, 3))}`;
  }

  function policyPage(kind) {
    const privacy = kind === 'privacy';
    const title = privacy ? t('Privacy & family authorization', '隐私与家属授权') : t('Pricing, cancellation & terms', '费用、取消与条款');
    meta(title, privacy ? t('Understand minimal initial information, later address collection and role-based family access. Preview requests are not sent or stored.', '了解初始信息最小化、确认阶段补齐地址及按角色授权的家属访问。本预览不发送或存储需求。') : t('CareDoDo prices, minimum duration, cancellation and refund rules are to be confirmed. There are no payments or binding bookings in this preview.', 'CareDoDo 价格、最低时长、取消与退款规则待确认。本预览没有付款或具有约束力的预约。'));
    return `<section class="section shell narrow">${heading(t('Before an arrangement', '服务确认之前'), title, t('This is a preview explanation of the V1.3 plan. Final policies have not been published.', '此页说明 V1.3 中的规划安排，正式政策尚未发布。'))}<article class="content-panel">${privacy ? `<h2>${esc(t('Collect only what matching needs', '初期仅收集匹配所需信息'))}</h2><p>${esc(t('The planned initial request records ZIP code, tasks, timing, frequency, language and contact information. Detailed addresses and entry instructions are completed at confirmation, then shared only as needed by role.', '规划中的初始需求登记收集邮编、任务、时段、频次、语言与联系方式。详细地址及进门指引在确认阶段补齐，并按角色共享必要信息。'))}</p><h3>${esc(t('Family access requires authorization', '家属访问需要授权'))}</h3><p>${esc(t('The recipient, booking contact and family members allowed to see service records are separate roles. Submitting a form is not authorization to access records; identity, consent and access scope must be verified in the future account workflow.', '服务对象、预约联系人与获授权查看服务记录的家属是不同角色。提交表单不等于取得访问权限；身份、同意与授权范围需在后续账号流程中核验。'))}</p><h3>${esc(t('In this preview', '本预览中的信息'))}</h3><p>${esc(t('Use sample information. Forms do not send or persist your entries; there is no analytics or third-party form endpoint. Career self-assessment answers stay only in memory, including during language changes, and clear when you leave the assessment or reload. The homepage ZIP field can retain its value while switching languages. Other forms clear on page redraw. Final retention, deletion and privacy contact details remain to be confirmed.', '请使用示例资料。表单不发送或持久保存您的输入，没有统计脚本或外部表单接口。职业自评答案仅暂存内存，语言切换时保留，离开评测或刷新即清除；首页邮编在切换语言时保留，其他表单在页面重绘时清空。正式留存、删除规则及隐私联系人仍待确认。'))}</p>` : `<h2>${esc(price())}</h2><p>${esc(t('No hourly rate, subscription price or minimum visit duration has been confirmed. Basic, Plus and Family describe proposed usage patterns only.', '尚未确认小时单价、订阅价格或最低服务时长。Basic、Plus、Family 仅描述建议使用场景。'))}</p><h3>${esc(t('Before confirming any paid service', '确认付费服务之前'))}</h3><p>${esc(t('Families must see the actual service entity, tasks, estimated duration, total cost and cancellation terms. Payment, billing and refunds belong to a later implementation phase and require separate acceptance.', '家庭需先看到实际服务主体、任务、预计时长、总费用与取消条款。支付、账单和退款属于后续实施阶段，需另行验收。'))}</p><h3>${esc(t('Changes and cancellations', '改期与取消'))}</h3><p>${esc(t('Deadlines, charges, cancellation procedures and refund timeframes have not been published. Consult operations once official contact channels are confirmed. The preview cannot create, change or cancel a real appointment.', '改期与取消期限、费用、操作方式及退款时效尚未发布。正式渠道确认后需向运营咨询。本预览不能创建、更改或取消真实预约。'))}</p>`}</article></section>${faq(commonFaq().slice(2))}`;
  }

  function accountPage() {
    meta(t('Family & service workspaces · Planned', '家庭与服务工作台 · 规划中'), t('Account and workspace functions are planned for later phases. This preview does not create accounts, bookings, bills or service records.', '账号与工作台属于后续建设阶段。本预览不创建账号、预约、账单或服务记录。'));
    return `<section class="section shell">${heading(t('Workspaces · Planned', '工作台 · 规划中'), t('Your next steps, in one place.', '把下一步安排放在一起。'), t('Login and private records are not connected in this preview. You can explore the planned roles below or try the consultation form.', '本预览尚未接通登录与私有记录。以下展示规划中的角色职责，您也可以体验咨询表单。'))}<div class="detail-grid"><article class="content-panel"><h2>${esc(t('Family workspace', '家庭工作台'))}</h2>${list([t('Review and confirm appointments and changes', '查看并确认预约、改期与变更'), t('View authorized visit and handoff summaries', '查看获授权的到访与交接摘要'), t('Rebook, view bills, give feedback or complain', '再次预约、查看账单、评价或投诉')])}</article><article class="content-panel"><h2>${esc(t('CareDoer service workspace', 'CareDoer 服务工作台'))}</h2>${list([t('Accept arrangements within approved permissions', '在已获准权限内接受服务安排'), t('Read tasks, record visits and complete handoffs', '查看任务、记录到访并完成交接'), t('Report incidents through official channels', '通过官方渠道上报异常')])}${link('join', esc(t('Career-site entry', '职业辅站入口')) + ' →', 'text-link')}</article></div><div class="section-tail">${button('request', t('Try a consultation request', '体验咨询登记'))}</div></section>${faq([[t('Can I log in or see records now?', '现在可以登录或查看记录吗？'), t('No. Shared accounts and role-based access are planned for later phases. No private records are included in this preview.', '暂不可以。共用账号与角色权限属于后续阶段，本预览不包含任何私有记录。')]])}`;
  }

  function field(id, label, input, full = false) { return `<label class="field ${full ? 'full-width' : ''}" for="${id}">${esc(label)}${input}</label>`; }
  function requestPage(contact = false) {
    const chosen = serviceById(params.get('service'));
    const rawZip = params.get('zip') || '';
    const zip = /^[0-9]{5}$/.test(rawZip) ? rawZip : '';
    const plan = data.plans.find(p => p.id === params.get('plan'));
    const title = contact ? t('Contact & partnerships', '联系与机构合作') : t('Tell us what your family needs.', '告诉我们家庭需要哪些支持。');
    meta(title, contact ? t('Try a local contact, partnership or feedback form. Official support contacts and hours are pending; no messages are sent.', '体验联系、合作或反馈的本地表单。正式客服渠道与时段待确认，不会发送消息。') : t('Try a local CareDoDo consultation or interest form: tasks, ZIP code, timing, frequency, language and separate family roles. No request is sent.', '体验 CareDoDo 本地咨询与意向登记：任务、邮编、时段、频次、语言及不同家庭角色。不发送真实需求。'));
    const serviceOptions = data.services.filter(s => ['companion', 'assist', 'home'].includes(s.id)).map(s => `<option value="${s.id}" ${chosen?.id === s.id ? 'selected' : ''}>${esc(local(s.name))}${s.status === 'coming' ? ' — ' + t('Coming soon · Register interest', '即将开放，先登记意向') : ''}</option>`).join('');
    const contactFields = `${field('contact-name', t('Booking contact name', '预约联系人姓名'), '<input id="contact-name" name="contactName" autocomplete="off" maxlength="80" required>')}${field('contact-email', t('Contact email', '联系邮箱'), '<input id="contact-email" name="email" type="email" autocomplete="off" maxlength="160" placeholder="demo@example.com" required>')}`;
    const familyFields = `<fieldset class="full-width"><legend>${esc(t('Who is the support for?', '服务对象是谁？'))}</legend><div class="form-grid">${field('relationship', t('I am requesting for', '我为谁提出需求'), `<select id="relationship" name="relationship"><option value="self">${t('Myself', '自己')}</option><option value="parent">${t('A parent', '父母')}</option><option value="family">${t('Another family member', '其他家人')}</option><option value="authorized">${t('Someone I am authorized to assist', '获授权协助的对象')}</option></select>`)}${field('recipient', t('Service recipient name or nickname — optional', '服务对象姓名或称呼——选填'), '<input id="recipient" name="recipient" autocomplete="off" maxlength="80">')}</div></fieldset>`;
    const requestFields = `${familyFields}${field('service', t('Service', '服务项目'), `<select id="service" name="service" required><option value="">${t('Choose a service', '请选择服务')}</option>${serviceOptions}</select>`)}${field('request-zip', t('Service ZIP code', '服务地址邮编'), `<input id="request-zip" name="zip" type="text" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" value="${esc(zip)}" required aria-describedby="request-scope">`)}<p id="request-scope" class="small full-width"></p>${field('preferred-time', t('Preferred date and time', '首选日期和时段'), `<input id="preferred-time" name="preferredTime" maxlength="160" placeholder="${t('e.g. weekday afternoons; to be discussed', '例如：工作日下午，具体待沟通')}" required>`)}${field('frequency', t('Preferred frequency', '希望的服务频次'), `<select id="frequency" name="frequency"><option value="discuss">${t('Discuss with operations', '与运营沟通')}</option><option value="once">${t('Occasional visits', '按需单次')}</option><option value="regular">${t('Regular visits', '固定频次')}</option><option value="ongoing">${t('Ongoing support', '持续服务')}</option></select>`)}${field('preferred-language', t('Language preference', '语言偏好'), `<input id="preferred-language" name="language" maxlength="100" placeholder="${t('e.g. English, Mandarin or another language', '例如：英语、普通话或其他语言')}" required>`)}${field('plan', t('Plan to discuss', '希望咨询的计划'), `<select id="plan" name="plan"><option value="">${t('Not sure yet', '暂不确定')}</option>${data.plans.map(p => `<option value="${p.id}" ${plan?.id === p.id ? 'selected' : ''}>${p.name} — ${esc(local(p.title))}</option>`).join('')}</select>`)}${field('tasks', t('Tasks and preferences', '任务与偏好'), `<textarea id="tasks" name="tasks" rows="4" maxlength="1500" required placeholder="${t('Use an example task list. Do not include a street address, entry code, medical records or other sensitive information.', '请填写示例任务，不要输入详细地址、门禁密码、病历或其他敏感信息。')}"></textarea>`, true)}${contactFields}<fieldset class="full-width"><legend>${esc(t('Family access — optional future request', '家属访问——可选的后续授权需求'))}</legend><p class="small">${esc(t('Only a preference is recorded now. Do not provide an authorized contact’s details. Identity, consent and access will be verified in a later phase.', '当前仅记录咨询偏好，不收集授权联系人的资料。身份、同意及访问权限在后续阶段核验。'))}</p><label class="check"><input type="checkbox" id="family-access" name="familyAccess"><span>${esc(t('I would like to discuss authorized family access to service summaries.', '我希望咨询家属获授权查看服务摘要的安排。'))}</span></label></fieldset>`;
    const inquiryFields = `${field('inquiry-type', t('Inquiry type', '咨询类型'), `<select id="inquiry-type" name="type"><option value="general">${t('General question', '一般咨询')}</option><option value="partnership">${t('Organization or partnership', '机构合作')}</option><option value="suggestion">${t('Suggestions and feedback', '评价与建议')}</option><option value="complaint">${t('Complaint workflow demo', '投诉流程演示')}</option><option value="commendation">${t('Commendation', '客户表彰')}</option></select>`)}${field('organization', t('Organization — optional', '机构名称——选填'), '<input id="organization" name="organization" maxlength="120">')}${contactFields}${field('inquiry', t('Your message — sample information only', '留言——仅使用示例资料'), '<textarea id="inquiry" name="message" rows="5" maxlength="1500" required></textarea>', true)}`;
    return `<section class="section shell request-page">${heading(contact ? t('Contact and partnerships', '联系与机构合作') : t('Consultation', '需求登记'), title, contact ? t('Official support contacts, response times and partnership details are awaiting confirmation. This form demonstrates the intended entry point.', '正式客服联系方式、回复时效与合作安排待确认，此表单用于演示入口。') : t('Start with tasks, ZIP code and preferences. Detailed addresses and entry instructions belong to the later confirmation step.', '先说明任务、邮编与偏好。详细地址与进门指引在后续确认阶段补齐。'), false)}<div class="request-layout"><div class="content-panel"><p class="notice" id="form-demo-note">${esc(t('Static preview: use sample names and demo@example.com; nothing is sent or saved. In local integration mode, a notice above explains test storage. No visit or support case is created.', '静态预览：请使用示例姓名和 demo@example.com，信息不发送、不保存。本机联调时，上方会说明测试存储。不会预约上门或创建客服工单。'))}</p><form id="demo-form" class="form-grid" autocomplete="off" aria-describedby="form-demo-note">${contact ? inquiryFields : requestFields}<label class="check full-width"><input type="checkbox" name="demoAcknowledged" required><span>${esc(t('I understand this is a local preview and I am using sample information.', '我了解这是本地预览，并使用示例资料。'))}</span></label><div class="full-width actions"><button class="button button-primary" type="submit">${esc(t('Preview confirmation', '预览登记确认'))}<span aria-hidden="true">→</span></button><button class="button button-outline" type="reset">${esc(t('Clear form', '清空表单'))}</button></div><p id="form-result" class="form-result full-width" role="status" tabindex="-1" hidden></p></form></div><aside class="request-aside"><h2>${esc(contact ? t('A clear route to follow-up', '明确后续处理路径') : t('What comes next', '接下来如何安排'))}</h2>${list(contact ? [t('Official requests would receive a responsible owner and next step.', '正式反馈需明确负责人和下一步。'), t('Complaints and safety incidents use restricted official workflows.', '投诉与安全事件使用受限的官方流程。'), t('Public commendations require verification and authorization.', '公开表彰需核实并取得授权。')] : [t('Operations reviews the task list and service scope.', '运营确认任务清单与服务范围。'), t('Relevant staff permissions and available times are checked.', '核对人员权限及可用时段。'), t('Both parties confirm tasks, total cost and terms before a visit.', '上门前双方确认任务、总费用与条款。')])}<p class="price">${esc(price())}</p><p class="small">${esc(t('Preview requests have no follow-up owner and cannot be tracked.', '预览登记没有实际跟进负责人，也无法查询进度。'))}</p>${contact ? `<div class="emergency"><h3>${esc(t('Emergency?', '紧急情况？'))}</h3><p>${esc(t('In the US call 911 for immediate danger or medical emergencies. This form is not monitored.', '在美国遇即时危险或医疗紧急情况请拨打 911。此表单无人监控。'))}</p></div>` : link('privacy', esc(t('Privacy & family access', '隐私与家属授权')) + ' →', 'text-link')}</aside></div></section>${faq(commonFaq().slice(2))}`;
  }

  function notFound() {
    meta(t('Page not found', '页面未找到'), t('This preview route does not exist. Return to CareDoDo services or the city directory.', '此预览路由不存在，请返回 CareDoDo 服务或城市目录。'));
    return `<section class="section shell narrow">${heading('404', t('We couldn’t find that page.', '未找到此页面。'), t('Try the service list or city directory to continue.', '可从服务目录或城市列表继续浏览。'))}<div class="actions">${button('services', t('Browse services', '浏览服务'))}${button('cities', t('Browse cities', '浏览城市'), {}, true)}</div></section>${faq(commonFaq().slice(0, 2))}`;
  }

  function bindPage() {
    const assessment = document.getElementById('assessment-form');
    if (assessment) {
      const result = document.getElementById('assessment-result');
      const questions = data.assessmentQuestions;
      const showStep = (focus = false) => {
        questions.forEach((q, i) => { document.getElementById(`assessment-question-${i}`).hidden = i !== assessmentStep; });
        document.getElementById('assessment-back').disabled = assessmentStep === 0;
        document.getElementById('assessment-next').hidden = assessmentStep === questions.length - 1;
        document.getElementById('assessment-submit').hidden = assessmentStep !== questions.length - 1;
        document.getElementById('assessment-step-label').textContent = t(`Step ${assessmentStep + 1} of ${questions.length}`, `第 ${assessmentStep + 1} 题，共 ${questions.length} 题`);
        document.getElementById('assessment-error').hidden = true;
        if (focus) document.getElementById(`assessment-question-${assessmentStep}`).focus();
      };
      const progress = () => {
        const count = questions.filter(q => q.options.some(o => o.id === assessmentAnswers[q.id])).length;
        document.getElementById('assessment-progress').textContent = t(`${count} of ${questions.length} answered`, `已完成 ${count} 题，共 ${questions.length} 题`);
        document.getElementById('assessment-fill').style.width = `${count / questions.length * 100}%`;
        document.getElementById('assessment-meter').setAttribute('aria-valuenow', String(count));
      };
      const requireCurrent = () => {
        assessmentAnswers = Object.fromEntries(new FormData(assessment));
        if (assessmentAnswers[questions[assessmentStep].id]) return true;
        const error = document.getElementById('assessment-error');
        error.textContent = t('Choose an answer to continue.', '请选择一项答案后继续。');
        error.hidden = false;
        document.getElementById(`assessment-question-${assessmentStep}`).focus();
        return false;
      };
      document.getElementById('assessment-back').addEventListener('click', () => {
        assessmentStep = Math.max(0, assessmentStep - 1); showStep(true);
      });
      document.getElementById('assessment-next').addEventListener('click', () => {
        if (requireCurrent()) { assessmentStep = Math.min(questions.length - 1, assessmentStep + 1); showStep(true); }
      });
      assessment.addEventListener('change', () => {
        assessmentAnswers = Object.fromEntries(new FormData(assessment));
        assessmentComplete = false;
        result.hidden = true;
        result.innerHTML = '';
        document.getElementById('assessment-error').hidden = true;
        progress();
      });
      assessment.addEventListener('submit', event => {
        event.preventDefault();
        assessmentAnswers = Object.fromEntries(new FormData(assessment));
        const missing = questions.findIndex(q => !q.options.some(o => o.id === assessmentAnswers[q.id]));
        if (missing !== -1) {
          if (!requireCurrent()) return;
          assessmentStep = missing;
          showStep(true);
          return;
        }
        if (!window.CAREDODO_CAREER.evaluate(data, assessmentAnswers)) return;
        assessmentComplete = true;
        result.innerHTML = assessmentResult();
        result.hidden = false;
        result.focus();
      });
      assessment.addEventListener('reset', event => {
        event.preventDefault();
        assessmentAnswers = {};
        assessmentComplete = false;
        assessment.querySelectorAll('input').forEach(input => { input.checked = false; });
        result.hidden = true;
        result.innerHTML = '';
        assessmentStep = 0;
        showStep(true);
        progress();
      });
      showStep();
      progress();
    }
    document.getElementById('zip-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const zip = new FormData(event.currentTarget).get('zip').trim();
      if (!/^[0-9]{5}$/.test(zip)) return;
      if (!route) homeZip = zip;
      window.location.hash = url('areas', { zip });
    });
    const search = document.getElementById('city-search');
    if (search) {
      const region = document.getElementById('region-filter');
      const filter = () => {
        const query = search.value.trim().toLocaleLowerCase();
        let count = 0;
        document.querySelectorAll('[data-city]').forEach(card => {
          const c = cityById(card.dataset.city);
          const visible = (region.value === 'all' || c.region === region.value) && `${c.name.en} ${c.name.zh} ${c.state} ${c.zips.join(' ')}`.toLocaleLowerCase().includes(query);
          card.hidden = !visible;
          if (visible) count++;
        });
        document.getElementById('city-count').textContent = t(`${count} sample cities`, `${count} 个样例城市`);
        document.getElementById('city-empty').hidden = count > 0;
      };
      search.addEventListener('input', filter);
      region.addEventListener('change', filter);
      filter();
    }
    const form = document.getElementById('demo-form');
    if (!form) return;
    const result = document.getElementById('form-result');
    const familyAccess = document.getElementById('family-access');
    const localIntake = !form.elements.type && window.CareIntake?.enabled();
    let intakeKey = null;
    let sending = false;
    if (localIntake) {
      document.getElementById('form-demo-note').textContent = t('Local integration test. Use sample details only. Submissions are saved in this computer’s test database, not delivered to operations. No email is sent.', '本机联调：仅使用示例资料。提交后保存到本机测试库，尚未交给运营，也不发邮件。');
    }
    const updateScope = () => {
      const service = serviceById(form.elements.service.value);
      const zip = form.elements.zip.value;
      const city = cityForZip(zip);
      let message = t('Choose a service and ZIP code to see an illustrative status.', '选择服务与邮编，查看示例状态。');
      if (service) {
        if (service.status === 'coming') message = t('Coming soon: interest only, not a booking or matching request.', '即将开放：仅登记意向，不是预约或匹配申请。');
        else if (/^[0-9]{5}$/.test(zip)) message = city ? t(`Example only — ${cityName(city)}: ${local(data.availability[status(zip, service)])}. Actual coverage, people and times are unconfirmed.`, `仅为示例——${cityName(city)}：${local(data.availability[status(zip, service)])}。实际区域、人手与时间尚未确认。`) : t('ZIP not in the sample list: interest only. No availability is confirmed.', '邮编不在样例列表：仅登记意向，尚未确认可用情况。');
      }
      document.getElementById('request-scope').textContent = message;
    };
    if (form.elements.service) {
      form.elements.service.addEventListener('change', updateScope);
      form.elements.zip.addEventListener('input', updateScope);
      updateScope();
    }
    form.addEventListener('input', () => { if (!sending) intakeKey = null; result.hidden = true; result.textContent = ''; });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending || !form.reportValidity()) return;
      const zip = form.elements.zip?.value;
      const service = serviceById(form.elements.service?.value);
      const routing = service && /^[0-9]{5}$/.test(zip) ? status(zip, service) : '';
      const handoff = {
        matching: t('Example queue: operations review for matching.', '示例队列：运营审核匹配申请。'),
        waitlist: t('Example queue: waitlist follow-up.', '示例队列：候补跟进。'),
        interest: t('Example queue: service interest.', '示例队列：服务意向。'),
        coming: t('Example queue: service interest.', '示例队列：服务意向。')
      };
      const summary = handoff[routing] ? `${zip} · ${local(service.name)}. ${handoff[routing]} ` : '';
      if (localIntake) {
        sending = true;
        intakeKey ||= crypto.randomUUID();
        try {
          const value = name => form.elements[name]?.value || '';
          const saved = await window.CareIntake.submit({ kind: 'family', name: value('contactName'), email: value('email'),
            service: value('service'), zip: value('zip'), preferredTime: value('preferredTime'), frequency: value('frequency'),
            language: value('language'), tasks: value('tasks'), relationship: value('relationship'), recipient: value('recipient'),
            familyAccess: Boolean(familyAccess?.checked), contactConsent: Boolean(form.elements.demoAcknowledged?.checked) }, intakeKey);
          result.textContent = t(`Saved to this computer’s test database: ${saved.id}. Coverage is unverified, so this remains an interest record. Not delivered to operations; no email or booking created.`, `已写入本机测试库：${saved.id}。服务区域尚未核验，按意向记录；未交给运营，未发邮件，也未创建预约。`);
        } catch (error) { result.textContent = error.message; }
        finally { sending = false; }
        result.hidden = false; result.focus(); return;
      }
      result.textContent = summary + t('Demo complete. Nothing was sent or saved. No appointment or support case was created, and there will be no follow-up. You can clear the form to remove the sample entries.', '演示完成。信息未发送、未保存，未创建预约或客服工单，也不会有人跟进。可点击“清空表单”移除示例资料。');
      result.hidden = false;
      result.focus();
    });
    form.addEventListener('reset', event => {
      // Reset to an empty draft, including URL-prefilled fields. No entries persist.
      event.preventDefault();
      for (const element of form.elements) {
        if (element.tagName === 'SELECT') element.selectedIndex = 0;
        else if (element.type === 'checkbox') element.checked = false;
        else if (element.matches('input, textarea')) element.value = '';
      }
      intakeKey = null;
      if (form.elements.service) updateScope();
      result.hidden = true;
      result.textContent = '';
    });
  }

  function render(moveFocus = false) {
    const rawHash = window.location.hash.slice(1);
    const raw = !rawHash || rawHash === 'main' ? '/en' : rawHash;
    const [path, query = ''] = raw.split('?');
    const parts = path.replace(/^\/+|\/+$/g, '').split('/');
    lang = ['en', 'zh'].includes(parts[0]) ? parts.shift() : 'en';
    route = parts.filter(Boolean).join('/');
    params = new URLSearchParams(query);
    if (route !== 'join/assessment') { assessmentAnswers = {}; assessmentComplete = false; assessmentStep = 0; }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.body.classList.remove('menu-open');
    renderChrome();
    const pages = { '': homePage, services: servicesPage, cities: citiesPage, areas: areasPage, how: howPage, plans: plansPage, safety: safetyPage, join: joinPage, 'join/assessment': assessmentPage, 'join/requirements': requirementsPage, community: communityPage, about: aboutPage, contact: () => requestPage(true), request: () => requestPage(), account: accountPage, privacy: () => policyPage('privacy'), terms: () => policyPage('terms') };
    if (pages[route]) main.innerHTML = pages[route]();
    else {
      const segments = route.split('/');
      const s = segments[0] === 'services' && segments.length === 2 ? serviceById(segments[1]) : undefined;
      const c = segments[0] === 'cities' ? cityById(segments[1]) : undefined;
      if (s) main.innerHTML = servicePage(s);
      else if (c && segments.length === 2) main.innerHTML = cityPage(c);
      else if (c && segments.length === 3 && serviceById(segments[2])) main.innerHTML = servicePage(serviceById(segments[2]), c);
      else main.innerHTML = notFound();
    }
    if (route && main.innerHTML.includes('<!-- page-heading-end -->')) {
      let html = main.innerHTML;
      if (!html.includes('class="breadcrumbs"')) {
        const crumbs = `<nav class="breadcrumbs" aria-label="${t('Breadcrumb', '面包屑导航')}">${link('', esc(t('Home', '首页')))}<span aria-hidden="true">›</span>${route.startsWith('join/') ? link('join', esc(t('CareDoers', '康都人'))) + '<span aria-hidden="true">›</span>' : ''}<span>${esc(document.title.replace(' | CareDoDo', ''))}</span></nav>`;
        html = html.replace('<div class="page-heading">', crumbs + '<div class="page-heading">');
      }
      const marker = '<!-- page-heading-end -->';
      const headEnd = html.indexOf(marker) + marker.length;
      const sectionEnd = html.indexOf('</section>', headEnd);
      const aside = `<aside class="consult-aside"><p class="eyebrow">${esc(t('Here to help', '从沟通开始'))}</p><h2>${esc(t('What would make the day easier?', '什么能让日常轻松一点？'))}</h2><p>${esc(t('Tell us about your family, your ZIP code and the tasks you have in mind.', '说说家人的情况、邮编，以及希望有人搭把手的事情。'))}</p>${button('request', t('Let’s talk', '预约咨询'))}<p class="small">${esc(t('Preview only · Pricing and availability to be confirmed.', '仅供预览 · 费用及可用情况待确认。'))}</p>${link('join/assessment', esc(t('Looking for a care career?', '想成为康都人？')) + ' →', 'text-link')}</aside>`;
      const firstNestedSection = html.indexOf('<section', headEnd);
      const wrapEnd = firstNestedSection !== -1 && firstNestedSection < sectionEnd ? firstNestedSection : sectionEnd;
      main.innerHTML = html.slice(0, headEnd) + '<div class="inner-layout"><div class="inner-body">' + html.slice(headEnd, wrapEnd) + '</div>' + aside + '</div>' + html.slice(wrapEnd);
    }
    bindPage();
    if (moveFocus) { main.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }
  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    main.focus();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      document.body.classList.remove('menu-open');
      document.getElementById('primary-nav').classList.remove('is-open');
      document.getElementById('menu-toggle').setAttribute('aria-expanded', 'false');
      document.getElementById('menu-toggle').setAttribute('aria-label', t('Open menu', '打开菜单'));
      main.inert = false;
      footer.inert = false;
    }
  });
  window.addEventListener('hashchange', () => render(true));
  render();
})();
