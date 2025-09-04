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

 Date: 04/03/2023 13:54:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for community_comment
-- ----------------------------
DROP TABLE IF EXISTS `community_comment`;
CREATE TABLE `community_comment`  (
  `Id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `CommunityId` bigint(0) NOT NULL COMMENT '动态id',
  `SendId` bigint(0) NOT NULL COMMENT '发送者id',
  `Type` int(0) NOT NULL DEFAULT 0 COMMENT '类型：0留言，1回复',
  `SendName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '发送者姓名',
  `ReceiverId` bigint(0) NULL DEFAULT NULL COMMENT '接收者id',
  `ReceiverName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '接收者姓名',
  `AvatarUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '头像',
  `Content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '内容',
  `CreateDateUtc` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建时间',
  `Status` int(0) NOT NULL DEFAULT 0 COMMENT '阅读状态：0否，1是',
  `CommunityImg` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '社区图片',
  `CommunityContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '社区评论',
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE INDEX `Id`(`Id`) USING BTREE,
  INDEX `CommunityId`(`CommunityId`) USING BTREE,
  INDEX `Status`(`Status`) USING BTREE,
  CONSTRAINT `Id_CommunityId` FOREIGN KEY (`CommunityId`) REFERENCES `community` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 58 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
