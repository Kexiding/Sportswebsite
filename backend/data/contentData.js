/**
 * 展会展示内容数据源
 * 提供首页 / 资讯页 / 日程页所需的展示数据
 * 说明：当前为内置静态数据（与页面静态内容一致），后续可平滑替换为数据库查询
 * @desc 展示内容数据源
 * @author IFSIE 组委会
 * @version 1.1.0
 */

const exhibitionData = {
  exhibitors: "1200+",
  visitors: "4万+",
  area: "10万㎡",
  transaction: "20亿+"
};

// 日程数据：i18nKey 字段用于前端渲染时挂载 data-i18n 属性，保证多语言切换生效
// 展期：2026年10月15日-17日（第一天=10/15，第二天=10/16，第三天=10/17）
const scheduleData = [
  // ---- 10月15日 | 第一天 ----
  { day: 1, time: "09:00", period: "上午", periodI18n: "schedule.time.am", title: "开幕式 & 领导致辞", titleI18n: "schedule.item1.title", speaker: "主办单位领导、行业协会代表", speakerI18n: "schedule.item1.speaker", location: "主会场 | A馆舞台区", locationI18n: "schedule.item1.location", category: "开幕盛典", categoryI18n: "schedule.item1.cat" },
  { day: 1, time: "10:30", period: "上午", periodI18n: "schedule.time.am", title: "健身体育产业发展高峰论坛", titleI18n: "schedule.item2.title", speaker: "行业权威专家、知名企业CEO", speakerI18n: "schedule.item2.speaker", location: "论坛A厅 | B馆", locationI18n: "schedule.item2.location", category: "主题论坛", categoryI18n: "schedule.item2.cat" },
  { day: 1, time: "12:00", period: "中午", periodI18n: "schedule.time.noon", title: "午餐休息", titleI18n: "schedule.item3.title", speaker: "全体人员", speakerI18n: "schedule.item3.speaker", location: "餐饮区 | C馆", locationI18n: "schedule.item3.location", category: "休息", categoryI18n: "schedule.item3.cat" },
  { day: 1, time: "14:00", period: "下午", periodI18n: "schedule.time.pm", title: "品牌路演与新品发布", titleI18n: "schedule.item4.title", speaker: "知名品牌代表", speakerI18n: "schedule.item4.speaker", location: "发布厅 | C馆", locationI18n: "schedule.item4.location", category: "新品发布", categoryI18n: "schedule.item4.cat" },
  { day: 1, time: "15:30", period: "下午", periodI18n: "schedule.time.pm", title: "行业趋势发布与政策解读", titleI18n: "schedule.item5.title", speaker: "政策专家、行业分析师", speakerI18n: "schedule.item5.speaker", location: "论坛A厅 | B馆", locationI18n: "schedule.item5.location", category: "主题论坛", categoryI18n: "schedule.item5.cat" },
  { day: 1, time: "16:00", period: "下午", periodI18n: "schedule.time.pm", title: "采购商对接会", titleI18n: "schedule.item6.title", speaker: "专业采购团、参展企业", speakerI18n: "schedule.item6.speaker", location: "商贸中心 | A馆", locationI18n: "schedule.item6.location", category: "商贸活动", categoryI18n: "schedule.item6.cat" },
  { day: 1, time: "18:00", period: "下午", periodI18n: "schedule.time.pm", title: "首日总结 & 欢迎晚宴", titleI18n: "schedule.item7.title", speaker: "组委会、参展商代表", speakerI18n: "schedule.item7.speaker", location: "宴会厅 | 配套酒店", locationI18n: "schedule.item7.location", category: "社交活动", categoryI18n: "schedule.item7.cat" },

  // ---- 10月16日 | 第二天 ----
  { day: 2, time: "09:00", period: "上午", periodI18n: "schedule.time.am", title: "展馆开放 & 观众入场", titleI18n: "schedule.item8.title", speaker: "全体观众", speakerI18n: "schedule.item8.speaker", location: "各展馆", locationI18n: "schedule.item8.location", category: "展览", categoryI18n: "schedule.item8.cat" },
  { day: 2, time: "10:00", period: "上午", periodI18n: "schedule.time.am", title: "数字化转型与智慧体育论坛", titleI18n: "schedule.item9.title", speaker: "技术专家、科研机构代表", speakerI18n: "schedule.item9.speaker", location: "论坛A厅 | B馆", locationI18n: "schedule.item9.location", category: "主题论坛", categoryI18n: "schedule.item9.cat" },
  { day: 2, time: "13:00", period: "下午", periodI18n: "schedule.time.pm", title: "健身健美赛事", titleI18n: "schedule.item10.title", speaker: "赛事组委会、参赛选手", speakerI18n: "schedule.item10.speaker", location: "赛事区 | D馆", locationI18n: "schedule.item10.location", category: "赛事活动", categoryI18n: "schedule.item10.cat" },
  { day: 2, time: "14:30", period: "下午", periodI18n: "schedule.time.pm", title: "运动健康公开课", titleI18n: "schedule.item11.title", speaker: "健康专家、资深教练", speakerI18n: "schedule.item11.speaker", location: "互动区 | C馆", locationI18n: "schedule.item11.location", category: "体验活动", categoryI18n: "schedule.item11.cat" },
  { day: 2, time: "15:30", period: "下午", periodI18n: "schedule.time.pm", title: "经销商招募大会", titleI18n: "schedule.item12.title", speaker: "经销商代表、厂商代表", speakerI18n: "schedule.item12.speaker", location: "会议室 | A馆", locationI18n: "schedule.item12.location", category: "商贸活动", categoryI18n: "schedule.item12.cat" },
  { day: 2, time: "17:00", period: "下午", periodI18n: "schedule.time.pm", title: "当日活动结束", titleI18n: "schedule.item13.title", speaker: "全体人员", speakerI18n: "schedule.item13.speaker", location: "各展馆", locationI18n: "schedule.item13.location", category: "结束", categoryI18n: "schedule.item13.cat" },

  // ---- 10月17日 | 第三天 ----
  { day: 3, time: "09:00", period: "上午", periodI18n: "schedule.time.am", title: "展馆开放 & 观众入场", titleI18n: "schedule.item8.title", speaker: "全体观众", speakerI18n: "schedule.item8.speaker", location: "各展馆", locationI18n: "schedule.item8.location", category: "展览", categoryI18n: "schedule.item8.cat" },
  { day: 3, time: "10:30", period: "上午", periodI18n: "schedule.time.am", title: "互动体验区活动", titleI18n: "schedule.item14.title", speaker: "全体观众", speakerI18n: "schedule.item14.speaker", location: "互动区 | C馆", locationI18n: "schedule.item14.location", category: "体验活动", categoryI18n: "schedule.item14.cat" },
  { day: 3, time: "13:30", period: "下午", periodI18n: "schedule.time.pm", title: "优秀产品评选颁奖典礼", titleI18n: "schedule.item15.title", speaker: "评委会、获奖企业代表", speakerI18n: "schedule.item15.speaker", location: "主会场 | A馆舞台区", locationI18n: "schedule.item15.location", category: "颁奖", categoryI18n: "schedule.item15.cat" },
  { day: 3, time: "14:30", period: "下午", periodI18n: "schedule.time.pm", title: "闭幕式 & 总结致辞", titleI18n: "schedule.item16.title", speaker: "主办单位领导、获奖企业代表", speakerI18n: "schedule.item16.speaker", location: "主会场 | A馆舞台区", locationI18n: "schedule.item16.location", category: "闭幕盛典", categoryI18n: "schedule.item16.cat" },
  { day: 3, time: "16:00", period: "下午", periodI18n: "schedule.time.pm", title: "参展商撤展", titleI18n: "schedule.item17.title", speaker: "所有参展企业", speakerI18n: "schedule.item17.speaker", location: "各展馆", locationI18n: "schedule.item17.location", category: "撤展", categoryI18n: "schedule.item17.cat" }
];

// 重点参展品牌（拟邀）——按四大领域分类
// category: equipment(健身器材) / tech(体育科技与智能穿戴) / apparel(运动服饰与装备) / nutrition(运动营养)
const brandsData = [
  // 健身器材领域
  { name: "乔山健康科技", shortName: "JOH", category: "equipment", desc: "全球知名健身器材制造商，产品线覆盖高端商用与家用设备，品质享誉国际" },
  { name: "舒华体育", shortName: "SHUA", category: "equipment", desc: "国内健身器材领军企业，提供专业的智能健身解决方案与全品类健身设备" },
  { name: "英派斯", shortName: "IMP", category: "equipment", desc: "集研发、生产、销售于一体，专注打造高品质商用及家用健身器材" },
  { name: "必确", shortName: "PRE", category: "equipment", desc: "源自美国的高端健身器材品牌，以创新设计和卓越性能著称，全球高端健身房首选品牌之一" },
  { name: "Life Fitness", shortName: "LIF", category: "equipment", desc: "全球健身器材行业的领导者，产品广泛应用于顶级酒店、俱乐部及高端住宅" },
  { name: "澳瑞特", shortName: "ORI", category: "equipment", desc: "国内健身器材行业的老牌劲旅，专注全民健身路径器材及商用健身设备研发生产" },
  { name: "麦瑞克", shortName: "MER", category: "equipment", desc: "智能健身领域的新锐标杆，以\"科技+健身\"为核心，打造极具未来感的智能健身生态" },
  // 体育科技与智能穿戴领域
  { name: "华为终端", shortName: "HUA", category: "tech", desc: "以智能穿戴与运动健康技术为核心，构建全场景智慧体育生态，赋能全民健康生活" },
  { name: "科大讯飞", shortName: "IFLY", category: "tech", desc: "深耕智能语音与AI交互，打造体育赛事智能解说、运动数据智能分析等创新应用" },
  { name: "商汤科技", shortName: "ST", category: "tech", desc: "领先的AI视觉技术，赋能体育动作捕捉、智能裁判辅助及场馆智慧化管理系统" },
  { name: "仙库智能", shortName: "SEN", category: "tech", desc: "专注IoT与大数据分析，为智慧场馆提供精准的运动监测与管理方案" },
  { name: "宇树科技", shortName: "UNI", category: "tech", desc: "全球顶尖的高性能四足机器人研发者，探索仿生机器人在运动康复、辅助训练及赛事服务中的应用" },
  // 运动服饰与装备领域
  { name: "李宁", shortName: "LINING", category: "apparel", desc: "国民运动标杆，融合东方美学与运动科技，覆盖篮球、跑步、健身全品类" },
  { name: "安踏", shortName: "ANTA", category: "apparel", desc: "全球体育用品领军者，多品牌国际化布局，深耕专业运动与大众休闲领域" },
  { name: "特步", shortName: "XTEP", category: "apparel", desc: "中国田径协会官方合作伙伴，专注跑步领域，以科技赋能跑步装备" },
  { name: "卡尔美", shortName: "KEL", category: "apparel", desc: "源自西班牙，深耕足球等专业运动装备，为全球众多足球俱乐部及专业赛事提供专业装备支持" },
  { name: "361°", shortName: "361", category: "apparel", desc: "倡导\"多一度热爱\"，全场景运动时尚，产品涵盖跑步、篮球、综训等多个领域" },
  { name: "迈克达威", shortName: "MCD", category: "apparel", desc: "全球顶级运动防护品牌，专注运动安全，研发各类专业运动护具" },
  // 运动营养领域
  { name: "汤臣倍健", shortName: "BYH", category: "nutrition", desc: "中国膳食营养补充剂领导品牌，秉持\"取自全球，健康全家\"理念，提供高品质营养解决方案" },
  { name: "康比特", shortName: "CPT", category: "nutrition", desc: "国内运动营养行业先行者，专注于运动健康食品研发，服务于各类运动人群与健身爱好者" },
  { name: "肌肉科技", shortName: "MT", category: "nutrition", desc: "全球知名运动营养品牌，以科学配方与高效增肌产品著称，引领全球运动营养市场潮流" },
  { name: "诺特兰德", shortName: "NUT", category: "nutrition", desc: "欧洲知名运动营养品牌，产品线覆盖蛋白补充、能量补给、维生素矿物质等全场景" },
  { name: "百淬", shortName: "BIO", category: "nutrition", desc: "源自加拿大的天然运动营养品牌，主打无糖、无咖啡因的电解质补充产品" }
];

const newsData = [
  {
    date: "2026-09-15",
    title: "2026国际健身体育产业博览会首批参展名单公布，行业巨头悉数亮相",
    titleI18n: "news.card1.title",
    excerpt: "本届国际健身体育产业博览会吸引了国内外1200多家企业参展，涵盖健身器材、体育科技、运动装备、运动营养等多个领域...",
    excerptI18n: "news.card1.desc",
    url: "news.html#n1"
  },
  {
    date: "2026-09-10",
    title: "智能健身成新趋势，多款AI产品将亮相国际健身体育产业博览会",
    titleI18n: "news.card2.title",
    excerpt: "随着人工智能技术的发展，智能健身设备正成为行业新热点，本届展会将集中展示...",
    excerptI18n: "news.card2.desc",
    url: "news.html#n2"
  },
  {
    date: "2026-09-05",
    title: "专业采购商预登记通道开启，尊享VIP观展服务",
    titleI18n: "news.card3.title",
    excerpt: "为方便专业采购商观展，组委会特别开通预登记通道，预登记观众可享受多重VIP服务...",
    excerptI18n: "news.card3.desc",
    url: "news.html#n3"
  },
  {
    date: "2026-08-28",
    title: "三大主题论坛阵容公布，共话健身体育产业未来",
    titleI18n: "news.card4.title",
    excerpt: "健身体育产业发展高峰论坛、数字化转型与智慧体育论坛、行业趋势发布与政策解读三大论坛同期举办，汇聚行业权威专家与企业领袖...",
    excerptI18n: "news.card4.desc",
    url: "news.html#n4"
  },
  {
    date: "2026-08-20",
    title: "六大主题展区全景规划发布，覆盖健身体育全产业链",
    titleI18n: "news.card5.title",
    excerpt: "健身器材、体育科技、运动服饰、运动营养、康养康复、户外极限六大展区科学配比，全面覆盖健身体育全产业链...",
    excerptI18n: "news.card5.desc",
    url: "news.html#n5"
  },
  {
    date: "2026-08-15",
    title: "首届展会享培育期政策上浮60%特别优惠，参展性价比凸显",
    titleI18n: "news.card6.title",
    excerpt: "作为首届全新展览，参展企业可享培育期政策上浮60%的特别优惠，大幅降低投入成本，提升参展性价比...",
    excerptI18n: "news.card6.desc",
    url: "news.html#n6"
  }
];

module.exports = {
  exhibitionData,
  scheduleData,
  brandsData,
  newsData
};
