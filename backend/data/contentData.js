/**
 * 展会展示内容数据源
 * 提供首页 / 资讯页 / 日程页所需的展示数据
 * 说明：当前为内置静态数据（与页面静态内容一致），后续可平滑替换为数据库查询
 * @desc 展示内容数据源
 * @author IFSIE 组委会
 * @version 1.0.0
 */

const exhibitionData = {
  exhibitors: "500+",
  visitors: "30,000",
  area: "50,000",
  forums: "20+"
};

// 日程数据：i18nKey 字段用于前端渲染时挂载 data-i18n 属性，保证多语言切换生效
const scheduleData = [
  // ---- 10月17日 | 第一天 ----
  { day: 1, time: "08:00", period: "上午", periodI18n: "schedule.time.am", title: "参展商进场搭建", titleI18n: "schedule.item1.title", speaker: "所有参展企业", speakerI18n: "schedule.item1.speaker", location: "各展馆", locationI18n: "schedule.item1.location", category: "筹备", categoryI18n: "schedule.item1.cat" },
  { day: 1, time: "09:00", period: "上午", periodI18n: "schedule.time.am", title: "开幕式 & 领导致辞", titleI18n: "schedule.item2.title", speaker: "主办单位领导、行业协会代表", speakerI18n: "schedule.item2.speaker", location: "主会场 | A馆舞台区", locationI18n: "schedule.item2.location", category: "开幕盛典", categoryI18n: "schedule.item2.cat" },
  { day: 1, time: "10:30", period: "上午", periodI18n: "schedule.time.am", title: "中国健身产业发展高峰论坛", titleI18n: "schedule.item3.title", speaker: "行业权威专家、知名企业CEO", speakerI18n: "schedule.item3.speaker", location: "论坛A厅 | B馆", locationI18n: "schedule.item3.location", category: "主题论坛", categoryI18n: "schedule.item3.cat" },
  { day: 1, time: "12:00", period: "中午", periodI18n: "schedule.time.noon", title: "午餐休息", titleI18n: "schedule.item12.title", speaker: "全体人员", speakerI18n: "schedule.item12.speaker", location: "餐饮区 | C馆", locationI18n: "schedule.item12.location", category: "休息", categoryI18n: "schedule.item12.cat" },
  { day: 1, time: "14:00", period: "下午", periodI18n: "schedule.time.pm", title: "智能健身新品发布会", titleI18n: "schedule.item4.title", speaker: "知名品牌代表", speakerI18n: "schedule.item4.speaker", location: "发布厅 | C馆", locationI18n: "schedule.item4.location", category: "新品发布", categoryI18n: "schedule.item4.cat" },
  { day: 1, time: "15:30", period: "下午", periodI18n: "schedule.time.pm", title: "健身器材技术交流会", titleI18n: "schedule.item13.title", speaker: "技术专家、工程师", speakerI18n: "schedule.item13.speaker", location: "会议室1 | B馆", locationI18n: "schedule.item13.location", category: "技术交流", categoryI18n: "schedule.item13.cat" },
  { day: 1, time: "16:00", period: "下午", periodI18n: "schedule.time.pm", title: "采购商专场对接会", titleI18n: "schedule.item5.title", speaker: "专业采购团、参展企业", speakerI18n: "schedule.item5.speaker", location: "商贸中心 | A馆", locationI18n: "schedule.item5.location", category: "商贸活动", categoryI18n: "schedule.item5.cat" },
  { day: 1, time: "17:30", period: "下午", periodI18n: "schedule.time.pm", title: "首日总结 & 欢迎晚宴", titleI18n: "schedule.item14.title", speaker: "组委会、参展商代表", speakerI18n: "schedule.item14.speaker", location: "宴会厅 | 配套酒店", locationI18n: "schedule.item14.location", category: "社交活动", categoryI18n: "schedule.item14.cat" },

  // ---- 10月18日 | 第二天 ----
  { day: 2, time: "09:00", period: "上午", periodI18n: "schedule.time.am", title: "展馆开放 & 观众入场", titleI18n: "schedule.item15.title", speaker: "全体观众", speakerI18n: "schedule.item15.speaker", location: "各展馆", locationI18n: "schedule.item15.location", category: "展览", categoryI18n: "schedule.item15.cat" },
  { day: 2, time: "09:30", period: "上午", periodI18n: "schedule.time.am", title: "智慧体育科技创新峰会", titleI18n: "schedule.item6.title", speaker: "技术专家、科研机构代表", speakerI18n: "schedule.item6.speaker", location: "论坛A厅 | B馆", locationI18n: "schedule.item6.location", category: "主题论坛", categoryI18n: "schedule.item6.cat" },
  { day: 2, time: "11:00", period: "上午", periodI18n: "schedule.time.am", title: "健身教练职业发展论坛", titleI18n: "schedule.item7.title", speaker: "资深教练、培训导师", speakerI18n: "schedule.item7.speaker", location: "论坛B厅 | B馆", locationI18n: "schedule.item7.location", category: "专业论坛", categoryI18n: "schedule.item7.cat" },
  { day: 2, time: "12:00", period: "中午", periodI18n: "schedule.time.noon", title: "午餐休息", titleI18n: "schedule.item12.title", speaker: "全体人员", speakerI18n: "schedule.item12.speaker", location: "餐饮区 | C馆", locationI18n: "schedule.item12.location", category: "休息", categoryI18n: "schedule.item12.cat" },
  { day: 2, time: "14:00", period: "下午", periodI18n: "schedule.time.pm", title: "户外运动装备趋势研讨会", titleI18n: "schedule.item8.title", speaker: "户外品牌代表、行业分析师", speakerI18n: "schedule.item8.speaker", location: "论坛A厅 | B馆", locationI18n: "schedule.item8.location", category: "专题研讨", categoryI18n: "schedule.item8.cat" },
  { day: 2, time: "15:30", period: "下午", periodI18n: "schedule.time.pm", title: "健身器材经销商大会", titleI18n: "schedule.item9.title", speaker: "经销商代表、厂商代表", speakerI18n: "schedule.item9.speaker", location: "会议室 | A馆", locationI18n: "schedule.item9.location", category: "商贸活动", categoryI18n: "schedule.item9.cat" },
  { day: 2, time: "17:00", period: "下午", periodI18n: "schedule.time.pm", title: "当日活动结束", titleI18n: "schedule.item16.title", speaker: "全体人员", speakerI18n: "schedule.item16.speaker", location: "各展馆", locationI18n: "schedule.item16.location", category: "结束", categoryI18n: "schedule.item16.cat" },

  // ---- 10月19日 | 第三天 ----
  { day: 3, time: "09:00", period: "上午", periodI18n: "schedule.time.am", title: "展馆开放 & 观众入场", titleI18n: "schedule.item15.title", speaker: "全体观众", speakerI18n: "schedule.item15.speaker", location: "各展馆", locationI18n: "schedule.item15.location", category: "展览", categoryI18n: "schedule.item15.cat" },
  { day: 3, time: "09:30", period: "上午", periodI18n: "schedule.time.am", title: "体育产业投融资论坛", titleI18n: "schedule.item10.title", speaker: "投资机构、创业项目代表", speakerI18n: "schedule.item10.speaker", location: "论坛A厅 | B馆", locationI18n: "schedule.item10.location", category: "主题论坛", categoryI18n: "schedule.item10.cat" },
  { day: 3, time: "11:00", period: "上午", periodI18n: "schedule.time.am", title: "健身俱乐部运营管理峰会", titleI18n: "schedule.item11.title", speaker: "连锁品牌CEO、运营专家", speakerI18n: "schedule.item11.speaker", location: "论坛B厅 | B馆", locationI18n: "schedule.item11.location", category: "专业论坛", categoryI18n: "schedule.item11.cat" },
  { day: 3, time: "12:00", period: "中午", periodI18n: "schedule.time.noon", title: "午餐休息", titleI18n: "schedule.item12.title", speaker: "全体人员", speakerI18n: "schedule.item12.speaker", location: "餐饮区 | C馆", locationI18n: "schedule.item12.location", category: "休息", categoryI18n: "schedule.item12.cat" },
  { day: 3, time: "13:30", period: "下午", periodI18n: "schedule.time.pm", title: "优秀产品评选颁奖典礼", titleI18n: "schedule.item17.title", speaker: "评委会、获奖企业代表", speakerI18n: "schedule.item17.speaker", location: "主会场 | A馆舞台区", locationI18n: "schedule.item17.location", category: "颁奖", categoryI18n: "schedule.item17.cat" },
  { day: 3, time: "14:00", period: "下午", periodI18n: "schedule.time.pm", title: "闭幕式 & 总结致辞", titleI18n: "schedule.item18.title", speaker: "主办单位领导、获奖企业代表", speakerI18n: "schedule.item18.speaker", location: "主会场 | A馆舞台区", locationI18n: "schedule.item18.location", category: "闭幕盛典", categoryI18n: "schedule.item18.cat" },
  { day: 3, time: "15:00", period: "下午", periodI18n: "schedule.time.pm", title: "参展商撤展", titleI18n: "schedule.item19.title", speaker: "所有参展企业", speakerI18n: "schedule.item19.speaker", location: "各展馆", locationI18n: "schedule.item19.location", category: "撤展", categoryI18n: "schedule.item19.cat" }
];

const brandsData = [
  { name: "必艾奇", shortName: "BH" },
  { name: "必确", shortName: "PRE" },
  { name: "诺德士", shortName: "NOH" },
  { name: "力健", shortName: "LIF" },
  { name: "赛佰斯", shortName: "CYB" },
  { name: "星驰", shortName: "STAR" },
  { name: "乔山", shortName: "JOI" },
  { name: "岱宇", shortName: "DYNA" },
  { name: "舒华", shortName: "SHUA" },
  { name: "凡圣", shortName: "FAN" },
  { name: "英派斯", shortName: "YOTTO" },
  { name: "好家庭", shortName: "HEALTH" }
];

const newsData = [
  {
    date: "2026-09-15",
    title: "2026国际健身体育产业博览会首批参展名单公布，行业巨头悉数亮相",
    titleI18n: "news.card1.title",
    excerpt: "本届国际健身体育产业博览会吸引了国内外500多家企业参展，涵盖健身器材、智慧体育、运动装备等多个领域...",
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
  }
];

module.exports = {
  exhibitionData,
  scheduleData,
  brandsData,
  newsData
};
