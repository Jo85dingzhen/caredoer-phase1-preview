/* Plain script (not an ES module): also works when index.html is opened via file://. */
window.CAREDODO_DATA = {
  version: 'V1.3 + 11/13 meeting · Task 02',
  // Relative to this preview. Override only when the career site's deployment URL is confirmed.
  careerSiteUrl: 'https://jo85dingzhen.github.io/caredoer-phase1-preview/',
  positioning: {
    en: 'A new US home care platform built around career advancement, AI assistance and community service.',
    zh: '以职业进阶、AI 赋能、社区服务为主体的美国新型居家康养平台。'
  },
  regions: [
    { id: 'silicon-valley', launch: true, name: { en: 'Bay Area · Silicon Valley', zh: '湾区 · 硅谷' } },
    { id: 'bay-area', launch: true, name: { en: 'Other Bay Area cities', zh: '湾区其他城市' } },
    { id: 'los-angeles-area', launch: true, name: { en: 'Los Angeles area', zh: '洛杉矶地区' } },
    { id: 'california', launch: false, name: { en: 'Other California examples', zh: '加州其他样例' } }
  ],
  // Course names/statuses are snapshots of the supplied CareDoer documents, not live offerings.
  careerCourses: {
    adult: { name: { en: 'Adult First Aid, CPR, AED and BLS', zh: '成人急救、CPR、AED 与 BLS' }, status: { en: 'Existing courses; confirm sessions. BLS depends on the role.', zh: '现有课程；班次需确认。BLS 按具体岗位要求选择。' } },
    ec: { name: { en: 'Elder Care Foundations (EC-L1)', zh: '老人陪护基础（EC-L1）' }, status: { en: 'In preparation; internal skills assessment, not a government license.', zh: '备课中；按内部能力标准考核，不是政府执照。' } },
    hs: { name: { en: 'Household Support (HS) Foundations', zh: 'HS 家庭生活支持基础' }, status: { en: 'Planned in the CareDoer documents; delivery and HS-L1 assessment to be confirmed.', zh: 'CareDoer 文档规划课程；交付与 HS-L1 考核安排待定。' } },
    hca: { name: { en: 'HCA Pre-employment and Annual Training', zh: 'HCA 岗前与年度培训' }, status: { en: 'Subject to an HCO pilot and its employer training plan.', zh: '待 HCO 试点及雇主培训计划确认。' } },
    na: { name: { en: 'NA Career Preparation and Approved CNA Program Pathway', zh: 'NA 职业预备课与获批 CNA 项目衔接' }, status: { en: 'Partner pathway to be confirmed; NA preparation does not confer CNA certification.', zh: '合作衔接待确认；NA 预备课不授予 CNA 资格。' } }
  },
  careerRoles: [
    { id: 'household', name: { en: 'Household assistant', zh: '居家助理' }, description: { en: 'Explore household support, light tidying and agreed daily tasks. Related CareDoer roles: 33–36.', zh: '了解家庭生活支持、轻度整理与约定的日常任务，对应 CareDoer 33–36 岗位方向。' }, courses: ['hs'] },
    { id: 'care', name: { en: 'Home care aide', zh: '居家照顾' }, description: { en: 'Explore non-medical daily support and family handoffs. Related roles: 04–05; tasks require individual review.', zh: '了解非医疗生活协助与家属交接，对应 04–05 岗位；具体任务需逐项核准。' }, courses: ['ec', 'hca'] },
    { id: 'companion', name: { en: 'Senior companion', zh: '老人陪伴' }, description: { en: 'Explore conversation, walks and observation with authorized handoffs. Related roles: 01–03.', zh: '了解聊天、散步、观察与获授权交接，对应 01–03 岗位方向。' }, courses: ['ec'] }
  ],
  // Explicit option weights make recommendations deterministic and reviewable; ties use role order above.
  assessmentQuestions: [
    { id: 'interest', prompt: { en: 'Which work would you most like to explore?', zh: '你最想了解哪类工作？' }, options: [
      { id: 'household', label: { en: 'Tidying and household support', zh: '整理与家庭生活支持' }, scores: { household: 4 } },
      { id: 'care', label: { en: 'Daily living support and handoffs', zh: '生活协助与交接' }, scores: { care: 4 } },
      { id: 'companion', label: { en: 'Conversation and companionship', zh: '聊天与陪伴' }, scores: { companion: 4 } }
    ] },
    { id: 'strength', prompt: { en: 'Which strength would you like to use?', zh: '你希望发挥哪方面长处？' }, options: [
      { id: 'organize', label: { en: 'Organizing practical tasks', zh: '安排并完成生活事务' }, scores: { household: 3 } },
      { id: 'observe', label: { en: 'Careful observation and recording', zh: '细致观察与记录' }, scores: { care: 3 } },
      { id: 'listen', label: { en: 'Listening and building rapport', zh: '倾听与建立信任' }, scores: { companion: 3 } }
    ] },
    { id: 'experience', prompt: { en: 'What experience would you build on?', zh: '你有哪些可继续发展的经验？' }, options: [
      { id: 'home', label: { en: 'Household tasks', zh: '家务与家庭事务' }, scores: { household: 2 } },
      { id: 'care', label: { en: 'Supporting a relative or care work', zh: '照顾家人或照护工作' }, scores: { care: 2 } },
      { id: 'social', label: { en: 'Community visits or volunteering', zh: '社区探访或志愿陪伴' }, scores: { companion: 2 } },
      { id: 'new', label: { en: 'New to all of these', zh: '以上都是新方向' }, scores: {} }
    ] },
    { id: 'tasks', prompt: { en: 'Which task feels most comfortable to learn?', zh: '你更愿意学习哪种任务？' }, options: [
      { id: 'household', label: { en: 'Safe cleaning, laundry and tidying', zh: '安全清洁、洗衣和整理' }, scores: { household: 3 } },
      { id: 'care', label: { en: 'Agreed daily assistance and handoff notes', zh: '约定的生活协助与交接记录' }, scores: { care: 3 } },
      { id: 'companion', label: { en: 'Shared activities and conversation', zh: '共同活动与日常交流' }, scores: { companion: 3 } }
    ] },
    { id: 'schedule', prompt: { en: 'What schedule would you discuss with operations?', zh: '你希望与运营沟通哪种时段？' }, options: [
      { id: 'regular', label: { en: 'Regular weekly availability', zh: '每周固定时段' }, scores: {} },
      { id: 'flexible', label: { en: 'Flexible occasional availability', zh: '灵活的零散时段' }, scores: {} },
      { id: 'unsure', label: { en: 'Not sure yet', zh: '尚不确定' }, scores: {} }
    ] },
    { id: 'language', prompt: { en: 'Which service language would you discuss?', zh: '你希望使用哪种服务语言？' }, options: [
      { id: 'english', label: { en: 'English', zh: '英语' }, scores: {} },
      { id: 'chinese', label: { en: 'Chinese', zh: '中文' }, scores: {} },
      { id: 'both', label: { en: 'English and Chinese', zh: '中英双语' }, scores: {} },
      { id: 'another', label: { en: 'Another language; confirm later', zh: '其他语言，后续确认' }, scores: {} }
    ] },
    { id: 'cpr', prompt: { en: 'Where are you with CPR training?', zh: '你的 CPR 学习情况如何？' }, options: [
      { id: 'existing', label: { en: 'I have a credential for later verification', zh: '已有凭证，可在后续核验' }, scores: {} },
      { id: 'learn', label: { en: 'Ready to learn or renew', zh: '愿意学习或复训' }, scores: {} },
      { id: 'unsure', label: { en: 'Need to understand it first', zh: '需要先了解' }, scores: {} }
    ] },
    { id: 'learning', prompt: { en: 'How ready are you for training and practical assessment?', zh: '你对培训与实操考核的准备如何？' }, options: [
      { id: 'ready', label: { en: 'Ready to make a learning plan', zh: '愿意制定学习计划' }, scores: {} },
      { id: 'explore', label: { en: 'Still exploring the commitment', zh: '还在了解所需投入' }, scores: {} }
    ] },
    { id: 'boundaries', prompt: { en: 'How would you handle a task outside your permissions?', zh: '遇到超出服务权限的任务，你会怎么做？' }, options: [
      { id: 'review', label: { en: 'Pause the task and ask operations; protect client privacy', zh: '暂停该任务并联系运营，保护客户隐私' }, scores: {} },
      { id: 'learn', label: { en: 'I need guidance on boundaries and reporting', zh: '我需要先学习边界与上报规则' }, scores: {} }
    ] },
    { id: 'clinical', prompt: { en: 'Would you like to explore a longer CNA qualification pathway?', zh: '你是否想了解更长期的 CNA 资格路径？' }, options: [
      { id: 'advanced', label: { en: 'Yes; I have higher education and want to explore further study', zh: '想了解；已有高等教育经历，愿意继续学习' }, scores: {} },
      { id: 'interested', label: { en: 'Interested; I need to check entry requirements', zh: '有兴趣，需要先核对入学条件' }, scores: {} },
      { id: 'no', label: { en: 'Focus on non-medical home support for now', zh: '目前先了解非医疗居家支持' }, scores: {} }
    ] }
  ],
  careerSteps: [
    { name: { en: 'Learn and demonstrate skills', zh: '学习与能力考核' }, description: { en: 'CPR is required on every suggested pathway. Verify existing credentials, complete role learning and practical assessment. Course completion and internal certificates are recorded separately.', zh: '各推荐路径均以 CPR 为必修入口。已有凭证需核验；完成岗位课程及实操考核，分别记录课程结业与内部能力证书。' } },
    { name: { en: 'Review California HCO and HCA requirements', zh: '加州 HCO 与 HCA 资格核验' }, description: { en: 'The supplied documents distinguish HCO organization licensing from HCA worker registration. Confirm the operating entity and employment model first, then applicable registration, background review and employer training. The final process is to be confirmed.', zh: '所提供文档区分 HCO 机构许可与 HCA 人员注册。先确认经营主体及用工模式，再核对适用的人员注册、背景核验和雇主培训；最终办理口径待确认。' } },
    { name: { en: 'Review, agree and authorize', zh: '审核、签约与权限核准' }, description: { en: 'Review documents, contracting entity and employment terms. W-2 employment is the intended direction; W-2 or 1099 arrangements remain to be confirmed. Pay and platform fees: to be determined.', zh: '核对材料、签约主体与用工条款。以可成为 W-2 正式员工为规划方向；W-2 或 1099 具体安排待确认。薪资、平台抽成：待定。' } },
    { name: { en: 'Match, serve and keep learning', zh: '外派匹配、服务与持续学习' }, description: { en: 'Operations authorizes specific regions and tasks, matches family demand and confirms with both parties. Feedback returns to learning and career development. Training does not guarantee a job or orders.', zh: '运营核准具体地区和任务权限，结合家庭需求匹配并经双方确认。服务反馈回到复训和职业成长；培训不保证录用或订单。' } }
  ],
  careerLadder: [
    { name: { en: 'Learner', zh: '学员' }, description: { en: 'Explore roles, complete required CPR and prepare role skills.', zh: '探索岗位，完成必修 CPR，准备岗位技能。' } },
    { name: { en: 'Certified CareDoer', zh: '认证康都人' }, description: { en: 'Complete internal assessment and applicable checks; obtain separately reviewed service permissions.', zh: '完成内部能力考核与适用资格核验；服务权限另行审核。' } },
    { name: { en: 'Senior CareDoer', zh: '资深康都人' }, description: { en: 'Develop advanced skills through reviewed practice, quality improvement and mentoring.', zh: '通过经核实的实践、质量改进和带教，发展进阶能力。' } },
    { name: { en: 'Community lead and station manager', zh: '社区组长与站长' }, description: { en: 'Apply for supervision and local coordination roles based on management ability and actual openings.', zh: '结合管理能力与实际岗位空缺，申请督导及本地协调岗位。' } }
  ],
  services: [
    {
      id: 'companion', code: '01', product: 'Companion', status: 'active',
      name: { en: 'Companionship', zh: '老人陪伴' },
      summary: { en: 'Conversation, walks and company for everyday activities.', zh: '聊天、散步、日常活动陪伴。' },
      audience: { en: 'Older adults looking for company, and families arranging support for a parent or relative.', zh: '希望有人陪伴的老年人，以及为父母或其他家人安排支持的家庭。' },
      tasks: { en: ['Conversation and shared interests', 'Walks within an agreed area', 'Companionship during everyday activities'], zh: ['聊天与兴趣交流', '在约定区域内散步', '日常活动陪伴'] },
      confirm: { en: ['Preferred language and interests', 'Available times and activity preferences', 'Family handoff preferences and authorized contact'], zh: ['语言与兴趣偏好', '可用时段及活动偏好', '家庭交接偏好与获授权联系人'] },
      frequency: { en: 'Occasional visits or a regular rhythm of companionship. Frequency and duration are confirmed with operations.', zh: '可按需了解单次陪伴，或咨询固定频次安排。频次与时长由运营确认。' },
      boundary: { en: 'Non-medical companionship only. Medical nursing, clinical procedures and tasks outside the pilot scope require human assessment; referral information may be offered where appropriate.', zh: '仅提供非医疗陪伴。医疗护理、临床操作及超出试点范围的任务需人工评估，并视情况提供转介信息。' }
    },
    {
      id: 'assist', code: '02', product: 'Assist', status: 'active',
      name: { en: 'Daily living assistance', zh: '日常生活协助' },
      summary: { en: 'Shopping, simple meal preparation and help with everyday errands.', zh: '购物、简单备餐、生活事务协助。' },
      audience: { en: 'Older adults who would like help with agreed everyday tasks, including requests made by family members.', zh: '需要协助完成约定生活事务的老年人，也支持家属代为提出需求。' },
      tasks: { en: ['Shopping from an agreed list', 'Simple meal preparation', 'Assistance with everyday errands'], zh: ['按约定清单购物', '简单备餐', '生活事务协助'] },
      confirm: { en: ['Purchase and spending authorization', 'An agreed task list and service scope', 'Food preferences, supplies and handoff requirements'], zh: ['采购与支出授权', '任务清单及服务范围', '饮食偏好、用品与交接要求'] },
      frequency: { en: 'Request help as needed or discuss a recurring routine. The task list, timing and duration need confirmation.', zh: '可按需咨询，或了解固定频次的生活协助。任务清单、时段与时长需逐项确认。' },
      boundary: { en: 'Only agreed non-medical everyday tasks. A request is assessed before matching; it does not authorize medical care or other work outside the pilot scope.', zh: '仅限双方约定的非医疗生活事务。匹配前需评估需求，登记不代表获准提供医疗照护或其他超范围服务。' }
    },
    {
      id: 'home', code: '03', product: 'Home', status: 'active',
      name: { en: 'Light housekeeping', zh: '适老化轻家务' },
      summary: { en: 'Light cleaning, laundry and tidying for everyday comfort at home.', zh: '轻度清洁、洗衣、整理，让日常居家生活更舒适。' },
      audience: { en: 'Older adults and families seeking help with light household tasks in agreed areas of the home.', zh: '需要在约定居家区域内获得轻家务支持的老年人及其家庭。' },
      tasks: { en: ['Light cleaning in agreed areas', 'Laundry', 'Everyday tidying'], zh: ['约定区域内的轻度清洁', '洗衣', '日常整理'] },
      confirm: { en: ['Rooms and areas included in the visit', 'Household tasks and supplies', 'On-site precautions and handoff notes'], zh: ['服务区域', '家务项目及所需用品', '现场注意事项与交接信息'] },
      frequency: { en: 'Discuss an occasional visit or regular light housekeeping. The areas, tasks and visit duration are confirmed first.', zh: '可咨询单次或固定频次的轻家务。服务前先确认区域、具体项目与预计时长。' },
      boundary: { en: 'Light housekeeping within the agreed pilot scope. Deep cleaning, moving, repairs and home modifications are not included in this initial service.', zh: '限试点范围内约定的轻家务。首期不包含深度保洁、搬家、维修或住宅改造。' }
    },
    { id: 'cleaning', code: '04', status: 'coming', name: { en: 'House cleaning', zh: '家庭保洁' }, summary: { en: 'Broader household cleaning services.', zh: '更全面的家庭清洁服务。' } },
    { id: 'cooking', code: '05', status: 'coming', name: { en: 'Cooking', zh: '做饭' }, summary: { en: 'Dedicated in-home meal preparation.', zh: '专门的上门烹饪服务。' } },
    { id: 'errands', code: '06', status: 'coming', name: { en: 'Errand services', zh: '跑腿' }, summary: { en: 'Standalone errands beyond the Assist pilot scope.', zh: '超出 Assist 试点范围的独立跑腿服务。' } },
    { id: 'pets', code: '07', status: 'coming', name: { en: 'Pet care', zh: '宠物照料' }, summary: { en: 'Everyday support for household pets.', zh: '家庭宠物的日常照料。' } },
    { id: 'gardening', code: '08', status: 'coming', name: { en: 'Gardening', zh: '园艺' }, summary: { en: 'Help with gardens and outdoor spaces.', zh: '花园与室外空间的日常打理。' } },
    { id: 'organizing', code: '09', status: 'coming', name: { en: 'Moving & organizing', zh: '搬家整理' }, summary: { en: 'Packing, unpacking and household organization.', zh: '打包、拆包与居家物品整理。' } },
    { id: 'childcare', code: '10', status: 'coming', name: { en: 'Childcare', zh: '托育' }, summary: { en: 'A future service category; career-site courses do not imply service availability.', zh: '后续服务方向；辅站展示课程不代表主站已开放服务。' } }
  ],
  // EXAMPLES ONLY. These ZIPs are samples, not complete city boundaries or approved coverage.
  cities: [
    { id: 'palo-alto', name: { en: 'Palo Alto', zh: '帕洛阿尔托' }, state: 'CA', region: 'silicon-valley', zips: ['94301', '94306'] },
    { id: 'mountain-view', name: { en: 'Mountain View', zh: '山景城' }, state: 'CA', region: 'silicon-valley', zips: ['94040', '94041'] },
    { id: 'sunnyvale', name: { en: 'Sunnyvale', zh: '森尼韦尔' }, state: 'CA', region: 'silicon-valley', zips: ['94086', '94087'] },
    { id: 'cupertino', name: { en: 'Cupertino', zh: '库比蒂诺' }, state: 'CA', region: 'silicon-valley', zips: ['95014'] },
    { id: 'san-jose', name: { en: 'San Jose', zh: '圣何塞' }, state: 'CA', region: 'silicon-valley', zips: ['95112', '95129'] },
    { id: 'santa-clara', name: { en: 'Santa Clara', zh: '圣克拉拉' }, state: 'CA', region: 'silicon-valley', zips: ['95050', '95051'] },
    { id: 'los-altos', name: { en: 'Los Altos', zh: '洛斯阿尔托斯' }, state: 'CA', region: 'silicon-valley', zips: ['94022', '94024'] },
    { id: 'menlo-park', name: { en: 'Menlo Park', zh: '门洛帕克' }, state: 'CA', region: 'bay-area', zips: ['94025'] },
    { id: 'redwood-city', name: { en: 'Redwood City', zh: '红木城' }, state: 'CA', region: 'bay-area', zips: ['94061', '94063'] },
    { id: 'san-mateo', name: { en: 'San Mateo', zh: '圣马特奥' }, state: 'CA', region: 'bay-area', zips: ['94401', '94403'] },
    { id: 'fremont', name: { en: 'Fremont', zh: '弗里蒙特' }, state: 'CA', region: 'bay-area', zips: ['94536', '94538'] },
    { id: 'oakland', name: { en: 'Oakland', zh: '奥克兰' }, state: 'CA', region: 'bay-area', zips: ['94612'] },
    { id: 'san-francisco', name: { en: 'San Francisco', zh: '旧金山' }, state: 'CA', region: 'bay-area', zips: ['94103', '94110'] },
    { id: 'sacramento', name: { en: 'Sacramento', zh: '萨克拉门托' }, state: 'CA', region: 'california', zips: ['95814'] },
    { id: 'los-angeles', name: { en: 'Los Angeles', zh: '洛杉矶' }, state: 'CA', region: 'los-angeles-area', zips: ['90012'] },
    { id: 'pasadena-ca', name: { en: 'Pasadena', zh: '帕萨迪纳' }, state: 'CA', region: 'los-angeles-area', zips: ['91101'] },
    { id: 'alhambra-ca', name: { en: 'Alhambra', zh: '阿罕布拉' }, state: 'CA', region: 'los-angeles-area', zips: ['91801'] },
    { id: 'monterey-park-ca', name: { en: 'Monterey Park', zh: '蒙特利公园' }, state: 'CA', region: 'los-angeles-area', zips: ['91754'] },
    { id: 'san-gabriel-ca', name: { en: 'San Gabriel', zh: '圣盖博' }, state: 'CA', region: 'los-angeles-area', zips: ['91776'] },
    { id: 'arcadia-ca', name: { en: 'Arcadia', zh: '阿凯迪亚' }, state: 'CA', region: 'los-angeles-area', zips: ['91006'] },
    { id: 'el-monte-ca', name: { en: 'El Monte', zh: '艾尔蒙地' }, state: 'CA', region: 'los-angeles-area', zips: ['91731'] },
    { id: 'glendale-ca', name: { en: 'Glendale', zh: '格伦代尔' }, state: 'CA', region: 'los-angeles-area', zips: ['91203'] },
    { id: 'burbank-ca', name: { en: 'Burbank', zh: '伯班克' }, state: 'CA', region: 'los-angeles-area', zips: ['91502'] },
    { id: 'long-beach-ca', name: { en: 'Long Beach', zh: '长滩' }, state: 'CA', region: 'los-angeles-area', zips: ['90802'] },
    { id: 'san-diego', name: { en: 'San Diego', zh: '圣迭戈' }, state: 'CA', region: 'california', zips: ['92101'] }
  ],
  // Illustrative ZIP × service status. Omitted entries fall back to interest.
  zipAvailability: {
    '94301': { companion: 'matching', assist: 'waitlist' },
    '94306': { companion: 'waitlist', assist: 'waitlist' },
    '94040': { companion: 'waitlist', assist: 'matching' },
    '94041': { companion: 'waitlist', assist: 'matching' },
    '94086': { companion: 'waitlist', home: 'matching' },
    '94087': { companion: 'waitlist', home: 'matching' },
    '95014': { companion: 'waitlist', assist: 'waitlist' },
    '95112': { companion: 'waitlist', home: 'waitlist' },
    '95129': { companion: 'waitlist', home: 'waitlist' },
    '95050': { assist: 'waitlist' },
    '95051': { assist: 'waitlist' }
  },
  availability: {
    matching: { en: 'May request matching', zh: '可申请匹配' },
    waitlist: { en: 'Waitlist', zh: '候补' },
    interest: { en: 'Register interest', zh: '登记服务意向' }
  },
  plans: [
    { id: 'basic', name: 'Basic', title: { en: 'Help as you need it', zh: '按需预约' }, description: { en: 'For occasional requests with the task list and timing confirmed for each visit.', zh: '适合偶尔需要支持的家庭，每次确认任务与时段。' } },
    { id: 'plus', name: 'Plus', title: { en: 'A regular rhythm', zh: '固定频次' }, description: { en: 'For recurring support. A consistent CareDoer is a matching preference, subject to availability.', zh: '适合固定频次的支持需求。优先匹配固定 CareDoer，人选与时段以运营确认为准。' } },
    { id: 'family', name: 'Family', title: { en: 'Ongoing family support', zh: '持续服务与家属反馈' }, description: { en: 'For ongoing support and service summaries shared with family members within their authorization.', zh: '适合持续服务，并向获授权家属共享权限范围内的服务摘要。' } }
  ]
};
