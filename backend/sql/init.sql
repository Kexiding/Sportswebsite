-- 创建数据库
CREATE DATABASE IF NOT EXISTS `zhanlt_expo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `zhanlt_expo`;

-- 观展预约表
CREATE TABLE IF NOT EXISTS `visitor_registrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '姓名',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `email` varchar(200) NOT NULL COMMENT '邮箱',
  `city` varchar(100) DEFAULT NULL COMMENT '所在城市',
  `company` varchar(255) NOT NULL COMMENT '公司名称',
  `position` varchar(255) NOT NULL COMMENT '职位',
  `visitor_type` varchar(50) DEFAULT 'general' COMMENT '观众类型',
  `visit_date` varchar(50) DEFAULT NULL COMMENT '意向观展日期',
  `visit_count` varchar(50) DEFAULT NULL COMMENT '参观人数',
  `interest` text COMMENT '感兴趣的展区(JSON数组)',
  `message` text COMMENT '备注信息',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：1=已提交, 2=已联系, 3=已完成',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='观展预约登记表';

-- 参展报名表
CREATE TABLE IF NOT EXISTS `exhibitor_applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_name` varchar(100) NOT NULL COMMENT '联系人姓名',
  `phone` varchar(20) NOT NULL COMMENT '联系电话',
  `email` varchar(200) NOT NULL COMMENT '邮箱',
  `company` varchar(255) NOT NULL COMMENT '公司名称',
  `brand` varchar(255) DEFAULT NULL COMMENT '品牌名称',
  `website` varchar(500) DEFAULT NULL COMMENT '公司网址',
  `is_first` varchar(10) DEFAULT NULL COMMENT '是否首次参展(yes/no)',
  `booth_type` varchar(50) NOT NULL COMMENT '展位类型',
  `exhibit_area` varchar(50) NOT NULL COMMENT '展位面积',
  `exhibit_type` varchar(50) NOT NULL COMMENT '参展类别',
  `services` text COMMENT '增值服务(JSON数组)',
  `products` text COMMENT '主营产品',
  `booth_requirements` text COMMENT '展位需求',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：1=已提交, 2=已联系, 3=已签约',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='参展报名登记表';
