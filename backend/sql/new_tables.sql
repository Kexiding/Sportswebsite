USE `zhanlt_expo`;

-- 工作人员报名表
CREATE TABLE IF NOT EXISTS `staff_registrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '姓名',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `email` varchar(200) DEFAULT NULL COMMENT '邮箱',
  `id_card` varchar(18) DEFAULT NULL COMMENT '身份证号',
  `department` varchar(100) DEFAULT NULL COMMENT '所属部门',
  `position` varchar(100) DEFAULT NULL COMMENT '职务',
  `work_type` varchar(50) DEFAULT NULL COMMENT '工作类型(安保/接待/布展/后勤/其他)',
  `work_experience` text COMMENT '相关工作经验',
  `emergency_contact` varchar(100) DEFAULT NULL COMMENT '紧急联系人',
  `emergency_phone` varchar(20) DEFAULT NULL COMMENT '紧急联系电话',
  `remark` text COMMENT '备注',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：1=已提交, 2=审核通过, 3=已上岗, 4=已完成',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工作人员报名登记表';


-- 志愿者报名表
CREATE TABLE IF NOT EXISTS `volunteer_registrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '姓名',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `email` varchar(200) DEFAULT NULL COMMENT '邮箱',
  `id_card` varchar(18) DEFAULT NULL COMMENT '身份证号',
  `gender` varchar(4) DEFAULT NULL COMMENT '性别(男/女)',
  `age` tinyint(3) DEFAULT NULL COMMENT '年龄',
  `school` varchar(200) DEFAULT NULL COMMENT '学校/单位',
  `major` varchar(100) DEFAULT NULL COMMENT '专业/特长',
  `education` varchar(50) DEFAULT NULL COMMENT '学历',
  `available_dates` varchar(200) DEFAULT NULL COMMENT '可服务日期(如:10月17日,10月18日)',
  `service_type` varchar(200) DEFAULT NULL COMMENT '意向服务类型(引导/翻译/后勤/其他,逗号分隔)',
  `languages` varchar(200) DEFAULT NULL COMMENT '语言能力(如:英语CET6,日语N2)',
  `volunteer_experience` text COMMENT '志愿服务经历',
  `self_intro` text COMMENT '自我介绍',
  `emergency_contact` varchar(100) DEFAULT NULL COMMENT '紧急联系人',
  `emergency_phone` varchar(20) DEFAULT NULL COMMENT '紧急联系电话',
  `remark` text COMMENT '备注',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：1=已提交, 2=审核通过, 3=已录用, 4=已完成',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='志愿者报名登记表';


-- 嘉宾报名表
CREATE TABLE IF NOT EXISTS `guest_registrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '姓名',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `email` varchar(200) NOT NULL COMMENT '邮箱',
  `company` varchar(255) NOT NULL COMMENT '所在单位',
  `position` varchar(100) DEFAULT NULL COMMENT '职务/头衔',
  `title` varchar(200) DEFAULT NULL COMMENT '嘉宾称号(如:行业专家/教授/CEO)',
  `guest_type` varchar(50) DEFAULT NULL COMMENT '嘉宾类型(演讲嘉宾/论坛嘉宾/颁奖嘉宾/其他)',
  `topic` varchar(500) DEFAULT NULL COMMENT '演讲/分享主题',
  `introduction` text COMMENT '个人简介',
  `photo_url` varchar(500) DEFAULT NULL COMMENT '头像照片URL',
  `is_public` tinyint(1) DEFAULT '1' COMMENT '是否公开展示：1=是, 0=否',
  `remark` text COMMENT '备注',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：1=已提交, 2=已确认, 3=已到会, 4=已完成',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='嘉宾报名登记表';
