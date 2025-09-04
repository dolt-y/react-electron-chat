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

 Date: 04/03/2023 13:54:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for community_like_record
-- ----------------------------
DROP TABLE IF EXISTS `community_like_record`;
CREATE TABLE `community_like_record`  (
  `Id` bigint(0) NOT NULL AUTO_INCREMENT,
  `UserId` bigint(0) NOT NULL COMMENT '用户id',
  `CommunityId` int(0) NOT NULL COMMENT '动态id',
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE INDEX `Id`(`Id`) USING BTREE,
  INDEX `CommunityId`(`CommunityId`) USING BTREE,
  INDEX `UserId`(`UserId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
