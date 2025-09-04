/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80027
 Source Host           : localhost:3306
 Source Schema         : haschat

 Target Server Type    : MySQL
 Target Server Version : 80027
 File Encoding         : 65001

 Date: 04/03/2023 13:54:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for community
-- ----------------------------
DROP TABLE IF EXISTS `community`;
CREATE TABLE `community`  (
  `Id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Id',
  `PublishId` bigint(0) NOT NULL COMMENT '发布者Id',
  `AvatarUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '头像',
  `PublishName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '发布用户名称',
  `ImgList` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图片列表',
  `Type` int(0) NULL DEFAULT NULL COMMENT '类型',
  `Title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标题',
  `Content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '内容',
  `CreateDateUtc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建时间',
  `WatchCount` int(0) NOT NULL DEFAULT 0 COMMENT '关注数量',
  `IsLike` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否喜爱',
  `LikeNum` int(0) NOT NULL DEFAULT 0 COMMENT '喜爱数量',
  `CommentNum` int(0) NOT NULL DEFAULT 0 COMMENT '评论数量',
  `TransmitCount` int(0) NOT NULL DEFAULT 0 COMMENT '转发数量',
  `ShareCount` int(0) NOT NULL DEFAULT 0 COMMENT '分享数量',
  `IsFollow` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否关注',
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE INDEX `Id`(`Id`) USING BTREE,
  INDEX `PublishId`(`PublishId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
