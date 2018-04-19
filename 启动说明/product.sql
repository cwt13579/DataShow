/*
SQLyog Ultimate v11.24 (32 bit)
MySQL - 5.5.57 : Database - jfinal_demo
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`jfinal_demo` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `jfinal_demo`;

/*Table structure for table `blog` */

DROP TABLE IF EXISTS `blog`;

CREATE TABLE `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `content` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `blog` */

insert  into `blog`(`id`,`title`,`content`) values (1,'JFinal Demo Title here','JFinal Demo Content here'),(2,'test 1','test 1'),(3,'test 2','test 2'),(4,'test 3','test 3'),(5,'test 4','test 4');

/*Table structure for table `order` */

DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `order_time` datetime DEFAULT NULL,
  `order_area` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `order_product` int(11) DEFAULT NULL,
  `order_name` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `order_tel` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `order` */

/*Table structure for table `product` */

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '产品编号',
  `product_name` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '产品名称',
  `loan_term` int(8) DEFAULT NULL COMMENT '支持期限',
  `loan_amount` decimal(10,0) DEFAULT NULL COMMENT '金额范围',
  `loan_work` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '借款人职业1-上班族，2-个体户，3-无固定职业，4-学生',
  `loan_income` decimal(10,0) DEFAULT NULL COMMENT '月收入要求',
  `loan_workyears` int(8) DEFAULT NULL COMMENT '工龄要求',
  `loan_bisincome` decimal(10,0) DEFAULT NULL COMMENT '流水要求',
  `loan_bisyears` int(8) DEFAULT NULL COMMENT '经营时间要求',
  `loan_house` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '房产要求1-住宅，2-商铺，3-厂房',
  `loan_car` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '车辆要求',
  `loan_insurance` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '参保要求',
  `loan_credit` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '信用要求',
  `loan_age` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '年龄范围',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `product` */

insert  into `product`(`id`,`product_code`,`product_name`,`loan_term`,`loan_amount`,`loan_work`,`loan_income`,`loan_workyears`,`loan_bisincome`,`loan_bisyears`,`loan_house`,`loan_car`,`loan_insurance`,`loan_credit`,`loan_age`) values (1,'PFB310012','浦发宝',60,'50000','1',NULL,NULL,NULL,NULL,'1',NULL,NULL,NULL,NULL),(2,'ZS210012','招财宝',360,'100000','1',NULL,NULL,NULL,NULL,'1',NULL,NULL,NULL,NULL),(3,'HX1001','华夏宝',30,'12000','1',NULL,NULL,NULL,NULL,'1',NULL,NULL,NULL,NULL),(4,'MS900012','民生宝',121,'40000','1,2',NULL,NULL,NULL,NULL,'1,2,3',NULL,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
