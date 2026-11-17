const roles = [
  {
    "id": "01",
    "category": "senior",
    "title": "居家老人陪伴员",
    "english": "Senior Companion",
    "scene": "独居或半独居老人家中",
    "summary": "探访、聊天、陪散步、观察异常及向家属交接",
    "credential": "EC-L1；适用时核验 HCA 注册",
    "training": "老人陪伴、沟通与观察记录；可配成人急救／CPR／AED",
    "courses": [
      "ec",
      "adult"
    ],
    "nextStep": "准备 EC-L1 及岗位所需材料，再向家庭或居家照护机构申请。由雇主核验适用资格、服务范围和交接要求后安排班次。"
  },
  {
    "id": "02",
    "category": "senior",
    "title": "老人就医陪同员",
    "english": "Medical Appointment Companion",
    "scene": "老人门诊、检查及返家",
    "summary": "陪同签到、候诊，经授权转达就诊信息并交接",
    "credential": "EC-L1；适用 HCA；载客另核驾照、授权及保险",
    "training": "陪诊实务、隐私、出行安全和信息交接",
    "courses": [
      "ec",
      "adult"
    ],
    "nextStep": "向家庭或照护机构申请陪诊工作。服务方核验隐私授权、交接和出行要求后安排任务。涉及载客时另核驾照、授权与保险。"
  },
  {
    "id": "03",
    "category": "senior",
    "title": "老人家庭喘息照护员",
    "english": "Senior Respite Caregiver",
    "scene": "老人家属短时外出",
    "summary": "短时替班、陪伴和低风险生活协助",
    "credential": "EC-L1；适用 HCA；转移、吞咽或走失风险另核专项能力",
    "training": "喘息照护、家属交接、异常报告；按个案加修失能或失智",
    "courses": [
      "ec",
      "adult"
    ],
    "nextStep": "向家庭或照护机构申请替班。由服务方核对个案风险、允许任务及交接安排，再确认能否上班。"
  },
  {
    "id": "04",
    "category": "senior",
    "title": "家庭直聘居家照护员",
    "english": "Independent Home Care Aide",
    "scene": "家庭直接聘用",
    "summary": "按家庭约定提供非医疗陪伴和生活协助",
    "credential": "按聘用方式核验背景材料；可核验自愿 HCA 注册及急救卡",
    "training": "EC 基础、家庭服务边界、成人急救／CPR／AED",
    "courses": [
      "adult",
      "ec"
    ],
    "nextStep": "与直聘家庭约定非医疗服务范围、时间和交接方式。按聘用方式完成资格与背景核验后开始服务。"
  },
  {
    "id": "18",
    "category": "child",
    "title": "家庭保姆",
    "english": "Nanny",
    "scene": "儿童家中固定班次",
    "summary": "负责儿童餐点、活动、作息和家长交接",
    "credential": "CC 模块结业证明；适用儿科急救卡；按安置方式或项目规则核验 TrustLine",
    "training": "家庭育儿基础、儿科急救／CPR、家长沟通",
    "courses": [
      "pediatric"
    ],
    "nextStep": "向家庭申请固定看护岗位。提交适用课程证明与背景材料，由家庭或介绍方确认职责、班次和交接方式。"
  },
  {
    "id": "19",
    "category": "child",
    "title": "临时儿童看护员",
    "english": "Babysitter",
    "scene": "家长短时外出",
    "summary": "短时看护、游戏、餐点、作息及紧急联络",
    "credential": "CC 模块结业证明；适用急救卡和背景材料",
    "training": "家庭育儿基础；儿科急救；红会 Babysitter’s Training 按授权安排",
    "courses": [
      "pediatric",
      "babysitter"
    ],
    "nextStep": "与家庭确认时段、照护范围和紧急联系人。提交家庭要求的培训和背景材料，经核验后接班。"
  },
  {
    "id": "20",
    "category": "child",
    "title": "婴幼儿日间看护员",
    "english": "Infant / Toddler Caregiver",
    "scene": "婴幼儿家中日间",
    "summary": "喂养、换尿布、午睡观察及记录",
    "credential": "CC 模块结业证明；适用儿科急救卡及 TrustLine",
    "training": "婴幼儿照护、安全睡眠、噎食应对和交接",
    "courses": [
      "pediatric"
    ],
    "nextStep": "向家庭申请日间看护工作。由雇主核验适用凭证与背景材料，并确认喂养、睡眠观察和交接要求。"
  },
  {
    "id": "21",
    "category": "child",
    "title": "课后儿童看护员",
    "english": "After-school Caregiver",
    "scene": "放学后及家庭接送",
    "summary": "按授权接送，安排餐点和活动，向家长交接",
    "credential": "CC 模块结业证明；适用急救卡；另核接送授权及运输条件",
    "training": "课后照护、接送安全、儿科急救",
    "courses": [
      "pediatric"
    ],
    "nextStep": "向家庭或适用项目申请。经雇主核验资格、接送授权和运输条件后，确认接送路线与班次。"
  },
  {
    "id": "22",
    "category": "child",
    "title": "托育中心助教",
    "english": "Child Care Center Aide",
    "scene": "持牌托育中心",
    "summary": "在教师或主管监督下协助活动、卫生和接送交接",
    "credential": "按 CDSS 核验助教资格、监督、背景及健康材料",
    "training": "CC 托育衔接、强制报告员培训；按岗位配置安排儿科急救及 PHS",
    "courses": [
      "pediatric",
      "phs"
    ],
    "nextStep": "向持牌托育中心申请助教岗位。中心核验人员材料、监督安排及适用培训后决定聘用和排班。"
  },
  {
    "id": "23",
    "category": "child",
    "title": "托育中心教师",
    "english": "Child Care Center Teacher",
    "scene": "持牌托育中心班级",
    "summary": "负责班级活动、日常照护、安全及记录",
    "credential": "适用幼教或儿童发展学分、工作经验、背景与健康材料",
    "training": "ECE／儿童发展院校课程、强制报告员培训；适用儿科急救及 PHS",
    "courses": [
      "pediatric",
      "phs"
    ],
    "nextStep": "向持牌托育中心申请教师岗位。提交学分、经验和适用凭证，由中心核验资格后决定聘用和排班。"
  },
  {
    "id": "24",
    "category": "child",
    "title": "托育中心主任",
    "english": "Child Care Center Director",
    "scene": "持牌托育中心运营",
    "summary": "排班、核验人员资格、监督照护和安全流程",
    "credential": "按 CDSS 核验主任学历、经验及人员资格；中心持照",
    "training": "托育管理、适用院校课程、强制报告员培训；儿科急救及 PHS 按配置",
    "courses": [
      "pediatric",
      "phs"
    ],
    "nextStep": "向持牌托育中心申请主任岗位。提交教育、经验和培训材料，由中心核验主任资格和任职安排。"
  },
  {
    "id": "25",
    "category": "child",
    "title": "家庭托儿所经营者",
    "english": "Family Child Care Home Provider",
    "scene": "经营者自住的托育住宅",
    "summary": "招收儿童、组织照护、维护场所安全及记录",
    "credential": "CDSS 家庭托儿所执照；说明会、适用人员背景和健康材料、场所检查；视情形核验消防和房东文件",
    "training": "托育儿科急救＋CPR 初训 8 小时、PHS 8 小时；强制报告员培训",
    "courses": [
      "pediatric",
      "phs"
    ],
    "nextStep": "准备培训凭证及申请材料，按 CDSS 流程申请家庭托儿所许可。获许可并完成适用开办条件后开始运营。"
  },
  {
    "id": "26",
    "category": "child",
    "title": "托育中心开办人",
    "english": "Child Care Center Operator",
    "scene": "筹办独立托育机构",
    "summary": "筹备场地、人员、制度和执照申请",
    "credential": "CDSS 托育中心执照；核验消防、分区及适用地方要求",
    "training": "CDSS 开办说明会；员工托育健康安全课程",
    "courses": [
      "pediatric",
      "phs"
    ],
    "nextStep": "按 CDSS 流程申请中心许可，完成场地及人员配置核验后开办。按中心岗位配置安排员工培训。"
  },
  {
    "id": "38",
    "category": "home",
    "title": "家庭安全支持员",
    "english": "Home Safety Support Specialist",
    "scene": "家庭应急准备",
    "summary": "排查隐患、建立紧急联系清单、组织演练",
    "credential": "FS 能力证书；适用授权急救卡",
    "training": "家庭风险评估、应急演练、成人或儿科急救",
    "courses": [
      "adult",
      "pediatric"
    ],
    "nextStep": "与家庭或服务方确认允许的风险排查和演练任务。核验 FS 能力及适用急救卡后，按约定开展服务。"
  },
  {
    "id": "42",
    "category": "pet",
    "title": "上门宠物看护员",
    "english": "Pet Sitter",
    "scene": "主人外出，宠物留在家中",
    "summary": "喂养、换水、清洁、陪伴、观察及交接",
    "credential": "PC 能力证书；可配第三方犬猫急救证；经营者核验当地登记",
    "training": "家庭宠物照护、出入门安全、犬猫急救",
    "courses": [
      "pet"
    ],
    "nextStep": "先补齐岗位所需的日常照护能力，并核对适用的经营要求。与宠物主人约定进出门、照护任务和紧急交接，再开始服务。"
  },
  {
    "id": "43",
    "category": "pet",
    "title": "遛狗员",
    "english": "Dog Walker",
    "scene": "社区或户外遛宠",
    "summary": "牵引遛犬、路线管理、出入门和返回交接",
    "credential": "PC 能力证书；可配第三方急救证；核验地方及场地规则",
    "training": "犬只行为、牵引安全、走失预防、犬猫急救",
    "courses": [
      "pet"
    ],
    "nextStep": "核对场地规则与牵引能力。与宠物主人确认路线、牵引方式和交接后再开始服务。"
  },
  {
    "id": "44",
    "category": "pet",
    "title": "多宠家庭看护员",
    "english": "Multi-pet Caregiver",
    "scene": "多宠家庭",
    "summary": "分开喂养或活动，逐只核对状态和记录",
    "credential": "PC 进阶能力；可配第三方急救证",
    "training": "多宠管理、分区、交接及犬猫急救",
    "courses": [
      "pet"
    ],
    "nextStep": "补齐多宠管理能力。与家庭逐只核对分区、喂养和异常交接要求后安排服务。"
  },
  {
    "id": "45",
    "category": "pet",
    "title": "宠物寄养经营者",
    "english": "Pet Boarding Operator",
    "scene": "自家或固定场所接收宠物",
    "summary": "入住交接、分区、清洁消毒、异常观察及兽医转送",
    "credential": "按地址核验地方营业、用地和场所许可；可配 PC 培训证明",
    "training": "寄养实务、卫生、应急流程及犬猫急救",
    "courses": [
      "pet"
    ],
    "nextStep": "按经营地址核对营业、用地及场所许可，准备卫生和应急流程，满足开办条件后再接受寄养。"
  }
];

const courses = {
  pediatric: {
    title: '托育儿科急救、CPR 与 AED',
    status: '开放报名',
    description: '首班：2026 年 12 月 2 日（周三）上午 9:00 至下午 5:00（加州时间）· 8 小时 · $115 · San Jose',
    enrollmentDetails: '1631 N First Street, Suite 200, San Jose, CA 95112',
    credential: '课程结业证书（Certificate of Completion）由 ALLCPR 出具，附 EMSA 儿科急救和儿科 CPR 课程结业贴纸。',
    action: '查看首班与报名',
    links: [{ label: '前往 ALLCPR 正式报名', url: 'https://allcpr.enrollware.com/enroll?id=14894939' }],
    sessions: ['示例班次 A', '示例班次 B'],
  },
  phs: {
    title: '托育预防性健康与安全（PHS）',
    status: '仅收意向',
    description: '有兴趣参加托育预防性健康与安全课程？可在此预览意向登记。',
    action: '查看意向登记',
    mode: 'interest',
    interestOnly: true,
  },
  adult: {
    title: '成人急救／CPR／AED 与 BLS',
    status: '现有课程',
    description: '成人急救适配居家陪伴、家庭直聘照护和家庭安全等岗位，也可作为陪诊或喘息照护的补充。BLS 按具体岗位要求选择。',
    credential: '按所选课程由相应授权体系签发急救卡或 BLS 卡。',
    action: '查看 ALLCPR 课程',
    links: [
      { label: '查看 CPR／急救班次', url: 'https://allcpr.org/bay-area/' },
      { label: '查看 AHA BLS 班次', url: 'https://allcpr.org/bay-area/san-jose-1/aha-bls/take-a-course/' },
    ],
  },
  ec: {
    title: '老人陪护基础（EC-L1）',
    status: '备课中',
    description: '16 小时，包含公共基础和老人照护基础。开班以备课和交付条件确认结果为准。',
    credential: '完成培训并通过考核后，按 CareDoer 内部能力标准评定 EC-L1。',
    action: '查看课程状态',
  },
  babysitter: {
    title: 'Babysitter’s Training',
    status: '意向登记',
    description: '红会临时看护培训。班次等课程授权和讲师准备确认后公布。',
    credential: '正式交付后的课程凭证以获准课程及其授权体系为准。',
    action: '登记开课意向',
    mode: 'interest',
  },
  pet: {
    title: '红会犬猫急救线上课',
    status: '第三方线上课',
    description: '美国红十字会提供的线上急救基础课，可作为日常宠物照护的补充。',
    credential: '完成后可获得红会数字凭证。宠物照护岗位的其他能力和经营条件仍需核验。',
    action: '查看红会课程',
    links: [{ label: '前往红会官方课程页', url: 'https://www.redcross.org/take-a-class/first-aid/cat-dog-first-aid' }],
  },
};
